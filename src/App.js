import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setpair] = useState("");
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

  // useEffect(() => {
  //   if(!first.current) {
  //     return;
  //   }

  //   let msg = {
  //     type: "subscribe",
  //     product_ids: [pair],
  //     channels: ["ticker"]
  //   };
  //   let jsonMsg = JSON.stringify(msg);
  //   ws.current.send(jsonMsg);
  // }, [pair])

  return (
    <div className="App">
      {currencies.map((x) => {
        return <li key={x.id}>{x.id}</li>
      })}
    </div>
  );
}

export default App;
