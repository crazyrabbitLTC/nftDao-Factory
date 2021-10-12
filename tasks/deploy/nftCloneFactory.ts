import { task } from "hardhat/config";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { TaskArguments, Artifact } from "hardhat/types";
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

task("deploy:NFTDao")
  .addParam("contractAddress", "The clone factory addresss")
  .addParam("implementation", "The implementation version")
  .setAction(async function (taskArguments: TaskArguments, { ethers, artifacts }) {
    const keccak256 = ethers.utils.keccak256;
    const toUtf8Bytes = ethers.utils.toUtf8Bytes;

    // roles
    const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));
    const BURNER_ROLE = keccak256(toUtf8Bytes("BURNER_ROLE"));
    const ADMIN_ROLE = keccak256(toUtf8Bytes("ADMIN_ROLE"));
    const BASE_URI_ROLE = keccak256(toUtf8Bytes("BASE_URI_ROLE"));

    //*** add deployment data here ***//
    const tokenName = "testToken";
    const tokenSymbol = "tt";
    const TokenMetadata = "metadata";
    const rolesAssignees: string[] = [
      "0xc9b6628b0C44fe39170CFFCc3bd2cbECf15F7B5e",
      "0xc9b6628b0C44fe39170CFFCc3bd2cbECf15F7B5e",
      "0xc9b6628b0C44fe39170CFFCc3bd2cbECf15F7B5e",
      "0xc9b6628b0C44fe39170CFFCc3bd2cbECf15F7B5e",
    ];
    const roles = [MINTER_ROLE, BURNER_ROLE, ADMIN_ROLE, BASE_URI_ROLE];

    const cloneFactoryArtifact: Artifact = await artifacts.readArtifact("CloneFactory");
    const erc721DaoTokenArtifact: Artifact = await artifacts.readArtifact("ERC721DaoToken");

    // create call data for clone
    const iFace = new ethers.utils.Interface(erc721DaoTokenArtifact.abi);
    const calldata = iFace.encodeFunctionData("initialize", [
      tokenName,
      tokenSymbol,
      TokenMetadata,
      roles,
      rolesAssignees,
    ]);

    const signers: SignerWithAddress[] = await ethers.getSigners();
    const admin = signers[0];

    const instance: CloneFactory = <CloneFactory>(
      new ethers.Contract(taskArguments.contractAddress, cloneFactoryArtifact.abi, admin)
    );

    // create clone

    const tx = await instance.clone(taskArguments.implementation, calldata);

    console.log("Transaction hash: ", tx.hash);
  });
