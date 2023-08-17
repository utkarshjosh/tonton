// require("buffer");

import { TonClient, WalletContractV4, internal } from "ton";
import { mnemonicNew, mnemonicToPrivateKey } from "ton-crypto";
import { createNewWallet } from "./tonWallet";
const run = async () => {
  // Create Client
  const client = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
  });

  // Generate new key
  let mnemonics = await mnemonicNew();
  let keyPair = await mnemonicToPrivateKey(mnemonics);

  // Create wallet contract
  let workchain = 0; // Usually you need a workchain 0
  let wallet = WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
  let contract = client.open(wallet);

  // Get balance
  let balance: bigint = await contract.getBalance();
  console.log("balne --", { balance });
  // Create a transfer
  // let seqno: number = await contract.getSeqno();
  // let transfer: any = await contract.createTransfer({
  //   seqno,
  //   secretKey: Buffer(),
  //   messages: [
  //     internal({
  //       value: "1.5",
  //       dest: "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N",
  //       body: "Hello world",
  //     }),
  //   ],
  // });
};

createNewWallet();
