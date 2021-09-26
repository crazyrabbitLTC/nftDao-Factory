pragma solidity ^0.8.6;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract CloneFactory is Ownable {
    using Address for address;
    using Clones for address;

    address[] public implementations;

    event NewImplementationAdded(address implementation, string details);
    event NewClone(address instance);

    function addImplementation(address _implementation, string memory _details) public onlyOwner {
        require(Address.isContract(_implementation), "Err: Implementation address not a contract");
        implementations.push(_implementation);

        emit NewImplementationAdded(_implementation, _details);
    }

    function clone(uint256 implementation, bytes calldata initdata) public payable returns (address) {
        return _initAndEmit(implementations[implementation].clone(), initdata);
    }

    function cloneDeterministic(
        address implementation,
        bytes32 salt,
        bytes calldata initdata
    ) public payable {
        _initAndEmit(implementation.cloneDeterministic(salt), initdata);
    }

    function predictDeterministicAddress(address implementation, bytes32 salt) public view returns (address predicted) {
        return implementation.predictDeterministicAddress(salt);
    }

    function _initAndEmit(address instance, bytes memory initdata) private returns (address) {
        if (initdata.length > 0) {
            instance.functionCallWithValue(initdata, msg.value);
        }
        emit NewClone(instance);
        return instance;
    }
}
