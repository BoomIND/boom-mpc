import { EcdsaParty2, EcdsaParty2Share } from ".";
import express from "express";
import ServerlessHttp from "serverless-http";

const PORT = process.env.PORT ?? 3005;
const P1_ENDPOINT = process.env.P1_ENDPOINT ?? "http://localhost:8000";

let party2ChildShare: EcdsaParty2Share, party2: EcdsaParty2;

const init = async () => {
  try {
    console.log("Initializing...");
    party2 = new EcdsaParty2(P1_ENDPOINT);
    const party2MasterKeyShare = await party2.generateMasterKey();
    party2ChildShare = party2.getChildShare(party2MasterKeyShare, 0, 0);
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
  res.json({});
});
app.post("/", async (req, res) => {
  const { msg } = req.body;
  const signature = await generateTwoPartyEcdsaSignature(msg);
  res.json(signature);
});

// init();
export const handler = ServerlessHttp(app);
