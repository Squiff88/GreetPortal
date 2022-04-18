// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.4;

import "hardhat/console.sol";

contract GreetPortal {
    uint256 totalGreets;
    uint256 private seed;

    // Define event emitter
    event GreetEvent(address indexed from, uint256 timestamp, string message);

    // Define datatype greet struct
    struct Greet {
        address greetSender;
        string message;
        uint256 timestamp;
    }

    // Place to store total greets
    Greet[] greets;

    // Mapping for cooldown of waving
    mapping(address => uint256) public lastGreetedAt;

    constructor() payable {
        seed = (block.difficulty + block.timestamp) % 100;
    }

    function greet(string memory _message) public {
        require(
            lastGreetedAt[msg.sender] + 1 minutes < block.timestamp,
            "Please wait for 1 minute before your next greet"
        );

        // updated greet time
        lastGreetedAt[msg.sender] = block.timestamp;

        // updated greet count
        totalGreets += 1;

        uint256 prizeAmount = 0.0001 ether;

        // Generate 'random' number
        seed = (block.difficulty + block.timestamp + seed) % 100;

        if (seed <= 50) {
            require(
                prizeAmount <= address(this).balance,
                "Tying to withdraw more ether than the contract have"
            );

            (bool success, ) = (msg.sender).call{value: prizeAmount}("");

            require(success, "Failed to withdraw money from contract.");
        }

        // Add the greet to arr
        greets.push(Greet(msg.sender, _message, block.timestamp));

        // Emit greet event to the blockchain
        emit GreetEvent(msg.sender, block.timestamp, _message);
    }

    function getTotalGreetCount() public view returns (uint256) {
        return totalGreets;
    }

    function getAllGreets() public view returns (Greet[] memory) {
        return greets;
    }

    function deleteGreet(uint256 _idx) public returns (Greet[] memory) {
        Greet memory deletedGreet;
        deletedGreet.greetSender = msg.sender;
        deletedGreet.message = "";
        deletedGreet.timestamp = 0;

        greets[_idx] = deletedGreet;

        // Emit greet event to the blockchain
        emit GreetEvent(msg.sender, block.timestamp, deletedGreet.message);

        return greets;
    }
}
