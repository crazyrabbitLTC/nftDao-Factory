import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";

import { CloneFactory, ERC721DaoToken } from "../../typechain";
import { CloneFactory__factory } from "../../typechain/factories/CloneFactory__factory";
import { ERC721DaoToken__factory } from "../../typechain/factories/ERC721DaoToken__factory";

task("deploy:CloneFactory").setAction(async function (taskArguments: TaskArguments, { ethers }) {
  const cloneFactoryFactory: CloneFactory__factory = await ethers.getContractFactory("CloneFactory");
  const cloneFactory: CloneFactory = <CloneFactory>await cloneFactoryFactory.deploy();
  await cloneFactory.deployed();

  const ERC721DaoTokenFactory: ERC721DaoToken__factory = await ethers.getContractFactory("ERC721DaoToken");
  const ERC721DaoToken: ERC721DaoToken = <ERC721DaoToken>await ERC721DaoTokenFactory.deploy();
  await ERC721DaoToken.deployed();

  await ERC721DaoToken.initialize("ERC721DaoToken v1", "EDTV1", "This should be metadata", [], []);

  await cloneFactory.addImplementation(ERC721DaoToken.address, "Some Details");

  console.log("Clone Factory: ", cloneFactory.address);

  //get implementation
  const implementationAddress = await cloneFactory.implementations(0);
  console.log("Implementation Address: ", implementationAddress);
});
