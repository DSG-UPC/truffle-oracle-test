const Artifactor = require("truffle-artifactor");
const path = require('path');
const fs = require('fs');
const requireNoCache = require('require-nocache')(module);

const outPath = path.resolve('./');
const expected_filepath = path.join(outPath, 'OracleLookup.json');
const artifactor = new Artifactor(outPath);
//artifactor.save({/*...*/}, "./MyContract.sol.js")

const inPath = path.resolve('./build/contracts/');


const OracleDispatch = artifacts.require("OracleDispatch");

const OracleLookup = artifacts.require("OracleLookup");


let getData = contract => {
  return {
    contract_name: contract.contract_name,
    abi: contract.abi,
    address: contract.address,
    network_id: contract.network_id,
    default_network: contract.networks[contract.network_id]

  }
}


module.exports = function(deployer, network, accounts) {
  deployer.deploy(OracleDispatch)
    .then(function (instance) {
      //Example for saving the contract info
      artifactor.save(getData(OracleDispatch)).then(function(result){
        const json = requireNoCache(expected_filepath);
        console.log(contract(json));
      });
      return instance.address;
    })
    .then(function (dispatch) {
      //The "return" in the following line is necessary
      return deployer.deploy(OracleLookup)
        .then(function (instance) {
          console.log('Lookup address :'+instance.address);
          instance.setQueryAddress(dispatch);
          instance.setResponseAddress(accounts[0]);
        });
    })
};
