"use strict";

const thrift = require("thrift");
const request = require('request');
const CurrencyConverter = require("./gen-nodejs/CurrencyConverter");
const ttypes = require("./gen-nodejs/currency-converter_types");

const API_ACCESS_KEY = 'NXbSN8gcTSbWJkNJ2JtqbrFGRqM3P5';
const API_URL_BASE = 'https://www.amdoren.com/api/currency.php';

function calculateRate(base, converted) {
    return converted / base;
}

const server = thrift.createServer(CurrencyConverter, {
    convert: (amount, fromCurrency, toCurrency, result) => {
        request(`${
            API_URL_BASE
        }?api_key=${
            API_ACCESS_KEY
        }&from=${
            fromCurrency.toUpperCase()
        }&to=${
            toCurrency.toUpperCase()
        }&amount=${
            amount
        }`, (error, response, body) => {
            if (error != null || response.statusCode != 200) {
                const err = new ttypes.RequestError();
                err.message = 'Currency API is broken';
                result(err);
                return;
            }
            const parsedBody = JSON.parse(body);
            if (parsedBody.error != 0) {
                const err = new ttypes.RequestError();
                err.message = parsedBody.error_message;
                result(err);
                return;
            }
            const res = `${amount} ${fromCurrency} = ${
                parsedBody.amount.toFixed(2)} ${
                toCurrency} (1 ${fromCurrency} = ${
                calculateRate(amount, parsedBody.amount).toFixed(2)} ${
                toCurrency})`;
            result(null, res);
        });
    },
});

const port = process.env.PORT || 3000
server.listen(port);