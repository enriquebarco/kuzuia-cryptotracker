import React, { useState } from 'react'
import PriceHero from '../PriceHero/PriceHero';
import OrderBook from "../OrderBook/OrderBook";
import PriceChart from "../PriceChart/PriceChart";

function MobileVersion({ price, price24hr, volume, bestAsk, bestBid, asks, bids, historicalData, setTimeFrame }) {
    const [isChart, setIsChart] = useState(true);

  return (
    <section>
          <PriceHero
            price={price}
            price24hr={price24hr}
            volume={volume}
            bestAsk={bestAsk}
            bestBid={bestBid}
          />

          {
            isChart ? 
            <PriceChart 
              historicalData={historicalData}
              setTimeFrame={setTimeFrame}
              setIsChart={setIsChart}
            />
            :
            <OrderBook
              bestAsk={bestAsk}
              bestBid={bestBid}
              asks={asks}
              bids={bids}
              setIsChart={setIsChart}
            />
          }
    </section>
  )
}

export default MobileVersion