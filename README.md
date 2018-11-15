# truffle-oracle-test
Truffle and Ganache test with custom oracle scripts (Thanx to @axic)

## Smart Contracts Installation
(For doubts also consult [tinyOracle](https://github.com/axic/tinyoracle) project)

1. ``npm install && cd ethereum``
2. In a separate termina run ganache with network id 7775 ``ganache-cli -i 7775``, or edit ``truffle.js``
2. ``truffle migrate`` or if truffle not installed globally ``../node_modules/.bin/truffle migrate``
3. Change OracleAPI.sol adding the new OracleLookup address
4. ``truffle migrate -f 3``


## Setup Dummy Monitoring
In a temporary directory do:
```npm init
npm install --save json-server
```
In the same directory create a ``db.json`` file with dummy monitor values. Example
```
{
        "monitor": [
                {"id": "client", "value": "10"},
                {"id": "provider", "value": "60"}]
}
```

## Start the oracle server
Start oracle server:
  ``node oracle.js``
