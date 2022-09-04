// console.log('All envs are ', process.env)
import { EcdsaParty2, EcdsaParty2Share } from ".";
import { CredStash, credStashInit } from "./vault";
import express, { Request, Response } from "express";
import ServerlessHttp from "serverless-http";

const PORT = process.env.PORT ?? 3005;
const P1_ENDPOINT = process.env.P1_ENDPOINT ?? "http://localhost:8000";
const party2: EcdsaParty2 = new EcdsaParty2(P1_ENDPOINT);
const credStash: CredStash = credStashInit({
  table: "dev-party2-secrets",
  kmsKey: "alias/oasis/vault",
  awsOpts: {
    region: "ap-south-1",
  },
});

class HttpException extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

async function generateTwoPartyEcdsaSignature(
  msg: string,
  party2ChildShare: EcdsaParty2Share
) {
  const signature = await party2.sign(msg, party2ChildShare, 0, 0);
  console.log(JSON.stringify(signature));
  return signature;
  // {"r": <32-bytes-hex>,"s": <32-bytes-hex>,"recid": <0 or 1>}
}

async function generateOrFetchPart2MasterKey() {
  const party2MasterKeyShare = await party2.generateMasterKey();
  return party2MasterKeyShare;
}

const app = express();
app.use(express.json());

app.get("/health", async (req, res) => {
  res.json({});
});

app.post("/sign", async (req, res, next) => {
  const { msg, keyId } = req.body;
  const key = await credStash.getSecret({
    name: keyId,
  });
  if (!key) {
    next(new HttpException(404, "Not Found"));
    return;
  }
  const party2MasterShare = EcdsaParty2Share.fromPlain({
    id: keyId,
    master_key: JSON.parse(key),
  });
  const signature = await party2.sign(msg, party2MasterShare, 0, 0);
  console.log(JSON.stringify(signature));
  res.json({
    r: signature.r,
    s: signature.s,
    recid: signature.recid,
  });
});

app.post("/generateKey", async (req, res) => {
  const { chainPath } = req.body;
  const party2MasterKeyShare = await generateOrFetchPart2MasterKey();
  const party2ChildShare = party2.getChildShare(party2MasterKeyShare, 0, 0);
  const masterKey = party2MasterKeyShare.getPrivateKey();
  await credStash.putSecret({
    name: party2ChildShare.id,
    secret: JSON.stringify(masterKey),
  });
  const hex = party2ChildShare.getPublicKey().encode("hex", false);
  res.json({
    publicKey: hex,
    id: party2ChildShare.id,
  });
});

app.post("/fetchPublicKey", async (req, res, next) => {
  const { chainPath, keyId } = req.body;
  // const party2MasterKeyShare = await generateOrFetchPart2MasterKey();
  const key = await credStash.getSecret({
    name: keyId,
  });
  if (!key) {
    next(new HttpException(404, "Not Found"));
    return;
  }
  const party2MasterKeyShare: EcdsaParty2Share = EcdsaParty2Share.fromPlain({
    id: keyId,
    master_key: JSON.parse(key),
  });
  const party2ChildShare = party2.getChildShare(party2MasterKeyShare, 0, 0);
  const hex = party2ChildShare.getPublicKey().encode("hex", false);
  res.json({
    publicKey: hex,
    id: keyId,
  });
});

app.use(async (req, res, next) => {
  var err = new HttpException(404, "Not Found");
  next(err);
});

app.use(function (
  err: HttpException,
  req: Request,
  res: Response,
  next: Function
) {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {},
    },
  });
});

export const handler = ServerlessHttp(app);
