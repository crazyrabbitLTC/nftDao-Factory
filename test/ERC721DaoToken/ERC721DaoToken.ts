import hre from "hardhat";
import { Artifact } from "hardhat/types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

import { ERC721DaoToken } from "../../typechain/ERC721DaoToken";
import { shouldBehaveLikeERC721DaoToken } from "./ERC721DaoToken.behavior";
import { Signers } from "../types";

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

    shouldBehaveLikeERC721DaoToken();
  });
});
