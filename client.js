"use strict";

if (process.argv == null || process.argv.length != 4) {
  console.log('Two arguments is required as {amount: number} \'{from:currency}->{to:currency}\'');
  return;
}
if (isNaN(process.argv[2])) {
  console.log('Amount should be number');
  return;
}
const amount = process.argv[2];
const currencies = process.argv[3].split('->');
if (currencies.length != 2) {
  console.log('Convertion options should be \'{from:currency}->{to:currency}\'');
  return;
}
if (currencies.some(item => item.length != 3)) {
  console.log('Currencies should be 3 letters long');
  return;
}

const thrift = require('thrift');
const CurrencyConverter = require('./gen-nodejs/CurrencyConverter');
const ttypes = require('./gen-nodejs/currency-converter_types');
const assert = require('assert');

const transport = thrift.TBufferedTransport;
const protocol = thrift.TBinaryProtocol;

const connection = thrift.createConnection("currency-converter-thr.herokuapp.com", 8080, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  assert(false, err);
});

const client = thrift.createClient(CurrencyConverter, connection);

client.convert(amount, currencies[0], currencies[1], (err, result) => {
  if (err) {
    console.log("Error : " + err);
  } else {
    console.log(result);
  }
  connection.end();
});
