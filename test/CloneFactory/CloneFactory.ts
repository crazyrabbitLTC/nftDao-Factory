import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { CloneFactory } from "../../typechain/CloneFactory";
import { ERC721DaoToken } from "../../typechain/ERC721DaoToken";
import { Signers } from "../types";

import { expect } from "chai";
import { BigNumber } from "@ethereum-waffle/provider/node_modules/ethers";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("CloneFacotry", function () {
    beforeEach(async function () {
      const cloneFactoryArtifact: Artifact = await hre.artifacts.readArtifact("CloneFactory");
      const erc721DaoTokenArtifact: Artifact = await hre.artifacts.readArtifact("ERC721DaoToken");
      this.ERC721DaoToken = <ERC721DaoToken>await deployContract(this.signers.admin, erc721DaoTokenArtifact, []);
      this.cloneFactory = <CloneFactory>await deployContract(this.signers.admin, cloneFactoryArtifact, []);
    });

    it("Should add an implementation to registry", async function () {
      await expect(
        this.cloneFactory
          .connect(this.signers.admin)
          .addImplementation(this.ERC721DaoToken.address, "Arbitrary Description"),
      ).to.not.be.reverted;
      expect(await this.cloneFactory.implementations(0)).to.be.equal(this.ERC721DaoToken.address);
    });

    it("Should clone implementation in registry", async function () {
      await expect(
        this.cloneFactory
          .connect(this.signers.admin)
          .addImplementation(this.ERC721DaoToken.address, "Arbitrary Description"),
      ).to.not.be.reverted;
      expect(await this.cloneFactory.implementations(0)).to.be.equal(this.ERC721DaoToken.address);

      // make the init call data
      const erc721DaoTokenArtifact: Artifact = await hre.artifacts.readArtifact("ERC721DaoToken");

      // create call data for clone
      const iFace = new hre.ethers.utils.Interface(erc721DaoTokenArtifact.abi);
      const calldata = iFace.encodeFunctionData("initialize", ["TokenName", "TokenSymbol"]);

      // make the clone
      const tx = await this.cloneFactory.clone(0, calldata);
      const receipt = await tx.wait();
      const cloneAddress = receipt.events?.find(({ event }) => event == "NewNFT")?.args?.instance;

      // attach address as NFT
      const nft = <ERC721DaoToken>(
        new hre.ethers.ContractFactory(
          erc721DaoTokenArtifact.abi,
          erc721DaoTokenArtifact.bytecode,
          this.signers.admin,
        ).attach(cloneAddress)
      );

      expect(await nft.name()).to.be.equal("TokenName");
      expect(await nft.symbol()).to.be.equal("TokenSymbol");
    });

    // it("should create a non-upgradable NFT Clone", async function () {

    //   // first add the Dao Token to the implementations

    // })
    // it("it should initialize to the correct name only once", async function () {
    //   await this.cloneFactory.initialize("TokenName", "TN");
    //   expect(await this.cloneFactory.connect(this.signers.admin).name()).to.equal("TokenName");
    //   expect(await this.cloneFactory.connect(this.signers.admin).symbol()).to.equal("TN");
    //   await expect(this.cloneFactory.initialize("TokenName", "TN")).to.be.reverted;
    // });

    // shouldBehaveLikeGreeter();
  });
});
