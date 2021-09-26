import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Fixture } from "ethereum-waffle";

import { ERC721DaoToken } from "../typechain/ERC721DaoToken";
import { CloneFactory } from "../typechain/CloneFactory";

declare module "mocha" {
  export interface Context {
    ERC721DaoToken: ERC721DaoToken;
    cloneFactory: CloneFactory;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
    roles: string[];
    rolesAssignees: string[];
  }
}

export interface Signers {
  admin: SignerWithAddress;
  minter: SignerWithAddress;
  burner: SignerWithAddress;
  user: SignerWithAddress;
}
