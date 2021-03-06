/*
Based on https://github.com/robinagist/EthereumWeatherOracle
*/
const web3 = require('./web3');
const fs = require('fs');
const request = require('request');
const monitorServer = 'http://localhost:4000/monitor/';

const oracleDispatch = require('./build/contracts/OracleDispatch.json');
const args = process.argv;
const network_id = args[2];
const oracleAddress = oracleDispatch.networks[network_id].address;
const oracleAbi = oracleDispatch.abi;
let account;

const getAccount = async () => {
  const accounts = await web3.eth.getAccounts();
  account = accounts[0];
  console.log('Working from account ', account);
};

let c = getAccount().then( function(){
  console.log("contract address: " + oracleAddress);
  startListener(oracleAbi, oracleAddress);
}, function(err) {
    console.log("shit didn't work.  here's why: " + err)
})

// starts the event listener
async function startListener(abi, address) {

    console.log("starting event monitoring on contract: " + address);
    console.log("the abi is:" + abi);
    const myContract = await new web3.eth.Contract(jsonInterface=abi, address=address);
    myContract.events.Incoming({fromBlock: 'latest'
    }, function(error, event){ console.log(">>> " + event) })
        .on('data', (log) => {
            console.log("event data: " + JSON.stringify(log, undefined, 2))
            logData = log.returnValues;
            switch (logData.queryType) {
              case 'monitor':
                monitorHandler(logData.id, logData.recipient, logData.originator, logData.query);
                break;
              case 'nodedb':
                nodedbHandler(logData.id, logData.recipient, logData.originator, logData.query);
                break;
            }
            //handler(abi, address)
        })
        .on('changed', (log) => {
            console.log(`Changed: ${log}`)
        })
        .on('error', (log) => {
            console.log(`error:  ${log}`)
        })
}


// handles a request event and sends the response to the contract
function monitorHandler(id, recipient, originator, query) {
    //let url = monitorServer + entity+'/';
    // TODO sanitize and check validity of monitoring url since
    // it is provided by the user
    console.log('Query: '+query);
    let url = query;
    request(url, function(error, response, body) {
        if(error)
            console.log("error: " + error)

        console.log("status code: " + response.statusCode);
        let wx = JSON.parse(body);
        let traffic = Math.round(wx.value);
        console.log("Traffic (MB): " + traffic);
        debugger;
        web3.eth.sendTransaction({
          from: account,
          to: recipient,
          data: web3.eth.abi.encodeFunctionCall({
            name: '__oracleCallback',
            type: 'function',
            inputs: [{
                type: 'uint256',
                name: '_response'
              },{
                type: 'string',
                name: '_originator'
            }]
          }, [traffic,originator]),
          gas: web3.utils.numberToHex(300000)
        })
        .then(function(result) {
            console.log("EVM call result: ")
            console.log(result);
        }, function(error) {
            console.log("error "  + error)
        })


    })
}

// handles a request event and sends the response to the contract
function nodedbHandler(id, recipient, entity, query) {
    console.log('NODEDB');
}

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
