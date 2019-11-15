export const networkFeesFormula = {
         slug: {
           btc_fee:
             "<BTC Purchased> / 25 * 0.00012342 (this value will change in the future) = Fee BTC",
           bch_fees:
             "0.010 (Value can change) * Qty BCH Buy / JST Price = BCH fee (1 cent worth of current price of BCH)",
           eth_fees:
             "This is static but 1 value could change over time.0.000000004 (this value can change) * 21000 = 0.000084004 ETH",
           xrp_fees:
             "Ripple XRP:0.00001 XRP Static with the ability to modify the flat fee.",
           ltc_fees:
             "0.00017 LTC  Static with the ability to modify the flat fee"
         }
       };