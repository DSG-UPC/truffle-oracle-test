pragma solidity ^0.4.21;
//
// An example client calling our oracle service
//
import "./OracleAPI.sol";

contract OracleTest is usingOracle {
  uint public response;
  string public entity;
  bytes32 public id;

  function __oracleCallback(uint _response, string _entity) onlyFromOracle public {
    response = _response;
    entity = _entity;
  }

  function query() public {
    string memory tmp = "http://localhost:4000/monitor/client";
    query(tmp);
  }

  function query(string _query) internal {
    id = queryOracle('monitor',address(this),_query);
  }
}
