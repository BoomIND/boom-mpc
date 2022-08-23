const { EcdsaParty2 } = require("../dist/src");
const crypto = require("crypto");
const express = require("express");

const app = express();
app.use(express.json())
const port = 3005;

const P1_ENDPOINT = "http://localhost:8000";
let party2ChildShare, party2

const init = async () => {
  party2 = new EcdsaParty2(P1_ENDPOINT);
  const party2MasterKeyShare = await party2.generateMasterKey();
  console.log(party2MasterKeyShare.getPublicKey())
  console.log(party2MasterKeyShare.getPublicKey().encode("hex"))
  party2ChildShare = party2.getChildShare(party2MasterKeyShare, 0, 0);
  console.log(party2ChildShare.getPublicKey().encode("hex"))
  console.log(party2ChildShare)
}

async function generateTwoPartyEcdsaSignature(msg) {
  // const msgHash = crypto.createHash("sha256").update(msg).digest();
  console.log('hash', msg)
  const signature = await party2.sign(msg, party2ChildShare, 0, 0);
  console.log(JSON.stringify(signature));
  return signature;
  // {"r": <32-bytes-hex>,"s": <32-bytes-hex>,"recid": <0 or 1>}
}

app.post("/", async (req, res) => {
  const { msg } = req.body;
  const signature = await generateTwoPartyEcdsaSignature(msg);
  res.json(signature);
});

init()

app.listen(port, () => {
  console.log(`MPC app listening on port ${port}`)
})