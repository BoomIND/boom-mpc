import { EcdsaParty2, EcdsaParty2Share } from ".";
import { CredStash, credStashInit } from "./vault";
import express, { Request, Response } from "express";
import axios from "axios";
import aws4 from "aws4";

const PORT = process.env.PORT ?? 3005;
const P1_ENDPOINT = process.env.P1_ENDPOINT ?? "https://p1.boom.fan";
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

const app = express();
app.use(express.json());

app.get("/dev/health", async (req, res, next) => {
  try {
    const rsp = await axios.get(`${P1_ENDPOINT}/health`);
    res.json({
      p1: rsp.status,
    });
  } catch (err) {
    console.error('error while calling p1', err)
    next(err);
  }
});

app.post("/sign", async (req, res, next) => {
  const { msg, keyId } = req.body;
  const chainCode = req.body.chainCode || 0;
  const key = await credStash.getSecret({
    name: keyId,
  });
  if (!key) {
    next(new HttpException(404, "Not Found"));
    return;
  }
  console.log("key", JSON.parse(key));
  const party2MasterShare = EcdsaParty2Share.fromPlain({
    id: keyId,
    master_key: JSON.parse(key),
  });
  const signature = await party2.sign(
    msg,
    party2.getChildShare(party2MasterShare, 10, chainCode),
    10,
    chainCode
  );
  console.log(JSON.stringify(signature));
  res.json({
    r: signature.r,
    s: signature.s,
    recid: signature.recid,
  });
});

app.post("/generateKey", async (req, res) => {
  const chainCode = req.body.chainCode || 0;
  const party2MasterKeyShare = await party2.generateMasterKey();
  const party2ChildShare = party2.getChildShare(
    party2MasterKeyShare,
    10,
    chainCode
  );
  const masterKey = party2MasterKeyShare.getPrivateKey();
  await credStash.putSecret({
    name: party2ChildShare.id,
    secret: JSON.stringify(masterKey),
  });
  console.log("saved key", JSON.stringify(masterKey));
  const hex = party2ChildShare.getPublicKey().encode("hex", false);
  res.json({
    publicKey: hex,
    id: party2ChildShare.id,
  });
});

app.post("/fetchPublicKey", async (req, res, next) => {
  const { keyId } = req.body;
  const chainCode = req.body.chainCode || 0;
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
  const party2ChildShare = party2.getChildShare(
    party2MasterKeyShare,
    10,
    chainCode
  );
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

export default app;
