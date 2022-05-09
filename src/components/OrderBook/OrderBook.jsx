import React from 'react'
import chartWhite from "../../assets/icons/chart-white.png";
import lineGold from "../../assets/icons/line-gold.png";
import { addCommas } from '../../utils';
import "./OrderBook.scss";

function OrderBook({ bestAsk, bestBid, asks, bids, setIsChart }) {

  const handleClick = () => {
    setIsChart(true);
  };

  const spread = (bid, ask) => {
    const numBid = parseFloat(bid);
    const numAsk = parseFloat(ask);
    return (((numAsk - numBid) / numAsk) * 100).toFixed(2);
}

const toSortArr = map => {
  const entries = [...map.entries()].sort((a,b) => a[0] - b[0]);

  return entries;
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
          <div className="order-book__top-of-book-wrapper">
              <h3 className="order-book__title ">{spread(bestBid, bestAsk)}%</h3>
              <h4 className="order-book__subtitle">Spread</h4>
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
              toSortArr(bids).map(([value, key]) => {
                return (
                    <div className="order-book__details-wrapper fade-in-bid fade-out-bid">
                      <h5 className="order-book__text">${addCommas(value)}</h5>
                      <h5 className="order-book__text">{key.toFixed(3)}</h5>
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
              toSortArr(asks).map(([value, key]) => {
                return (
                  <div className="order-book__details-wrapper fade-in-ask fade-out-ask">
                    <h5 className="order-book__text">${addCommas(value)}</h5>
                    <h5 className="order-book__text">{key.toFixed(3)}</h5>
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