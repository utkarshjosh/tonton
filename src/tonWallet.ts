import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey, mnemonicNew } from "ton-crypto";
import { TonClient, WalletContractV4, internal } from "ton";
const base64url = require("base64url");

async function createNewWallet() {
  // open wallet v4 (set your correct wallet version here)
  const mnemonic =
    "strong bracket fine express riot casino smart stone material distance nation coconut garage sad toss expand leopard grape disease crisp punch cannon ring item"; // insert a mnemonic for a wallet that has funds
  const FUNDING_key = await mnemonicToWalletKey(mnemonic.split(" "));
  const fundingWallet = WalletContractV4.create({ publicKey: FUNDING_key.publicKey, workchain: 0 });

  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });
  let contract = client.open(fundingWallet);
  const seqno = await contract.getSeqno();

  // Get balance
  let balance: bigint = await contract.getBalance();
  console.log("----funding wallet:---- ");
  console.log("--- address: ", fundingWallet.address.toString());
  console.log("--- walletAddressTEST: ", fundingWallet.address.toString({ testOnly: true }));
  console.log("--- workchain: ", fundingWallet.address.workChain);
  console.log("--- balance: ", balance);
  console.log("--- seqno: ", seqno);
  console.log("--- isContractDeployed: ", await client.isContractDeployed(fundingWallet.address));
  // console.log("--- secretKey: ", FUNDING_key.secretKey);
  // creating new wallet
  let m = await mnemonicNew();
  const { publicKey } = await initializeWallet(fundingWallet, FUNDING_key.secretKey, m);
  return {
    mnemonic: m,
    contractType: "walletv4",
    publicKey,
  };
}

async function initializeWallet(
  fundingWallet: WalletContractV4,
  fundingSecret: Buffer,
  mnemonic: string[]
): Promise<any> {
  // open wallet v4 (notice the correct wallet version here)
  const key = await mnemonicToWalletKey(mnemonic);
  const generatedWallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // send 0.1 TON from funding wallet to new wallet
  let walletContract = client.open(fundingWallet);
  let seqno = await walletContract.getSeqno();

  try {
    await walletContract.sendTransfer({
      secretKey: fundingSecret,
      seqno: seqno,
      messages: [
        internal({
          to: generatedWallet.address,
          value: "0.1", // 0.001 TON
          bounce: false,
        }),
      ],
    });
    console.log("funding to ", generatedWallet.address.toString(), "is funded with 0.09 ton");
    await waitForTransaction(seqno, walletContract);
  } catch (e) {
    console.log("sendTransfer funding error");
    return console.log({ e });
  }

  // send 0.9 back TON to funding wallet

  walletContract = client.open(generatedWallet);
  seqno = await walletContract.getSeqno();
  let balance1: bigint = await walletContract.getBalance();
  console.log("----generated wallet:---- ");
  console.log("--- address: ", generatedWallet.address.toString());
  console.log("--- walletAddressTEST: ", generatedWallet.address.toString({ testOnly: true }));
  console.log("--- workchain: ", generatedWallet.address.workChain);
  console.log("--- balance: ", balance1);
  console.log("--- seqno: ", seqno);
  console.log("--- isContractDeployed: ", await client.isContractDeployed(generatedWallet.address));
  console.log("--- secretKey: ", key.secretKey);
  try {
    await walletContract.sendTransfer({
      secretKey: key.secretKey,
      seqno: seqno,
      messages: [
        internal({
          to: fundingWallet.address,
          value: "0.09", // 0.001 TON
          bounce: false,
        }),
      ],
    });
    console.log("transfer back to funding wallet ", fundingWallet.address.toString(), " done");
    await waitForTransaction(seqno, walletContract);
    return {
      publicKey: generatedWallet.address.toString(),
    };
  } catch (e) {
    console.log("sendTransfer 2 back");
    console.log({ e });
  }
}

async function waitForTransaction(seqno: number, walletContract: any) {
  // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm... seq: ", seqno);
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export { createNewWallet };
