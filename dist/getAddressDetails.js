"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const ton_access_1 = require("@orbs-network/ton-access");
const ton_1 = require("ton");
const ton_core_1 = require("ton-core");
const ton_core_2 = require("ton-core");
const base64url = require("base64url");
function getDetails(publicKey) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // TON addresses come in three forms: account ID, wallet key, and smart contract address.
        // const accountIdAddress = "EQCjQl3kxm-CwYQDEJ5z2wf08hDfAWr_liv7hwjC4I1cwdDl"; //bas64url friendly
        let address1 = ton_core_1.Address.parseFriendly(publicKey);
        console.log("-- is bounceable ", address1.isBounceable);
        console.log("-- isTestOnly ", address1.isTestOnly);
        console.log("-- workchain ", address1.address.workChain);
        console.log("--  hash ", address1.address.hash);
        console.log("-- toRawString ", address1.address.toRawString());
        const endpoint = yield (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
        const client = new ton_1.TonClient({ endpoint });
        // let contract = client.provider(address1); // not working needed for seqNo
        const txns = yield client.getTransactions(address1.address, { limit: 10 });
        let balance = yield client.getBalance(address1.address);
        console.log("----given wallet:---- ");
        console.log({ txns });
        console.log("--- address: ", address1.address.toString());
        console.log("--- balance: ", balance);
        console.log("---fromNano bal ", (0, ton_core_2.fromNano)(balance));
        // console.log("--- seqno: ", seqno);
        const isDeployed = yield client.isContractDeployed(address1.address);
        console.log("--- isContractDeployed: ");
        const txnList = [];
        for (let i in txns) {
            const txn = { inValue: "0", outValue: "0", from: "", to: "0", now: 0, hash: BigInt(0) };
            const inMessage = txns[i].inMessage;
            const outMessages = txns[i].outMessages;
            txn["inValue"] = (0, ton_core_2.fromNano)(((_b = (_a = inMessage === null || inMessage === void 0 ? void 0 : inMessage.info) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.coins) || 0) || "";
            txn["outValue"] = outMessages;
            txn["hash"] = txns[i].address;
            txn["now"] = txns[i].now;
            txnList.push(txn);
        }
        return Object.assign(Object.assign({}, address1), { balance: (0, ton_core_2.fromNano)(balance), txns: txnList, isDeployed });
    });
}
module.exports = getDetails;
//# sourceMappingURL=getAddressDetails.js.map