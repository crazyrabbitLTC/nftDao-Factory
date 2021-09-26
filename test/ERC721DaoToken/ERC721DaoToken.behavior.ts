import { expect } from "chai";
import { ERC721DaoToken } from "../../typechain/ERC721DaoToken";
export function shouldBehaveLikeERC721DaoToken(): void {
  it("it should initialize to the correct name only once", async function () {
    expect(await this.ERC721DaoToken.connect(this.signers.admin).name()).to.equal("TokenName");
    expect(await this.ERC721DaoToken.connect(this.signers.admin).symbol()).to.equal("TN");
  });

  it("should mint a token", async function () {
    const instance = <ERC721DaoToken>this.ERC721DaoToken.connect(this.signers.admin);
    const zeroAddress = "0x0000000000000000000000000000000000000000";
    const adminAddress = await this.signers.admin.getAddress();
    const userAddress = await this.signers.user.getAddress();

    // check total supply is zero
    expect(await instance.totalSupply()).to.be.equal(0);
    // check that minting works
    await expect(instance.mint(await adminAddress, 0))
      .to.emit(instance, "Transfer")
      .withArgs(zeroAddress, adminAddress, 0);
    // check that admin got a token
    expect(await instance.ownerOf(0)).to.be.equal(adminAddress);
    // check that total supply has increased
    expect(await instance.totalSupply()).to.be.equal(1);
    // check that you can't mint the same token twice
    await expect(instance.mint(await adminAddress, 0)).to.be.revertedWith("ERC721: token already minted");
    // check that someone is not a minter role
    expect(await instance.MINTER_ROLE()).to.be.not.equal(userAddress);
    // check that someone who is not a minter can not mint
    await expect(this.ERC721DaoToken.connect(this.signers.user).mint(userAddress, 1)).to.be.revertedWith(
      "Err:ERC721DaoToken: sender requires permission",
    );
  });

  it("should update tokenURI", async function () {
    const uri = "url/";

    const instance = <ERC721DaoToken>this.ERC721DaoToken.connect(this.signers.admin);

    //mint a token
    await instance.mint(await this.signers.admin.getAddress(), 0);

    // currently equal to ""
    expect(await instance.tokenURI(0)).to.be.equal("");

    //change base uri
    await instance.changeBaseURI("url/");

    // currently equal to "url/"
    expect(await instance.tokenURI(0)).to.be.equal(uri + "0");
  });
}
