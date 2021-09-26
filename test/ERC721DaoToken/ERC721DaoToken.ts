import hre from "hardhat";

import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { ERC721DaoToken } from "../../typechain/ERC721DaoToken";
import { shouldBehaveLikeERC721DaoToken } from "./ERC721DaoToken.behavior";
import { Signers } from "../types";

const { deployContract } = hre.waffle;
const keccak256 = hre.ethers.utils.keccak256;
const toUtf8Bytes = hre.ethers.utils.toUtf8Bytes;

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;

    const signers: SignerWithAddress[] = await hre.ethers.getSigners();
    this.signers.admin = signers[0];
    this.signers.user = signers[1];
  });

  describe("ERC721DaoToken", function () {
    beforeEach(async function () {
      // roles
      const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));
      const BURNER_ROLE = keccak256(toUtf8Bytes("BURNER_ROLE"));
      const ADMIN_ROLE = keccak256(toUtf8Bytes("ADMIN_ROLE"));
      const BASE_URI_ROLE = keccak256(toUtf8Bytes("BASE_URI_ROLE"));

      const admin = await this.signers.admin.getAddress();
      this.roles = [MINTER_ROLE, BURNER_ROLE, ADMIN_ROLE, BASE_URI_ROLE];
      this.rolesAssignees = [admin, admin, admin, admin];

      const erc721DaoTokenArtifact: Artifact = await hre.artifacts.readArtifact("ERC721DaoToken");
      this.ERC721DaoToken = <ERC721DaoToken>await deployContract(this.signers.admin, erc721DaoTokenArtifact, []);
      await this.ERC721DaoToken.initialize("TokenName", "TN", this.roles, this.rolesAssignees);
    });

    shouldBehaveLikeERC721DaoToken();
  });
});
