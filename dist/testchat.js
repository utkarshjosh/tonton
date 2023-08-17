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
Object.defineProperty(exports, "__esModule", { value: true });
const base64url = require("base64url");
const ton_access_1 = require("@orbs-network/ton-access");
const { TonClient, WalletContractV4, Account } = require("ton");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const endpoint = yield (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
    const client = new TonClient({ endpoint });
    const accountIdAddress = "EQCjQl3kxm-CwYQDEJ5z2wf08hDfAWr_liv7hwjC4I1cwdDl";
    const decodedBytes = base64url.toBuffer(accountIdAddress);
    // const client = createTestClient4();
    const account = new Account({ abi: {}, address: decodedBytes }, client);
    yield account.fetch();
    console.log("Address:", account.address.toString());
    console.log("Balance:", account.balance.toNumber());
});
main();
//# sourceMappingURL=testchat.js.map