import { expect } from "chai";

export function shouldBehaveLikeERC721DaoToken(): void {
  it("it should initialize to the correct name only once", async function () {
    expect(await this.ERC721DaoToken.connect(this.signers.admin).name()).to.equal("TokenName");
    expect(await this.ERC721DaoToken.connect(this.signers.admin).symbol()).to.equal("TN");
  });
}
