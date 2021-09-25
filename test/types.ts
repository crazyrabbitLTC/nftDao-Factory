import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { Fixture } from "ethereum-waffle";

import { Greeter } from "../typechain/Greeter";
import { ERC721DaoToken } from "../typechain/ERC721DaoToken";

declare module "mocha" {
  export interface Context {
    ERC721DaoToken: ERC721DaoToken;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  admin: SignerWithAddress;
}
