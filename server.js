const express = require("express");
const app = express();
const getAddressDetails = require("./dist/getAddressDetails");
const { createNewWallet } = require("./dist/tonWallet");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/address/:address", async (req, res) => {
  const address = req.params.address;

  const { txns, ...data } = await getAddressDetails(address);
  const currentTimestamp = Math.floor(Date.now() / 1000);

  const formattedTransactions = txns.map((txn) => {
    const ageInSeconds = currentTimestamp - txn.now;
    const ageInMinutes = Math.floor(ageInSeconds / 60);
    const ageInHours = Math.floor(ageInMinutes / 60);
    const ageInDays = Math.floor(ageInHours / 24);

    let formattedAge = "";
    if (ageInDays >= 1) {
      formattedAge = `${ageInDays} days ago`;
    } else if (ageInHours >= 1) {
      formattedAge = `${ageInHours} hours ago`;
    } else if (ageInMinutes >= 1) {
      formattedAge = `${ageInMinutes} minutes ago`;
    } else {
      formattedAge = "Just now";
    }
    console.log(txn);
    return {
      age: formattedAge,
      hash: txn.hash.toString().slice(0, 30) + "...",
      value: txn.inValue + "TON",
    };
  });
  res.render("details", { address, data, txns: formattedTransactions });
});

app.get("/create", (req, res) => {
  res.render("createWallet");
});

app.post("/api/create-wallet", async (req, res) => {
  const resp = await createNewWallet();
  return res.send(resp);
});
app.listen(3000, () => console.log("Listening on port 3000"));
