// SPDX-License-Identifier: MIT
// Time token for project budget
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract T3TimeCoin is ERC20, ERC20Permit, ERC20Votes {
    constructor(
        uint256 _initialSupply
    ) ERC20("T3TimeCoin", "TTC") ERC20Permit("T3TimeCoin") {
        _mint(_msgSender(), _initialSupply);
        _delegate(_msgSender(), _msgSender());
    }

    // The functions below are overrides required by Solidity.
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
}
