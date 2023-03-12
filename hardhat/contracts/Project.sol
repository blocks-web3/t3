// SPDX-License-Identifier: MIT
// Project contract
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Timers.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Project is Ownable {
    using Timers for Timers.BlockNumber;
    using SafeCast for uint256;

    IERC20 public immutable token;
    string public ID;
    mapping(address => uint256) public donors;
    uint256 public donatedAmount;

    Timers.BlockNumber private _deadline;

    constructor(IERC20 _token, string memory _id, uint256 _period) Ownable() {
        token = _token;
        ID = _id;
        _deadline.setDeadline(block.number.toUint64() + _period.toUint64());
        // NOTE: tx.origin is NOT safe, never use it for authorization
        _transferOwnership(tx.origin);
    }

    function isPending() public view returns (bool) {
        return _deadline.isPending();
    }

    function isExpired() public view returns (bool) {
        return _deadline.isExpired();
    }

    function support(uint256 _amount) public {
        require(isPending(), "Project: You cannot support after expiration");
        require(
            token.transferFrom(_msgSender(), address(this), _amount),
            "Project: You need to approve first"
        );
        donors[_msgSender()] += _amount;
        donatedAmount += _amount;
    }

    function withdraw() public onlyOwner {
        require(isExpired(), "Project: You cannot withdraw before expiration");

        token.transfer(owner(), token.balanceOf(address(this)));
    }
}
