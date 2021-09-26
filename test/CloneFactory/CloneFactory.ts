import hre from "hardhat";

import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { CloneFactory } from "../../typechain/CloneFactory";
import { ERC721DaoToken } from "../../typechain/ERC721DaoToken";
import { Signers } from "../types";

import { shouldBehaveLikeCloneFactory } from "./CloneFactory.behavior";

const { deployContract } = hre.waffle;
const keccak256 = hre.ethers.utils.keccak256;
const toUtf8Bytes = hre.ethers.utils.toUtf8Bytes;

xdescribe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
  });

  describe("CloneFactory", function () {
    beforeEach(async function () {
      // roles
      const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));
      const BURNER_ROLE = keccak256(toUtf8Bytes("BURNER_ROLE"));
      const ADMIN_ROLE = keccak256(toUtf8Bytes("ADMIN_ROLE"));
      const BASE_URI_ROLE = keccak256(toUtf8Bytes("BASE_URI_ROLE"));

      const admin = await this.signers.admin.getAddress();
      this.roles = [MINTER_ROLE, BURNER_ROLE, ADMIN_ROLE, BASE_URI_ROLE];
      this.rolesAssignees = [admin, admin, admin, admin];

      const cloneFactoryArtifact: Artifact = await hre.artifacts.readArtifact("CloneFactory");
      const erc721DaoTokenArtifact: Artifact = await hre.artifacts.readArtifact("ERC721DaoToken");
      this.ERC721DaoToken = <ERC721DaoToken>await deployContract(this.signers.admin, erc721DaoTokenArtifact, []);
      this.cloneFactory = <CloneFactory>await deployContract(this.signers.admin, cloneFactoryArtifact, []);
    });

    shouldBehaveLikeCloneFactory();
  });
});
