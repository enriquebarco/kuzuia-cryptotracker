import React from 'react'
import PriceHero from '../PriceHero/PriceHero';
import OrderBook from "../OrderBook/OrderBook";
import PriceChart from "../PriceChart/PriceChart";
import "./DeskTopVersion.scss";

function DeskTopVersion( { price, price24hr, volume, bestAsk, bestBid, asks, bids, historicalData, setTimeFrame }) {
  return (
    <section>
      <PriceHero
            price={price}
            price24hr={price24hr}
            volume={volume}
            bestAsk={bestAsk}
            bestBid={bestBid}
        />
        <div className="desktop-container">
          <OrderBook 
            bestAsk={bestAsk}
            bestBid={bestBid}
            asks={asks}
            bids={bids}
          />
          <PriceChart
            historicalData={historicalData}
            setTimeFrame={setTimeFrame}
          />
        </div>
    </section>
  )
}

export default DeskTopVersion