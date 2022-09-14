var axios = require("axios");
var baseUrl = "https://j33cxwpvof.execute-api.ap-south-1.amazonaws.com/dev";

const main = async () => {
  try {
    let id, publicKey;
    if (!process.env.KEY_ID) {
      const r = (
        await axios.post(`${baseUrl}/generateKey`, {})
      ).data;
      console.log(`generateKey ${r.id}, ${r.publicKey}`)
      id = r.id
      publicKey = r.publicKey
    } else {
      const publicKeyResp = (
        await axios.post(`${baseUrl}/fetchPublicKey`, {
          keyId: process.env.KEY_ID,
        })
      ).data;
      console.log(`fetchedKey ${publicKeyResp.id}, ${publicKeyResp.publicKey}`)
      id = publicKeyResp.id
      publicKey = publicKeyResp.publicKey
    }
    for (var i =0; i<10; i++) {
      const sign = (
        await axios.post(`${baseUrl}/sign`, {
          keyId: id,
          msg: `5d9f06235dc98bf33efda3d575c8f8be0301fd73ab14a16f63c0623ed4ec741${i}`,
        })
      ).data;
      console.log(`sign for 5d9f06235dc98bf33efda3d575c8f8be0301fd73ab14a16f63c0623ed4ec741${i} is`, sign);
    }
  } catch (err) {
    console.error(err);
  }
};
main();
