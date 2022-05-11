import React, { useState } from 'react';
import chartWhite from "../../assets/icons/chart-white.png";
import lineGold from "../../assets/icons/line-gold.png";
import { addCommas } from '../../utils';
import minusIcon from "../../assets/icons/minus.png";
import plusIcon from "../../assets/icons/plus.png";
import "./OrderBook.scss";

const possibleIncrements = [ 0.00, 0.01, 0.05, 0.10, 0.50, 1.00, 2.50, 5.00, 10.00];

function OrderBook({ bestAsk, bestBid, asks, bids, setIsChart }) {
  const [aggregate, setAggregate] = useState(0.00);

  const handleClick = () => {
    setIsChart(true);
  };

  const handleIncrement = () => {
    const index = possibleIncrements.indexOf(aggregate);
    const newIndex = index + 1;
    if(newIndex === 9) return;
    setAggregate(possibleIncrements[newIndex]);
  }

  const handleDecrement = () => {
    const index = possibleIncrements.indexOf(aggregate);
    const newIndex = index - 1;
    if(newIndex === -1) return;
    setAggregate(possibleIncrements[newIndex]);
  }

  const spread = (bid, ask) => {
    const numBid = parseFloat(bid);
    const numAsk = parseFloat(ask);
    return (((numAsk - numBid) / numAsk) * 100).toFixed(2);
  }

  const toSortArr = (map, type) => {
    const allEntries = [...map.entries()];

    const aggregatedMap = new Map();
    let sorted;
    let multiple;
    let entries;

    if(type === "asks") {
      // created sorted array of entries
      const sorted = allEntries.sort((a,b) => a[0] - b[0]);


      if(!aggregate) {
        return sorted.slice(0, 15);
      }

      let count = sorted[0][0];
      let threshold = count + aggregate;
      
      //iterate through sorted array and create a new map that aggregates all prices based on state increments
      for(let [price, size] of sorted) {
        
        if(price < threshold) {
          aggregatedMap.set(count, (aggregatedMap.get(count) + size) || size);
          
        } else {
          count = threshold;
          multiple = ((price + aggregate) - threshold) / aggregate
          threshold += (aggregate * multiple);

          aggregatedMap.set(count, (aggregatedMap.get(count) + size) || size);
        }
      }
      
      entries = [...aggregatedMap.entries()].sort((a,b) => a[0] - b[0]);
      
      return entries.sort((a,b) => a[0] - b[0]).slice(0,15);

    } else {

      sorted = allEntries.sort((a,b) => b[0] - a[0]);

      if(!aggregate) {
        return sorted.slice(0, 15);
      }

      let count = sorted[0][0];
      let threshold = count - aggregate;

      for(let [price, size] of sorted) {
        
        if(price > threshold) {
          aggregatedMap.set(count, (aggregatedMap.get(count) + size) || size);
          
        } else {
          count = threshold;
          multiple = (threshold - (price - aggregate)) / aggregate
          threshold -= (aggregate * multiple);
          
          aggregatedMap.set(count, (aggregatedMap.get(count) + size) || size);
        }

        entries = [...aggregatedMap.entries()].sort((a,b) => b[0] - a[0]);
      }
      return entries.sort((a,b) => b[0] - a[0]).slice(0,15);
    }
  }

  return (
    <section className="order-book">
      <div className="order-book__title-wrapper">
            <h3 className="order-book__title">Order Book</h3>
            <div className="order-book__button-wrapper">
                <img onClick={handleClick} src={chartWhite} alt="price chart " className="price-chart__icon" />
                <img src={lineGold} alt="order book " className="price-chart__icon" />
            </div>
      </div>
      <div className="order-book__container">
        <div className="order-book__top-of-book-container">
          <div className="order-book__top-of-book-wrapper">
              <h3 className="order-book__title">{spread(bestBid, bestAsk)}%</h3>
              <h4 className="order-book__subtitle">Spread</h4>
          </div>
          <div className="order-book__top-of-book-wrapper">
            <div className="order-book__aggregate-wrapper">
              <img onClick={handleDecrement} src={minusIcon} alt="minus" className="order-book__aggregate-icon" />
              <h3 className="order-book__title order-book__title--aggregate">{aggregate.toFixed(2)}</h3>
              <img onClick={handleIncrement} src={plusIcon} alt="plus" className="order-book__aggregate-icon" />
            </div>
              <h4 className="order-book__subtitle order-book__subtitle--aggregate">Aggregate</h4>
          </div>
        </div>
        <div className="order-book__top-of-book-container">
          <div className="order-book__top-of-book-wrapper">
            <h3 className="order-book__title order-book__title--bid">${addCommas(bestBid)}</h3>
            <h4 className="order-book__subtitle">Best Bid</h4>
          </div>
          <div className="order-book__top-of-book-wrapper">
              <h3 className="order-book__title order-book__title--ask">${addCommas(bestAsk)}</h3>
              <h4 className="order-book__subtitle order-book__subtitle--ask">Best Ask</h4>
          </div>
        </div>
        <div className="order-book__details-container">
          <div className="order-book__bids-wrapper">
            <div className="order-book__column">
              <h4 className="order-book__details-subtitle">Price</h4>
              <h4 className="order-book__details-subtitle">Size</h4>
            </div>
            {
              toSortArr(bids, "bids").map(([value, key], index) => {
                return (
                    <div key={index} className="order-book__details-wrapper fade-in-bid">
                      <h5 className="order-book__text order-book__text--bids">${addCommas(value.toFixed(2))}</h5>
                      <h5 className="order-book__text">{addCommas(key.toFixed(2))}</h5>
                    </div>
                )
              })
            }
          </div>
          <div className="order-book__asks-wrapper">
          <div className="order-book__column">
              <h4 className="order-book__details-subtitle">Price</h4>
              <h4 className="order-book__details-subtitle">Size</h4>
            </div>
            {
              toSortArr(asks, "asks").map(([value, key], index) => {
                return (
                  <div key={index} className="order-book__details-wrapper fade-in-ask">
                    <h5 className="order-book__text order-book__text--asks">${addCommas(value.toFixed(3))}</h5>
                    <h5 className="order-book__text">{addCommas(key.toFixed(2))}</h5>
                  </div>
                )
              })
            }
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrderBook