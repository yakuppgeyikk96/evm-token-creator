// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {BaseToken} from "./BaseToken.sol";

contract TokenFactory is Ownable {
    // --- State ---

    uint256 public creationFee;

    address[] private _allTokens;
    mapping(address creator => address[] tokens) private _tokensByCreator;

    // --- Events ---

    event TokenCreated(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 initialSupply,
        uint256 cap
    );

    event CreationFeeUpdated(uint256 oldFee, uint256 newFee);

    // --- Constructor ---

    constructor() Ownable(msg.sender) {
        creationFee = 0;
    }

    // --- Token Creation ---

    struct CreateTokenParams {
        string name;
        string symbol;
        uint256 initialSupply;
        uint256 cap;
        BaseToken.TokenConfig config;
    }

    function createToken(
        CreateTokenParams calldata params
    ) external payable returns (address) {
        require(msg.value >= creationFee, "TokenFactory: insufficient fee");

        BaseToken token = new BaseToken(
            params.name,
            params.symbol,
            params.initialSupply,
            msg.sender,
            params.cap,
            params.config
        );

        address tokenAddress = address(token);
        _allTokens.push(tokenAddress);
        _tokensByCreator[msg.sender].push(tokenAddress);

        emit TokenCreated(
            tokenAddress,
            msg.sender,
            params.name,
            params.symbol,
            params.initialSupply,
            params.cap
        );

        return tokenAddress;
    }

    // --- View Functions ---

    function getTokensByCreator(
        address creator
    ) external view returns (address[] memory) {
        return _tokensByCreator[creator];
    }

    function getAllTokens() external view returns (address[] memory) {
        return _allTokens;
    }

    function getTokenCount() external view returns (uint256) {
        return _allTokens.length;
    }

    // --- Fee Management (Owner Only) ---

    function setCreationFee(uint256 newFee) external onlyOwner {
        uint256 oldFee = creationFee;
        creationFee = newFee;
        emit CreationFeeUpdated(oldFee, newFee);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "TokenFactory: nothing to withdraw");
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "TokenFactory: withdraw failed");
    }
}
