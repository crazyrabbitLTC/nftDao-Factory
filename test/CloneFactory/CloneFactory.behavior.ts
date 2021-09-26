import { expect } from "chai";
import { ERC721DaoToken } from "../../typechain/ERC721DaoToken";
import { Artifact } from "hardhat/types";
import hre from "hardhat";

export function shouldBehaveLikeCloneFactory(): void {
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
    const calldata = iFace.encodeFunctionData("initialize", [
      "TokenName",
      "TokenSymbol",
      this.roles,
      this.rolesAssignees,
    ]);

    // make the clone
    const tx = await this.cloneFactory.clone(0, calldata);
    const receipt = await tx.wait();
    const cloneAddress = receipt.events?.find(({ event }) => event == "NewClone")?.args?.instance;

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
}
