import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { formatData } from "./utils";
import _ from "lodash";
import Header from "./components/Header/Header";
import Placeholder from "./components/Placeholder/Placeholder";
import DeskTopVersion from "./components/DeskTopVersion/DeskTopVersion";
import MobileVersion from "./components/MobileVersion/MobileVersion";

function App() {
  const [currencies, setCurrencies] = useState([]);
  const [pair, setPair] = useState("");
  const [timeFrame, setTimeFrame] = useState("sixMonths");
  const [price, setPrice] = useState("");
  const [price24hr, setPrice24hr] = useState("");
  const [volume, setVolume] = useState("");
  const [bestAsk, setBestAsk] = useState("");
  const [bestBid, setBestBid] = useState("");
  const [asks, setAsks] = useState({});
  const [bids, setBids] = useState({});
  const [historicalData, setHistoricalData] = useState({});
  const ws = useRef(null);

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.exchange.coinbase.com");
    ws.current.onopen = () => console.log("ws open");
    ws.current.onclose = () => console.log("ws closed");

    // API call to get a list of all currency pairs
      axios.get(`${url}/products`)
        .then((res) => {
          const mainPairsArr = ["BTC-USD", "ETH-USD", "LTC-USD", "BCH-USD"]
          const mainPairs = [...res.data].filter((pair) => mainPairsArr.includes(pair.id)).sort((a,b) => a.id.localeCompare(b.id)); // pairs users will see first
          const filtered = [...res.data].filter((pair) => {
            if(pair.quote_currency === "USD" && !mainPairsArr.includes(pair.id)) {
              return pair;  // returning only USD currencies excluding including the main pairs
            }
            return false

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
      
    }, [pair]);

    useEffect(() => {
      if(!first.current) {
        return;
      }

      let historicalDataUrl = `${url}/products/${pair}/candles?granularity=86400`;
    
      // API call to get historical prices, used for charts
      axios.get(historicalDataUrl)
        .then((res) => setHistoricalData(formatData(timeFrame, res.data)))
        .catch((err) => console.log(err));
  
    }, [pair, timeFrame])
    
    useEffect(() => {
      //handling all the responses from the websocket
      ws.current.onmessage = (e) => {
        let data = JSON.parse(e.data);
  
        //handle ticker channel response for pricing
        if(data.type === "ticker") {
          if(data.product_id === pair) {
            setVolume(data.volume_30d);
            setPrice(data.price);
            setPrice24hr(data.open_24h);
            setBestAsk(data.best_ask);
            setBestBid(data.best_bid);
          }
        }
  
        
        //handle initial level2 response
        if(data.type === "snapshot") {
  
          let asksMap = new Map();
          let bidsMap = new Map();
          
          //only saving initial 15 bid/asks to prevent stack overflow and optimize speed
          for(let i = 0; i < 15; i++) {
            asksMap.set(parseFloat(data.asks[i][0]), parseFloat(data.asks[i][1]));
            bidsMap.set(parseFloat(data.bids[i][0]), parseFloat(data.bids[i][1]));
          }
  
          setAsks(asksMap);
          setBids(bidsMap);
          
          return;
        }
        
        //handling consequent level2 channel responses which will be used to update ladder created with the initial response
        if(data.type === "l2update") {
          
          data.changes.forEach(change => {
            const [action, price, amount] = change;
            const parsedPrice = parseFloat(price)
            const parsedAmount = parseFloat(amount);

            
            // As new asks/bids get added into the Map, the size will grow. However, with deletions also happening in real time when asks/bids are fulfilled, the map should never increase to more than 1000
            if(action === "sell") {
              if(parsedAmount) {
                  setAsks((prevAsks) => prevAsks.set(parsedPrice, parsedAmount)); 
              } else {
                setAsks((prevAsks) => {
                  const newAsks = new Map(prevAsks);
                  newAsks.delete(parsedPrice);
                  return newAsks;
                })
              };
            } else {
              if(parsedAmount) {
                  setBids((prevBids) => prevBids.set(parsedPrice, parsedAmount));
              } else {
                setBids((prevBids) => {
                  const newBids = new Map(prevBids);
                  newBids.delete(parsedPrice);
                  return newBids;
                });
              };
            };
          });
        };
    };
  }); //dependency array not included so state is always included in scope after every render cycle

  setTimeout(() => {
    // preventing timeout from websocket
    if(!pair) {
      setPair("BTC-USD")
    }
  }, 30000)

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

      <Header 
        currencies={currencies}
        pair={pair}
        handleSelect={handleSelect}
      />
      {
        (_.isEmpty(asks) || _.isEmpty(bids) || !price || _.isEmpty(historicalData)) ?
        <Placeholder />
        :
        window.innerWidth >= 1280 ?
          <DeskTopVersion
            price={price}
            price24hr={price24hr}
            volume={volume}
            bestAsk={bestAsk}
            bestBid={bestBid}
            asks={asks}
            bids={bids}
            historicalData={historicalData}
            setTimeFrame={setTimeFrame}
          />
          :
          <MobileVersion
            price={price}
            price24hr={price24hr}
            volume={volume}
            bestAsk={bestAsk}
            bestBid={bestBid}
            asks={asks}
            bids={bids}
            historicalData={historicalData}
            setTimeFrame={setTimeFrame}
          />
      }
    </div>
  );
}

export default App;
