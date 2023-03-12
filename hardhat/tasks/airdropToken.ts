import "@nomicfoundation/hardhat-toolbox";

interface Params {
  token: string;
  address: string;
  account: string;
  amount: string;
}

task("airdrop", "Airdrop time or governance token")
  .addParam("token", "The token's name, T3TimeCoin or T3Token")
  .addParam("address", "The token's address")
  .addParam("account", "The account's addresses, separated with comma")
  .addParam("amount", "The amount's addresses, separated with comma")
  .setAction(async (params: Params) => {
    const [owner] = await ethers.getSigners();
    if (!["T3TimeCoin", "T3Token"].includes(params.token)) {
      throw new Error("Invalid token name");
    }

    const token = await ethers.getContractAt(params.token, params.address, owner);
    const addresses = params.account.split(",");
    const amounts = params.amount.split(",").map((i) => Number(i));
    console.log(addresses, amounts);
    await token.airdrop(addresses, amounts);
  });
