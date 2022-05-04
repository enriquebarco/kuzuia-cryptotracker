import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatData } from "./utils";
import uniqid from "uniqid";
import _ from "lodash";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("");
  const [granularity, setGranularity] = useState(86400);
  const [price, setPrice] = useState("0.00")
  const [historicalData, setHistoricalData] = useState({});
  const [asks, setAsks] = useState({});
  const [bids, setBids] = useState({});
  const ws = useRef(null);

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

    // API call to get a list of all currency pairs
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

          first.current = true;
        });

  }, []);

  useEffect(() => {
    //ensuring websocket connection is established
    if(!first.current) {
      return;
    }

    //subscribe to websocket channels: ticker used for price and level2 used for ladder
    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker", "level2_batch"]
    };
    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);

    let historicalDataUrl = `${url}/products/${pair}/candles?granularity=${granularity}`;
    
    // API call to get historical prices, used for charts
    axios.get(historicalDataUrl)
      .then((res) => setHistoricalData(formatData(res.data)))
      .catch((err) => console.log(err));

      
    }, [pair]);
    
    useEffect(() => {
    //handling all the responses from the websocket
    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);

      //handle ticker channel response for pricing
      if(data.type === "ticker") {
        if(data.product_id === pair) {
          let price = data.price.replace(/\B(?=(\d{3})+(?!\d))/g, ","); //regex to add commas for user readability
          setPrice(price);
        }
      }

      
      //handle initial level2 response
      if(data.type === "snapshot") {

        let asksMap = new Map();
        let bidsMap = new Map();
        
        //only saving initial twenty bid/asks to prevent stack overflow and optimize speed
        for(let i = 0; i < 20; i++) {
          asksMap.set(data.asks[i][0], parseFloat(data.asks[i][1]));
          bidsMap.set(data.bids[i][0], parseFloat(data.bids[i][1]));
        }

        setAsks(asksMap);
        setBids(bidsMap);
        
        return;
      }

      
      //handling consequent level2 channel responses which will be used to update ladder created with the initial response
      if(data.type === "l2update") {
        
        
        data.changes.forEach(change => {
          const [action, price, amount] = change;
          const parsed = parseFloat(amount);
          
          if(action === "sell") {
            if(parsed) {
              setAsks((prevAsks) => prevAsks.set(price, parsed)); 
            } else {
              setAsks((prevAsks) => {
                const newAsks = new Map(prevAsks);
                newAsks.delete(price);
                return newAsks;
              })
              console.log("deleted!", price)
            };
          } else {
            if(parsed) {
              setBids((prevBids) => prevBids.set(price, parsed));
            } else {
              setBids((prevBids) => {
                const newBids = new Map(prevBids);
                newBids.delete(price);
                return newBids;
              });
            };
          };
        });
      };
    };
  }, [pair]);

  const handleSelect = (e) => {
    let unsubscribeMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker", "level2_batch"]
    };
    let unsubscribe = JSON.stringify(unsubscribeMsg);

    ws.current.send(unsubscribe);

    setPair(e.target.value);
  };

   return (
    <div className="App">
      
        <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((xe, indx) => {
            return (
              <option key={indx} value={xe.id}>
                {xe.display_name}
              </option>
            )
          })}
        </select>

        <h1>Price: ${price}</h1>
        {
          (_.isEmpty(asks) || _.isEmpty(bids)) ?
            <h2>establishing connection...</h2>
          :
          <div>
            <h4>asks</h4>
              {
                [...asks.entries()].map((value, key) => {
                  return (
                    <li key={uniqid()}>Price: ${value} || Size: {key}</li>
                    )
                  })
              }
            <h4>bids</h4>
              {
                [...bids.entries()].map((value, key) => {
                  return (
                    <li key={uniqid()}>Price: ${value} || Size: {key}</li>
                )
                })
              }
          </div>
        }
    </div>
  );
}

export default App;
