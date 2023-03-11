//SPDX-License-Identifier:MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Project.sol";

contract ProjectFactory is Ownable {
    mapping(string => address) public projects;

    event ProjectCreated(
        address indexed owner,
        string indexed projectId,
        address projectAddress
    );

    constructor() Ownable() {}

    function createProject(
        IERC20 _token,
        string memory _id,
        uint256 _period
    ) external returns (address) {
        Project p = new Project(_token, _id, _period);
        address _address = address(p);
        projects[_id] = _address;

        emit ProjectCreated(_msgSender(), _id, _address);
        return _address;
    }

    function getProjectAddress(string calldata projectId) external view returns (address){
        return projects[projectId];
    }
}
