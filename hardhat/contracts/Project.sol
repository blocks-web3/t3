// SPDX-License-Identifier: MIT
// Project contract
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Timers.sol";
import "@openzeppelin/contracts/utils/math/SafeCast.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Project is Ownable {
    // NOTE:
    // 1 day == 6575 blocks, 1 week == 46027 blocks
    using Timers for Timers.BlockNumber;
    using SafeCast for uint256;

    enum ProjectStatus {
        OnGoing,
        Complete,
        Succeeded
    }

    IERC20 public immutable token;
    string public ID;
    string public description;
    ProjectStatus public status;
    uint256 public immutable targetAmount;

    mapping(address => uint256) public donors;
    uint256 public donatedAmount;

    Timers.BlockNumber private _deadline;
    address public executor;

    modifier onlyExecutor() {
        require(_msgSender() == executor, "Project: Only executor can call");
        _;
    }

    constructor(
        IERC20 _token,
        string memory _id,
        string memory _description,
        uint256 _targetAmount,
        uint256 _period,
        address _executor
    ) Ownable() {
        token = _token;
        ID = _id;
        description = _description;
        targetAmount = _targetAmount;

        _deadline.setDeadline(block.number.toUint64() + _period.toUint64());
        executor = _executor;
        // NOTE: tx.origin is NOT safe, never use it for authorization
        _transferOwnership(tx.origin);
    }

    function setExecutor(address _executor) public onlyOwner {
        executor = _executor;
    }

    function makeComplete() public onlyOwner {
        require(
            isOngoing(),
            "Project: You cannot make complete unless ongoing"
        );
        status = ProjectStatus.Complete;
    }

    function makeSucceeded() public onlyExecutor {
        require(
            isComplete(),
            "Project: You cannot make succeeded unless complete"
        );
        status = ProjectStatus.Succeeded;
    }

    function isOngoing() public view returns (bool) {
        return status == ProjectStatus.OnGoing;
    }

    function isComplete() public view returns (bool) {
        return status == ProjectStatus.Complete;
    }

    function isSucceeded() public view returns (bool) {
        return status == ProjectStatus.Succeeded;
    }

    function isTargetReached() public view returns (bool) {
        return donatedAmount >= targetAmount;
    }

    function isFundingPending() public view returns (bool) {
        return _deadline.isPending();
    }

    function isFundingExpired() public view returns (bool) {
        return _deadline.isExpired();
    }

    function support(uint256 _amount) public {
        require(
            isFundingPending(),
            "Project: You cannot support after expiration"
        );
        require(
            token.transferFrom(_msgSender(), address(this), _amount),
            "Project: You need to approve first"
        );
        donors[_msgSender()] += _amount;
        donatedAmount += _amount;
    }

    function withdraw() public onlyOwner {
        require(
            isFundingExpired(),
            "Project: You cannot withdraw before expiration"
        );
        require(
            isTargetReached(),
            "Project: You cannot withdraw before reaching the target"
        );

        token.transfer(owner(), token.balanceOf(address(this)));
    }
}
