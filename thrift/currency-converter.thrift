exception RequestError {
    1: string message
}

service CurrencyConverter {
    void ping(),
    string convert(1:double amount, 2:string fromCurrency, 3:string toCurrency) throws (1:RequestError err)
}