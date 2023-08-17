import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey, mnemonicNew } from "ton-crypto";
import { TonClient, WalletContractV4, internal } from "ton";
import { Address } from "ton-core";
import { fromNano } from "ton-core";
import { connected } from "process";
const base64url = require("base64url");

async function getDetails(publicKey: string) {
  // TON addresses come in three forms: account ID, wallet key, and smart contract address.
  // const accountIdAddress = "EQCjQl3kxm-CwYQDEJ5z2wf08hDfAWr_liv7hwjC4I1cwdDl"; //bas64url friendly
  let address1 = Address.parseFriendly(publicKey);
  console.log("-- is bounceable ", address1.isBounceable);
  console.log("-- isTestOnly ", address1.isTestOnly);
  console.log("-- workchain ", address1.address.workChain);
  console.log("--  hash ", address1.address.hash);
  console.log("-- toRawString ", address1.address.toRawString());
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });

  // let contract = client.provider(address1); // not working needed for seqNo
  const txns = await client.getTransactions(address1.address, { limit: 10 });
  let balance: bigint = await client.getBalance(address1.address);

  console.log("----given wallet:---- ");
  console.log({ txns });
  console.log("--- address: ", address1.address.toString());
  console.log("--- balance: ", balance);
  console.log("---fromNano bal ", fromNano(balance));
  // console.log("--- seqno: ", seqno);
  const isDeployed = await client.isContractDeployed(address1.address);
  console.log("--- isContractDeployed: ");
  const txnList = [];
  for (let i in txns) {
    const txn = { inValue: "0", outValue: "0", from: "", to: "0", now: 0, hash: BigInt(0) };
    const inMessage: any = txns[i].inMessage;
    const outMessages: any = txns[i].outMessages;
    txn["inValue"] = fromNano(inMessage?.info?.value?.coins || 0) || "";
    txn["outValue"] = outMessages;
    txn["hash"] = txns[i].address;
    txn["now"] = txns[i].now;
    txnList.push(txn);
  }
  return {
    ...address1,
    balance: fromNano(balance),
    txns: txnList,
    isDeployed,
  };
}

export = getDetails;
