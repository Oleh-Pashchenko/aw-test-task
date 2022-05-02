import { ethers, run, upgrades } from "hardhat";

async function main() {
  const Item = await ethers.getContractFactory("Item");
  const item = await upgrades.deployProxy(Item, []);

  await item.deployed();
  await item.deployTransaction.wait(5);

  console.log("Item deployed to:", item.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
