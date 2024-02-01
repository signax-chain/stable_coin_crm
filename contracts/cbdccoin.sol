// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./SafeMath.sol";

contract CBDCCoin {
    //use SafeMath library
    using SafeMath for uint256;

    //Name of token
    string public name = "CBDCCoin";
    //Symbol of token
    string public symbol = "CBDC";
    //Standard of token
    string public standard = "ERC20";
    address public burner;
    address public creator;
    uint256 public totalSupply = 0; //constructor INITIALISATION

    uint256 public userAccountsNum = 0; // number that will identify how many unique user addresses are there in the network
    uint256 public bankNum = 0;

    //create a state variable to record totalDeposits so far
    uint256 public depositCount = 0; //constructor INITIALISATION

    uint256 public centralBank = 0;

    //dynamic array of addresses of banks
    address[] public banks;

    //create struct for interest deposit
    struct Deposit {
        uint256 id;
        address payable depositor;
        address payable provider;
        uint256 rate;
        uint256 timeperiod;
        uint256 principal;
        uint256 maxDepositAmt;
        uint256 endtime;
        uint256 starttime;
        uint256 interest;
        uint256 amt;
        bool isAvailable;
        bool notRedeemed;
    }

    struct AccountInfo {
        address userAddress;
        address creatorAddress;
        string name;
        string iddata;
        uint256 idnum;
    }

    struct Tokens {
        uint256 token_id;
        string name;
        string symbol;
        uint256 supply;
    }

    struct BankDetails {
        uint256 bank_id;
        string name;
        string extension;
        string bank_address;
    }

    struct CentralBankDetails {
        address smart_contract_address;
        address bank_user_address;
        uint256 token_supply;
        string token_name;
        string token_symbol;
    }

    CentralBankDetails[] public centralBankList;
    //create a dynamic array of user AccountInfo mapping with accounts number for listing valid user accounts later
    mapping(uint256 => AccountInfo) public accountDetailsById;
    mapping(address => AccountInfo) public accountDetailsByAddr;
    mapping(address => AccountInfo[]) public accountDetailsByBankId;

    //valid addresses mapping i.e. true is assigned for user addresses that were created
    mapping(address => bool) public validAddresses; //for all addresses
    mapping(address => bool) public validBankAddresses; //only for banks addresses;

    //create a dynamic array of deposits
    mapping(uint256 => Deposit) public deposits;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    //create a dynamic token
    mapping(address => Tokens) public addressTokens;

    //create a dynamic bank
    mapping(address => BankDetails[]) public addressBankList;

    mapping(address => uint256) public requestedTokens;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    event UserAccountCreated(
        address indexed _userAddress,
        address indexed _creatorAddress,
        string _name,
        string _iddata,
        uint256 _idnum
    );

    event TokensRequested(address indexed requester, uint256 tokens);
    event TokensIssued(address indexed requester, uint256 tokens);

    constructor() {
        creator = msg.sender; //the one who deploys the contract will be the owner/creator
        burner = address(0);
        validBankAddresses[msg.sender] = true;
        setValidAddress(creator); //creators address should also be initialized, so that tokens can be returned to central bank later
    }

    modifier onlyCreator() {
        require(
            msg.sender == creator,
            "Only creator/invoker is allowed of this action"
        );
        _;
    }

    //call this function when central bank wants to add/enlist an address as a bank address
    function addBank(
        address _bankAddr,
        BankDetails memory details
    ) public onlyCreator returns (bool success) {
        banks.push(address(_bankAddr));
        bankNum++; //increase the number of addresses for banks
        validBankAddresses[_bankAddr] = true;
        setValidAddress(_bankAddr); //bank addresses also need to be set to true, so central bank can transfer tokens
        addressBankList[msg.sender].push(details);
        return true;
    }

    //function that will add real world account address info into blockchain; this S.C. function should be called on Account address creation
    //we need a modifier that says that only banks will be able to execute this
    function addUserAddressInfo(
        address _userAddress,
        address _bankAddress,
        string memory _name,
        string memory _iddata
    ) public returns (bool success) {
        require(
            validBankAddresses[msg.sender] == true,
            "Only a valid bank address can create user accounts"
        );
        userAccountsNum++;
        accountDetailsById[userAccountsNum] = AccountInfo(
            _userAddress,
            msg.sender,
            _name,
            _iddata,
            userAccountsNum
        );
        accountDetailsByBankId[_bankAddress].push(
            AccountInfo(
                _userAddress,
                msg.sender,
                _name,
                _iddata,
                userAccountsNum
            )
        );
        emit UserAccountCreated(
            _userAddress,
            msg.sender,
            _name,
            _iddata,
            userAccountsNum
        );
        setValidAddress(_userAddress);
        return true;
    }

    // function that sets an address as valid so as to approve transfer "to" accounts
    // call this function while creating a new user account after calling addUserAddressInfo
    function setValidAddress(address _addr) public returns (bool success) {
        validAddresses[_addr] = true;
        return true;
    }

    function invalidateUserAddress(
        address _addr
    ) public returns (bool success) {
        require(
            validBankAddresses[msg.sender] == true,
            "Only a bank or central bank can invalidate user address"
        );
        validAddresses[_addr] = false;
        return true;
    }

    function invalidateBankAddress(
        address _bankAddr
    ) public returns (bool success) {
        require(
            msg.sender == creator,
            "Only the central bank can invalidate bank addresses"
        );
        validBankAddresses[_bankAddr] = false;
        return true;
    }

    // transfer
    function transfer(
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // exception if account doesn't have enough
        require(
            balanceOf[msg.sender] >= _value,
            "Sender doesn't have sufficient balance"
        );

        //amount to transfer must be a valid address
        require(
            validAddresses[_to] == true,
            "To address is not validated address"
        );

        //transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        // transfer event
        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    //msg.sender is allowing _spender to spend _value tokens from msg.sender accounts
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function addTokens(
        uint256 _quantity
    ) public onlyCreator returns (bool success) {
        totalSupply += _quantity;
        balanceOf[creator] += _quantity;
        centralBankList[0].token_supply += _quantity;
        return true;
    }

    function burnTokens(uint256 _quantity) public returns (bool success) {
        transfer(burner, _quantity);
        totalSupply -= _quantity;
        return true;
    }

    //the caller is an authorized address
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        require(balanceOf[_from] >= _value);
        require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }

    //provider BANK offers deposits
    function offerDeposit(
        uint256 _rate,
        uint256 _timeperiod,
        uint256 _maxDepositAmt
    ) public returns (bool success) {
        //perform basic requirement check
        require(
            validAddresses[msg.sender] == true,
            "Service provider must be a valid address"
        );
        require(
            balanceOf[msg.sender] >= _maxDepositAmt,
            "Provider doesn't have minimum balance"
        );
        depositCount++;

        //initialize the Deposit struct for the corresponding id
        deposits[depositCount] = Deposit(
            depositCount,
            payable(0),
            payable(0),
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            false,
            false
        );

        //update the fields of the created Deposit struct
        deposits[depositCount].id = depositCount;
        deposits[depositCount].provider = payable(msg.sender);
        deposits[depositCount].rate = _rate;
        deposits[depositCount].timeperiod = _timeperiod;
        deposits[depositCount].maxDepositAmt = _maxDepositAmt;
        deposits[depositCount].isAvailable = true;
        return true;
    }

    //depositor makes deposit
    function makeDeposit(
        uint256 _id,
        uint256 _principal
    ) public payable returns (bool success) {
        // basic requirements checks
        require(
            validAddresses[msg.sender] == true,
            "Depositor address is not yet validated"
        );
        require(
            balanceOf[msg.sender] >= _principal,
            "Depositor must have sufficient tokens to make deposits"
        );
        require(
            _principal <= deposits[_id].maxDepositAmt,
            "Cannot make deposit for value greater than offered"
        );
        require(
            deposits[_id].isAvailable == true,
            "Cannot make deposit to an unavailable state"
        );

        //setup values for the deposits mapping
        deposits[_id].depositor = payable(msg.sender);
        deposits[_id].principal = _principal;
        deposits[_id].starttime = block.timestamp;
        deposits[_id].endtime =
            deposits[_id].starttime +
            deposits[_id].timeperiod *
            1 minutes;
        deposits[_id].notRedeemed = true;
        deposits[_id].isAvailable = false;

        //transfer the amounts from depositor to provider
        address payable _provider = deposits[_id].provider;
        balanceOf[msg.sender] -= _principal;
        balanceOf[_provider] += _principal;

        //calculate interest and amount that will be later redeemed
        uint256 _ptr;
        uint256 _rate = deposits[_id].rate;
        uint256 _timeperiod = deposits[_id].timeperiod;
        _ptr = (_principal.mul(_rate)).mul(_timeperiod);
        deposits[_id].interest = _ptr.div(100);
        deposits[_id].amt = _principal.add(deposits[_id].interest);

        return true;
    }

    function receiveBack(uint256 _id) public payable returns (bool success) {
        // basic requirements checks
        require(
            block.timestamp >= deposits[_id].endtime,
            "Redemption time has not reached."
        );
        require(
            msg.sender == deposits[_id].depositor,
            "Call back is only allowed from depositor."
        );
        require(
            deposits[_id].notRedeemed == true,
            "Redemption should not have been made yet."
        );

        //retrive amount and provider from deposits
        uint256 _amount = deposits[_id].amt;
        address payable _provider = deposits[_id].provider;
        balanceOf[msg.sender] += _amount;
        balanceOf[_provider] -= _amount;

        //update notRedeemed flag
        deposits[_id].notRedeemed = false;

        return true;
    }

    function getAllToken(
        address bank_address
    ) public view returns (Tokens memory token) {
        return addressTokens[bank_address];
    }

    function createToken(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        CentralBankDetails memory bankDetails
    ) public onlyCreator returns (bool success) {
        totalSupply += _initialSupply; //INCASE WE WANT TO ISSUE MORE TOKEN LATER
        balanceOf[msg.sender] = totalSupply; //initialize totalSupply to the address creator
        addressTokens[msg.sender] = Tokens(
            block.timestamp,
            _name,
            _symbol,
            _initialSupply
        );
        centralBank++;
        centralBankList.push(bankDetails);
        return true;
    }

    function getAllBanks(
        address bank_address
    ) public view returns (BankDetails[] memory bankList) {
        return addressBankList[bank_address];
    }

    function getAllUserFromBankAddress(
        address bankAddress
    ) public view returns (AccountInfo[] memory info) {
        return accountDetailsByBankId[bankAddress];
    }

    function getAllCentralBankData()
        public
        view
        returns (CentralBankDetails[] memory allCentralBanks)
    {
        return centralBankList;
    }

    function getBalanceOf(
        address _address
    ) public view returns (uint256 _price) {
        return balanceOf[_address];
    }

    function requestTokens(
        address _requester,
        uint256 _tokens
    ) public returns (bool success) {
        require(
            validAddresses[_requester] == true,
            "Requester address is not validated"
        );
        require(_tokens > 0, "Requested token quantity must be greater than 0");

        // Update requestedTokens mapping
        requestedTokens[_requester] = _tokens;

        emit TokensRequested(_requester, _tokens);
        return true;
    }

    function approveTokens(
        address _requester
    ) public onlyCreator returns (bool success) {
        uint256 requestedAmount = requestedTokens[_requester];
        require(requestedAmount > 0, "No tokens requested by the address");

        // Transfer tokens to the requester
        balanceOf[creator] = balanceOf[creator].sub(requestedAmount);
        balanceOf[_requester] = balanceOf[_requester].add(requestedAmount);

        // Clear the requestedTokens mapping
        requestedTokens[_requester] = 0;

        emit TokensIssued(_requester, requestedAmount);
        return true;
    }
}
