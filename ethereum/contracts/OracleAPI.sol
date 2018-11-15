pragma solidity ^0.4.21;
//
// This is the API file to be included by a user of this oracle
//

// This must match the signature in dispatch.sol
contract Oracle {
  function query(string _queryType, address _originator, string _query) public returns (bytes32);
}

// This must match the signature in lookup.sol
contract OracleLookup {
  function getQueryAddress() public constant returns (address);
  function getResponseAddress() public constant returns (address);
}

// The actual part to be included in a client contract
contract usingOracle {
  address constant lookupContract = 0x046426E713877cd504E0b1dD586d059F202dF457;

  modifier onlyFromOracle() {
    OracleLookup lookup = OracleLookup(lookupContract);
    require(msg.sender == lookup.getResponseAddress());
    _;
  }

  function queryOracle(string queryType, address originator, string query) public returns (bytes32) {
    OracleLookup lookup = OracleLookup(lookupContract);
    Oracle oracle = Oracle(lookup.getQueryAddress());
    return oracle.query(queryType, originator, query);
  }
}
