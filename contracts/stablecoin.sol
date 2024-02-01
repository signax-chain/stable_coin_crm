// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "./cbdccoin.sol";
import "./SafeMath.sol";

contract StableCoin {
    using SafeMath for uint256;

    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    address public creator;

    address public centralBank;
    CBDCCoin public cbdcCoinContract;  // Add an instance of Cbdc_Coin

    mapping(address => uint256) public balanceOf;

    event Mint(address indexed to, uint256 value);
    event CBDCIssued(address indexed to, uint256 value);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply,
        address _centralBank,
        address _cbdcCoinAddress  // Pass the address of Cbdc_Coin in the constructor
    ) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply * 10**uint256(decimals);
        creator = msg.sender;
        centralBank = _centralBank;
        balanceOf[_centralBank] = totalSupply; // Initial supply is assigned to the central bank

        // Initialize the Cbdc_Coin contract
        cbdcCoinContract = CBDCCoin(_cbdcCoinAddress);

        // Issue equivalent number of CBDC coins
        // cbdcCoinContract.addTokens(totalSupply);

        emit Mint(_centralBank, totalSupply);
    }

    modifier onlyCreator() {
		require(msg.sender == creator, "Only creator/invoker is allowed of this action");
		_;
	}

    function mint(uint256 _value) public onlyCreator {
        require(_value > 0, "Mint value must be greater than 0");
        uint256 cbdcIssued = _value;
        totalSupply = totalSupply.add(_value);
        balanceOf[msg.sender] = balanceOf[msg.sender].add(_value);

        // Issue CBDCs to the central bank
        // cbdcCoinContract.addTokens(cbdcIssued);
        cbdcCoinContract.requestTokens(msg.sender,_value);

        emit Mint(msg.sender, _value);
        emit CBDCIssued(msg.sender, cbdcIssued);
    }
}

