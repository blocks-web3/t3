// SPDX-License-Identifier: MIT
// Time token for project budget
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract T3TimeCoin is Ownable, ERC20, ERC20Permit {
    constructor(
        uint256 _initialSupply
    ) Ownable() ERC20("T3TimeCoin", "TTC") ERC20Permit("T3TimeCoin") {
        _mint(_msgSender(), _initialSupply);
    }

    // The functions below are overrides required by Solidity.
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20) {
        super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20) {
        super._burn(account, amount);
    }

    function airdrop(
        address[] memory _addresses,
        uint256[] memory _amounts
    ) public onlyOwner {
        require(
            _addresses.length == _amounts.length,
            "T3TimeCoin: airdrop: addresses and amounts must be the same length"
        );
        for (uint256 i = 0; i < _addresses.length; i++) {
            _mint(_addresses[i], _amounts[i]);
        }
    }
}
