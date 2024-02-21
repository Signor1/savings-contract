// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface ISavings {
    event SavingsSuccssful(address indexed user, uint256 amount);

    function deposit() external payable;

    function withdraw() external;

    function checkSavings(address _user) external view returns (uint256);

    function sendoutSaving(address _reciever, uint256 _amount) external payable;

    function checkContractBal() external view returns (uint256);

    function checkUserBal() external view returns (uint256);
}
