"use strict";
// require("buffer");
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
const ton_1 = require("ton");
const ton_crypto_1 = require("ton-crypto");
const tonWallet_1 = require("./tonWallet");
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    // Create Client
    const client = new ton_1.TonClient({
        endpoint: "https://toncenter.com/api/v2/jsonRPC",
    });
    // Generate new key
    let mnemonics = yield (0, ton_crypto_1.mnemonicNew)();
    let keyPair = yield (0, ton_crypto_1.mnemonicToPrivateKey)(mnemonics);
    // Create wallet contract
    let workchain = 0; // Usually you need a workchain 0
    let wallet = ton_1.WalletContractV4.create({ workchain, publicKey: keyPair.publicKey });
    let contract = client.open(wallet);
    // Get balance
    let balance = yield contract.getBalance();
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
});
(0, tonWallet_1.createNewWallet)();
//# sourceMappingURL=index.js.map