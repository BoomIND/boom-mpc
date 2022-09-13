var axios = require("axios");
var baseUrl = "https://j33cxwpvof.execute-api.ap-south-1.amazonaws.com/dev";

const main = async () => {
  try {
    const { id, publicKey } = (
      await axios.post(`${baseUrl}/generateKey`, {})
    ).data;
    console.log(`generateKey ${id}, ${publicKey}`)
    const publicKeyResp = (
      await axios.post(`${baseUrl}/fetchPublicKey`, {
        keyId: id,
      })
    ).data;
    console.log(`fetchedKey ${publicKeyResp.id}, ${publicKeyResp.publicKey}`)
    for (var i =0; i<10; i++) {
      const sign = (
        await axios.post(`${baseUrl}/sign`, {
          keyId: 'f83eb11d-4436-4579-b0c9-e8cece3d8a02',
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
