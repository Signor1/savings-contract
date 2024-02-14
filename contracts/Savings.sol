// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Savings{

    mapping (address => uint256 ) savings;

    event SavingsSuccssful(address indexed user, uint256 amount);

    function deposit() external payable {
        //sanity check
        require(msg.sender != address(0), "Wrong EOA");
        require(msg.value > 0, "insufficient amount");

        savings[msg.sender] = savings[msg.sender] + msg.value;

        emit SavingsSuccssful(msg.sender, msg.value);
    }

    function withdraw() external {
        //sanity check
        require(msg.sender != address(0), "Wrong EOA");

        //saves gas
        uint256 _userSavings = savings[msg.sender];
        require(_userSavings > 0, "No savings stored");

        savings[msg.sender] = savings[msg.sender] - _userSavings;

        payable(msg.sender).transfer(_userSavings);
    }

    function checkSavings(address _user) external view returns(uint256) {
        return savings[_user];
    }

    function sendoutSaving(address _reciever, uint256 _amount) external payable  {
        //sanity check
        require(msg.sender != address(0), "Wrong EOA");
        require(_amount > 0, "Can't send zero value");
        require(savings[msg.sender] >= _amount);

        savings[msg.sender] -= _amount;

        payable(_reciever).transfer(_amount);
    }

    function checkContractBal() external view returns (uint256){
        return address(this).balance;
    }
}