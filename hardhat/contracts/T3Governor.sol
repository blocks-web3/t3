// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/compatibility/GovernorCompatibilityBravo.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";

contract T3Governor is
    Governor,
    GovernorCompatibilityBravo,
    GovernorVotes,
    GovernorVotesQuorumFraction,
    GovernorTimelockControl,
    GovernorSettings
{
    // NOTE:
    // 1 day == 6575 blocks, 1 week == 46027 blocks
    constructor(
        IVotes _token,
        TimelockController _timelock,
        uint256 _initialVotingDelay, // voting starts after
        uint256 _initialVotingPeriod, // voting ends after
        uint256 _initialProposalThreshold // minimum number of tokens needed
    )
        Governor("T3Governor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)
        GovernorTimelockControl(_timelock)
        GovernorSettings(
            _initialVotingDelay,
            _initialVotingPeriod,
            _initialProposalThreshold
        )
    {}

    function proposeProjectEvaluation(
        address _projectAddress,
        string memory _projectID
    ) public {
        address[] memory _targets = new address[](1);
        uint256[] memory _values = new uint256[](1);
        bytes[] memory _calldatas = new bytes[](1);
        string memory _description = string.concat(
            "Propose for evaluating Project: ",
            _projectID
        );

        _targets[0] = _projectAddress;
        _values[0] = 0;
        _calldatas[0] = abi.encodeWithSignature("makeSucceeded()");

        super.propose(_targets, _values, _calldatas, _description);
    }

    // The functions below are overrides required by Solidity.
    function proposalThreshold()
        public
        view
        override(Governor, GovernorSettings)
        returns (uint256)
    {
        return super.proposalThreshold();
    }

    function state(
        uint256 proposalId
    )
        public
        view
        override(Governor, IGovernor, GovernorTimelockControl)
        returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function propose(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        string memory description
    )
        public
        override(Governor, GovernorCompatibilityBravo, IGovernor)
        returns (uint256)
    {
        return super.propose(targets, values, calldatas, description);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal
        view
        override(Governor, GovernorTimelockControl)
        returns (address)
    {
        return super._executor();
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(Governor, IERC165, GovernorTimelockControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
