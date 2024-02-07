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

    // Declare cbdcinstance mapping to store instances of CBDCCoin contract for each country
    mapping(string => CBDCCoin) public cbdcinstance;

    mapping(address => uint256) public balanceOf;
    mapping(string => CentralBankInfo) public centralBanksByCountry;

    event Mint(address indexed to, uint256 value);
    event CBDCIssued(address indexed to, uint256 value);

    modifier onlyCreator() {
        require(
            msg.sender == creator,
            "Only creator/invoker is allowed of this action"
        );
        _;
    }

    struct CentralBankInfo {
        address centralBankContractAddress;
        string name;
        string symbol;
    }

    function addCentralBank(
        string memory _name,
        string memory _symbol,
        string memory country,
        address contractAddress
    ) public {
        name = _name;
        symbol = _symbol;
        creator = msg.sender;

        // Initialize the CBDCCoin instance for the given country
        cbdcinstance[country] = CBDCCoin(contractAddress);

        centralBanksByCountry[country] = CentralBankInfo({
            centralBankContractAddress: contractAddress,
            name: _name,
            symbol: _symbol
        });
    }

    function mint(uint256 _value, string memory country) public  {
        require(_value > 0, "Mint value must be greater than 0");
        uint256 cbdcIssued = _value;
        totalSupply = totalSupply.add(_value);
        balanceOf[msg.sender] = balanceOf[msg.sender].add(_value);

        // Issue CBDCs to the central bank
        cbdcinstance[country].requestTokens(msg.sender, _value);

        emit Mint(msg.sender, _value);
        emit CBDCIssued(msg.sender, cbdcIssued);
    }
}
