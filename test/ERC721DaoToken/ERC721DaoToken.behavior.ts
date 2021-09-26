import { expect } from "chai";

export function shouldBehaveLikeERC721DaoToken(): void {
  it("it should initialize to the correct name only once", async function () {
    await this.ERC721DaoToken.initialize("TokenName", "TN");
    expect(await this.ERC721DaoToken.connect(this.signers.admin).name()).to.equal("TokenName");
    expect(await this.ERC721DaoToken.connect(this.signers.admin).symbol()).to.equal("TN");
    await expect(this.ERC721DaoToken.initialize("TokenName", "TN")).to.be.reverted;
  });
}
