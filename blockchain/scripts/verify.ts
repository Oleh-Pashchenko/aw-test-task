import { ethers, run } from "hardhat";
async function main() {
  await run("verify", {
    address: "0x876d0656F02EDC4a8543dc3b94F8F7f2033e781C",
  });
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
