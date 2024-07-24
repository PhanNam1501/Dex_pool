const hre = require("hardhat");
const fs = require('fs');

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const TokenA = await hre.ethers.getContractFactory("TokenA");
    const TokenB = await hre.ethers.getContractFactory("TokenB");
    const DEX = await hre.ethers.getContractFactory("DEX");

    const tokenA = await TokenA.deploy(hre.ethers.parseUnits("1000000", 18));
    const tokenB = await TokenB.deploy(hre.ethers.parseUnits("1000000", 18));

    //await tokenA.deployed();
    //await tokenB.deployed();
    console.log(tokenA.target);
    console.log(tokenB.target);
    const dex = await DEX.deploy(tokenA.target,tokenB.target);
    console.log(dex.target);
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });