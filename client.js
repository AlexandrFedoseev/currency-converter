'use-strict';

(function(process, console){
    if (process.argv == null || process.argv.length != 4) {
        console.log('Two arguments is required as {amount: number} \'{from:currency}->{to:currency}\'');
        return;
    }
    if (isNaN(process.argv[2])) {
        console.log('Amount should be number');
        return;
    }
    var amount = process.argv[2];
    var currencies = process.argv[3].split('->');
    if (currencies.length != 2) {
        console.log('Convertion options should be \'{from:currency}->{to:currency}\'');
        return;
    }
    if (currencies.some(item => item.length != 3)) {
        console.log('Currencies should be 3 letters long');
        return;
    }

    var thrift = require('thrift');
    var CurrencyConverter = require('./gen-nodejs/CurrencyConverter');
    var ttypes = require('./gen-nodejs/currency-converter_types');
    var assert = require('assert');
    const transport = thrift.TBufferedTransport;
    const protocol = thrift.TBinaryProtocol;

    const connection = thrift.createConnection('138.68.191.55', 5000, {
        transport: transport,
        protocol: protocol
    });

    connection.on('error', function (err) {
        assert(false, err);
    });
    console.log('connected to http://138.68.191.55:5000');
    const client = thrift.createClient(CurrencyConverter, connection);
    client.ping(function (err, response) {});
    client.convert(amount, currencies[0], currencies[1], (err, result) => {
        if (err) {
            console.log('Error : ' + err);
        } else {
            console.log(result);
        }
        connection.end();
    });
})(process, console);
