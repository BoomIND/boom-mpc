// console.log('All envs are ', process.env)
import { EcdsaParty2, EcdsaParty2Share } from ".";
import express, { Request, Response } from "express";
import ServerlessHttp from "serverless-http";

const PORT = process.env.PORT ?? 3005;
const P1_ENDPOINT = process.env.P1_ENDPOINT ?? "http://localhost:8000";

let party2ChildShare: EcdsaParty2Share, party2: EcdsaParty2;

class HttpException extends Error {
  public status: number;
  public message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

const init = async () => {
  try {
    console.log("Initializing...");
    party2 = new EcdsaParty2(P1_ENDPOINT);
    let t = Date.now();
    const party2MasterKeyShare = await party2.generateMasterKey();
    console.log(`generateMasterKey took ${Date.now() - t}`)
    t = Date.now();
    party2ChildShare = party2.getChildShare(party2MasterKeyShare, 0, 0);
    console.log(`getChildShare took ${Date.now() - t}`)
    console.log(party2ChildShare.getPublicKey().encode("hex", false));
    console.log("Initialized...");
  } catch (error) {
    console.error("init error", error);
  }
};

async function generateTwoPartyEcdsaSignature(msg: string) {
  console.log("hash", msg);
  const signature = await party2.sign(msg, party2ChildShare, 0, 0);
  console.log(JSON.stringify(signature));
  return signature;
  // {"r": <32-bytes-hex>,"s": <32-bytes-hex>,"recid": <0 or 1>}
}

const app = express();
app.use(express.json());
app.get("/health", async (req, res) => {
  // await init();
  res.json({});
});
app.post("/", async (req, res) => {
  let t = Date.now();
  await init();
  console.log(`init took took ${Date.now() - t}`)
  const { msg } = req.body;
  t = Date.now()
  const signature = await generateTwoPartyEcdsaSignature(msg);
  console.log(`signing took ${Date.now() - t}`)
  res.json(signature);
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

// init();
export const handler = ServerlessHttp(app);
