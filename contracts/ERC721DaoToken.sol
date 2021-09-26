// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
import "./ERC721Checkpointable.sol";

interface IURIManager {
    function getURI(address tokenContract, uint256 tokenId) external returns (string calldata);
}

contract ERC721DaoToken is ERC721Checkpointable, AccessControlUpgradeable {
    using StringsUpgradeable for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");
    bytes32 public constant BASE_URI_ROLE = keccak256("BASE_URI_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    string public baseURI = "";

    bool public isURIExternal = false;

    IURIManager public URIManager;

    event BaseURIChanged(string newURI);

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721EnumerableUpgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Modifier to make a function callable just by a certain role.
     */
    modifier justByRole(bytes32 role) {
        require(hasRole(role, _msgSender()), "Err:ERC721DaoToken: sender requires permission");
        _;
    }

    function initialize(
        string memory name_,
        string memory symbol_,
        bytes32[] memory roles,
        address[] memory rolesAssignees,
        bool isURIExternal_,
        IURIManager externalURIManager
    ) public initializer {
        __ERC721_init(name_, symbol_);

        require(roles.length == rolesAssignees.length, "Err::initializer: roles assignment arity mismatch");

        // set roles administrator
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
        _setRoleAdmin(MINTER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BURNER_ROLE, ADMIN_ROLE);
        _setRoleAdmin(BASE_URI_ROLE, ADMIN_ROLE);

        // assign roles
        for (uint256 i = 0; i < roles.length; i++) {
            _setupRole(roles[i], rolesAssignees[i]);
        }

        if (isURIExternal_) {
            isURIExternal = true;
            URIManager = externalURIManager;
        }
    }

    function mint(address to, uint256 tokenId) public justByRole(MINTER_ROLE) {
        _mint(to, tokenId);
    }

    function changeBaseURI(string memory baseURI_) public justByRole(BASE_URI_ROLE) {
        baseURI = baseURI_;
        emit BaseURIChanged(baseURI_);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /**
     * @dev Overwrite the existing tokenURI to account for external function managing this
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        string memory URI = _baseURI();
        return bytes(URI).length > 0 ? string(abi.encodePacked(URI, tokenId.toString())) : "";
    }

    function burn(uint256 tokenId) public justByRole(BURNER_ROLE) {
        _burn(tokenId);
    }
}
