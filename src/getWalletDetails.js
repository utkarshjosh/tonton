const TonWeb = require("tonweb");

const main = async () => {
  const tonweb = new TonWeb(
    new TonWeb.HttpProvider("https://testnet.toncenter.com/api/v2/jsonRPC", {
      apiKey: "YOUR_TESTNET_TONCENTER_API_KEY",
    })
  );

  const publicKey = "EQCjQl3kxm-CwYQDEJ5z2wf08hDfAWr_liv7hwjC4I1cwdDl";
  //   const wallet = tonweb.wallet.create({ publicKey });

  //   const address = await wallet.getAddress();
  //
  //   const nonBounceableAddress = address.toString(true, true, false);

  //   const seqno = await wallet.methods.seqno().call();
  const balance = await tonweb.getBalance(publicKey);

  console.log("-----details====");
  console.log("--- publicKey ", publicKey);
  //   console.log("--- address ", address);
  //   console.log("--- nonBounceable ", nonBounceableAddress);
  //   console.log("--- seqNo ", seqno);
  console.log("--- balance ", balance);
  // await wallet.deploy(secretKey).send(); // deploy wallet to blockchain
};

main();
