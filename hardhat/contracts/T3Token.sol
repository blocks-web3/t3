// SPDX-License-Identifier: MIT
// Governance token for voting
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract T3Token is Ownable, ERC20, ERC20Burnable, ERC20Permit, ERC20Votes {
    constructor(
        uint256 _initialSupply
    ) ERC20("T3Token", "T3T") ERC20Permit("T3Token") {
        _mint(_msgSender(), _initialSupply);
        _delegate(_msgSender(), _msgSender());
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._afterTokenTransfer(from, to, amount);
    }

    function _mint(
        address to,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
        super._mint(to, amount);
    }

    function _burn(
        address account,
        uint256 amount
    ) internal override(ERC20, ERC20Votes) {
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
