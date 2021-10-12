import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { CloneFactory, ERC721DaoToken } from "../../typechain";
import { CloneFactory__factory } from "../../typechain/factories/CloneFactory__factory";
import { ERC721DaoToken__factory } from "../../typechain/factories/ERC721DaoToken__factory";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

task("deploy:CloneFactory").setAction(async function (taskArguments: TaskArguments, { ethers, run }) {
  const cloneFactoryFactory: CloneFactory__factory = await ethers.getContractFactory("CloneFactory");
  const cloneFactory: CloneFactory = <CloneFactory>await cloneFactoryFactory.deploy();
  await cloneFactory.deployed();
  console.log("Clone Factory: ", cloneFactory.address);

  const ERC721DaoTokenFactory: ERC721DaoToken__factory = await ethers.getContractFactory("ERC721DaoToken");
  const ERC721DaoToken: ERC721DaoToken = <ERC721DaoToken>await ERC721DaoTokenFactory.deploy();
  await ERC721DaoToken.deployed();
  console.log("Implementation Address: ", ERC721DaoToken.address);

  console.log("Attempt to verify");
  await delay(75000);
  await run("verify:verify", {
    address: cloneFactory.address,
    constructorArguments: [],
  });

  console.log("Clone factory verified");

  await run("verify:verify", {
    address: ERC721DaoToken.address,
    constructorArguments: [],
  });
  console.log("Implementation Verified");

  console.log("Initialize and add implementation...");
  await ERC721DaoToken.initialize("ERC721DaoToken v1", "EDTV1", "This should be metadata", [], []);

  await cloneFactory.addImplementation(ERC721DaoToken.address, "Some Details");
  console.log("...finished");
});
