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
exports.createNewWallet = void 0;
const ton_access_1 = require("@orbs-network/ton-access");
const ton_crypto_1 = require("ton-crypto");
const ton_1 = require("ton");
const base64url = require("base64url");
function createNewWallet() {
    return __awaiter(this, void 0, void 0, function* () {
        // open wallet v4 (set your correct wallet version here)
        const mnemonic = "strong bracket fine express riot casino smart stone material distance nation coconut garage sad toss expand leopard grape disease crisp punch cannon ring item"; // insert a mnemonic for a wallet that has funds
        const FUNDING_key = yield (0, ton_crypto_1.mnemonicToWalletKey)(mnemonic.split(" "));
        const fundingWallet = ton_1.WalletContractV4.create({ publicKey: FUNDING_key.publicKey, workchain: 0 });
        const endpoint = yield (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
        const client = new ton_1.TonClient({ endpoint });
        let contract = client.open(fundingWallet);
        const seqno = yield contract.getSeqno();
        // Get balance
        let balance = yield contract.getBalance();
        console.log("----funding wallet:---- ");
        console.log("--- address: ", fundingWallet.address.toString());
        console.log("--- walletAddressTEST: ", fundingWallet.address.toString({ testOnly: true }));
        console.log("--- workchain: ", fundingWallet.address.workChain);
        console.log("--- balance: ", balance);
        console.log("--- seqno: ", seqno);
        console.log("--- isContractDeployed: ", yield client.isContractDeployed(fundingWallet.address));
        // console.log("--- secretKey: ", FUNDING_key.secretKey);
        // creating new wallet
        let m = yield (0, ton_crypto_1.mnemonicNew)();
        const { publicKey } = yield initializeWallet(fundingWallet, FUNDING_key.secretKey, m);
        return {
            mnemonic: m,
            contractType: "walletv4",
            publicKey,
        };
    });
}
exports.createNewWallet = createNewWallet;
function initializeWallet(fundingWallet, fundingSecret, mnemonic) {
    return __awaiter(this, void 0, void 0, function* () {
        // open wallet v4 (notice the correct wallet version here)
        const key = yield (0, ton_crypto_1.mnemonicToWalletKey)(mnemonic);
        const generatedWallet = ton_1.WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
        // initialize ton rpc client on testnet
        const endpoint = yield (0, ton_access_1.getHttpEndpoint)({ network: "testnet" });
        const client = new ton_1.TonClient({ endpoint });
        // send 0.1 TON from funding wallet to new wallet
        let walletContract = client.open(fundingWallet);
        let seqno = yield walletContract.getSeqno();
        try {
            yield walletContract.sendTransfer({
                secretKey: fundingSecret,
                seqno: seqno,
                messages: [
                    (0, ton_1.internal)({
                        to: generatedWallet.address,
                        value: "0.1",
                        bounce: false,
                    }),
                ],
            });
            console.log("funding to ", generatedWallet.address.toString(), "is funded with 0.09 ton");
            yield waitForTransaction(seqno, walletContract);
        }
        catch (e) {
            console.log("sendTransfer funding error");
            return console.log({ e });
        }
        // send 0.9 back TON to funding wallet
        walletContract = client.open(generatedWallet);
        seqno = yield walletContract.getSeqno();
        let balance1 = yield walletContract.getBalance();
        console.log("----generated wallet:---- ");
        console.log("--- address: ", generatedWallet.address.toString());
        console.log("--- walletAddressTEST: ", generatedWallet.address.toString({ testOnly: true }));
        console.log("--- workchain: ", generatedWallet.address.workChain);
        console.log("--- balance: ", balance1);
        console.log("--- seqno: ", seqno);
        console.log("--- isContractDeployed: ", yield client.isContractDeployed(generatedWallet.address));
        console.log("--- secretKey: ", key.secretKey);
        try {
            yield walletContract.sendTransfer({
                secretKey: key.secretKey,
                seqno: seqno,
                messages: [
                    (0, ton_1.internal)({
                        to: fundingWallet.address,
                        value: "0.09",
                        bounce: false,
                    }),
                ],
            });
            console.log("transfer back to funding wallet ", fundingWallet.address.toString(), " done");
            yield waitForTransaction(seqno, walletContract);
            return {
                publicKey: generatedWallet.address.toString(),
            };
        }
        catch (e) {
            console.log("sendTransfer 2 back");
            console.log({ e });
        }
    });
}
function waitForTransaction(seqno, walletContract) {
    return __awaiter(this, void 0, void 0, function* () {
        // wait until confirmed
        let currentSeqno = seqno;
        while (currentSeqno == seqno) {
            console.log("waiting for transaction to confirm... seq: ", seqno);
            yield sleep(1500);
            currentSeqno = yield walletContract.getSeqno();
        }
        console.log("transaction confirmed!");
    });
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
//# sourceMappingURL=tonWallet.js.map