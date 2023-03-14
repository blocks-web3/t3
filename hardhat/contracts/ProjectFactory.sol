//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Project.sol";

contract ProjectFactory is Ownable {
    mapping(string => address) public projects;
    IERC20 public immutable timeToken;

    address public executor;

    event ProjectCreated(
        address indexed owner,
        string indexed projectId,
        address projectAddress
    );

    constructor(IERC20 _timeToken, address _executor) Ownable() {
        timeToken = _timeToken;
        setExecutor(_executor);
    }

    function setExecutor(address _executor) public onlyOwner {
        executor = _executor;
    }

    function createProject(
        string memory _id,
        string memory _description,
        uint256 _fundingTarget,
        uint256 _fundingPeriod
    ) external returns (address) {
        Project p = new Project(
            timeToken,
            _id,
            _description,
            _fundingTarget,
            _fundingPeriod,
            executor
        );
        address _address = address(p);
        projects[_id] = _address;

        emit ProjectCreated(_msgSender(), _id, _address);
        return _address;
    }

    function getProjectAddress(
        string memory _id
    ) public view returns (address) {
        // same as `projects(_id)`
        return projects[_id];
    }
}
