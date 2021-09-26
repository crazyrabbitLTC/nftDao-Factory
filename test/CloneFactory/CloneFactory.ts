import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { CloneFactory } from "../../typechain/CloneFactory";
import { ERC721DaoToken } from "../../typechain/ERC721DaoToken";
import { Signers } from "../types";

import { shouleBehaveLikeCloneFactory } from "./CloneFactory.behavior";

const { deployContract } = hre.waffle;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("CloneFactory", function () {
    beforeEach(async function () {
      const cloneFactoryArtifact: Artifact = await hre.artifacts.readArtifact("CloneFactory");
      const erc721DaoTokenArtifact: Artifact = await hre.artifacts.readArtifact("ERC721DaoToken");
      this.ERC721DaoToken = <ERC721DaoToken>await deployContract(this.signers.admin, erc721DaoTokenArtifact, []);
      this.cloneFactory = <CloneFactory>await deployContract(this.signers.admin, cloneFactoryArtifact, []);
    });

    shouleBehaveLikeCloneFactory();
  });
});
