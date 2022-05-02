// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155SupplyUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Item is
    Initializable,
    ERC1155Upgradeable,
    OwnableUpgradeable,
    PausableUpgradeable,
    ERC1155BurnableUpgradeable,
    ERC1155SupplyUpgradeable,
    ReentrancyGuardUpgradeable
{
    event BuyItem(uint256 indexed itemId, address buyer, uint256 amount);

    struct ItemMetadata {
        uint256 price;
    }

    mapping(uint256 => mapping(address => ItemMetadata)) public metadata;

    function initialize() public initializer {
        __ERC1155_init("");
        __Ownable_init();
        __Pausable_init();
        __ERC1155Burnable_init();
        __ERC1155Supply_init();
        __ReentrancyGuard_init();
    }

    function buyItem(
        address _owner,
        uint256 _itemId,
        uint256 _amount
    ) public payable nonReentrant {
        require((metadata[_itemId][_owner].price * _amount) == msg.value);
        require(balanceOf(_owner, _itemId) >= _amount);
        safeTransferFrom(_owner, msg.sender, _itemId, _amount, "");

        (bool success, ) = _owner.call{value: msg.value}("");

        require(success);

        emit BuyItem(_itemId, msg.sender, msg.value);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount,
        uint256 price
    ) public onlyOwner {
        _mint(account, id, amount, "");
        metadata[id][msg.sender] = ItemMetadata(price);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        uint256[] memory prices
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, "");
        for (uint256 index = 0; index < ids.length; index++) {
            metadata[ids[index]][msg.sender] = ItemMetadata(prices[index]);
        }
    }

    function burn(
        address account,
        uint256 id,
        uint256 value
    ) public override {
        _burn(account, id, value);
        delete metadata[id][msg.sender].price;
    }

    function burnBatch(
        address account,
        uint256[] memory ids,
        uint256[] memory values
    ) public override {
        _burnBatch(account, ids, values);
        for (uint256 index = 0; index < ids.length; index++) {
            delete metadata[ids[index]][msg.sender].price;
        }
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    )
        internal
        override(ERC1155Upgradeable, ERC1155SupplyUpgradeable)
        whenNotPaused
    {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }
}
