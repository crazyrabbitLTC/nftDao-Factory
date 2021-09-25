pragma solidity ^0.8.6;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NFTFactory is Ownable {
    using Address for address;
    using Clones for address;

    address[] public implementations;
    mapping(address => uint256) public implementationVersion;

    event NewImplementationAdded(address instance, string details);

    // function addImplementation(address _implementation, string memory _details) public onlyOwner {

    //     //ensure the address is a contract
    //     require(Address.isContract(_implementation), "Err: Implementation address not a contract");
    //     implementations.push(_implementation);

    //     emit NewImplementationAdded(_implementation, _details);
    // }

    //     function createNFT(uint version, bytes calldata initdata) public payable {
    //     _initAndEmit(implementation.clone(), initdata);
    // }

    //     contract ClonesMock {
    //     using Address for address;
    //     using Clones for address;

    //     event NewInstance(address instance);

    //     function clone(address implementation, bytes calldata initdata) public payable {
    //         _initAndEmit(implementation.clone(), initdata);
    //     }

    //     function cloneDeterministic(
    //         address implementation,
    //         bytes32 salt,
    //         bytes calldata initdata
    //     ) public payable {
    //         _initAndEmit(implementation.cloneDeterministic(salt), initdata);
    //     }

    //     function predictDeterministicAddress(address implementation, bytes32 salt) public view returns (address predicted) {
    //         return implementation.predictDeterministicAddress(salt);
    //     }

    //     function _initAndEmit(address instance, bytes memory initdata) private {
    //         if (initdata.length > 0) {
    //             instance.functionCallWithValue(initdata, msg.value);
    //         }
    //         emit NewInstance(instance);
    //     }
    // }
}
