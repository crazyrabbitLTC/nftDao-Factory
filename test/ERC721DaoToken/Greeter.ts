import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { ERC721DaoToken } from "../../typechain/ERC721DaoToken";
import { Signers } from "../types";
import { expect } from "chai";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("ERC721DaoToken", function () {
    beforeEach(async function () {
      const erc721DaoTokenArtifact: Artifact = await hre.artifacts.readArtifact("ERC721DaoToken");
      this.ERC721DaoToken = <ERC721DaoToken>await deployContract(this.signers.admin, erc721DaoTokenArtifact, []);
    });

    it("it should initialize to the correct name only once", async function () {
      await this.ERC721DaoToken.initialize("TokenName", "TN");
      expect(await this.ERC721DaoToken.connect(this.signers.admin).name()).to.equal("TokenName");
      expect(await this.ERC721DaoToken.connect(this.signers.admin).symbol()).to.equal("TN");
      await expect(this.ERC721DaoToken.initialize("TokenName", "TN")).to.be.reverted;
    });

    // shouldBehaveLikeGreeter();
  });
});
