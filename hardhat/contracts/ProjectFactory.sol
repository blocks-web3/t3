//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Project.sol";

contract ProjectFactory is Ownable {
    mapping(string => address) public projects;

    address public executor;

    event ProjectCreated(
        address indexed owner,
        string indexed projectId,
        address projectAddress
    );

    constructor(address _executor) Ownable() {
        setExecutor(_executor);
    }

    function setExecutor(address _executor) public onlyOwner {
        executor = _executor;
    }

    function createProject(
        IERC20 _token,
        string memory _id,
        string memory _description,
        uint256 _targetAmount,
        uint256 _period
    ) external returns (address) {
        Project p = new Project(
            _token,
            _id,
            _description,
            _targetAmount,
            _period,
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
