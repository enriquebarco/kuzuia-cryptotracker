import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatData } from "./utils";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("BTC-USD");
  const [granularity, setGranularity] = useState(86400);
  const [historicalData, setHistoricalData] = useState({});
  const ws = useRef(null);

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

      axios.get(`${url}/products`)
        .then((res) => {
          const mainPairsArr = ["BTC-USD", "ETH-USD", "LTC-USD", "BCH-USD"]
          const mainPairs = [...res.data].filter((pair) => mainPairsArr.includes(pair.id)); // pairs users will see first
          const filtered = [...res.data].filter((pair) => {
            if(pair.quote_currency === "USD" && !mainPairsArr.includes(pair.id)) {
              return pair;  // returning only USD currencies excluding including the main pairs
            }

          });
          const sorted = filtered.sort((a,b) => a.id.localeCompare(b.id)); // sort pairs in alphabetical order
          const totalCurrencies = mainPairs.concat(sorted);
          setCurrencies(totalCurrencies);
        });

      first.current = true;
  }, []);

  useEffect(() => {
    if(!first.current) {
      return;
    }

    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    let historicalDataUrl = `${url}/products/${pair}/candles?granularity=${granularity}`;

    axios.get(historicalDataUrl)
      .then((res) => setHistoricalData(formatData(res.data)))
      .catch((err) => console.log(err));

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      console.log(data);
    };

  }, [pair]);

  const handleSelect = (e) => {
    let unsubscribeMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsubscribe = JSON.stringify(unsubscribeMsg);

    ws.current.send(unsubscribe);

    setPair(e.target.value);
  }

  return (
    <div className="App">
      {
        <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((xe, indx) => {
            return (
              <option key={indx} value={xe.id}>
                {xe.display_name}
              </option>
            )
          })}
        </select>
      }
    </div>
  );
}

export default App;
