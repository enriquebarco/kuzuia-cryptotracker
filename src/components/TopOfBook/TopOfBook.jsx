import React, { useState } from 'react'
import { addCommas } from '../../utils';
import "./TopOfBook.scss";

function TopOfBook({ price, price24hr, bestBid, bestAsk }) {

    const spread = (bid, ask) => {
        const numBid = parseFloat(bid);
        const numAsk = parseFloat(ask);
        return (((numAsk - numBid) / numAsk) * 100).toFixed(2);
    }

    const percent24hr = (previous, current) => {
        const curPrice = parseFloat(current);
        const prePrice = parseFloat(previous);
        const pChange = (((curPrice - prePrice) / prePrice) * 100);

        const classBoolean = pChange > 0

        return [pChange.toFixed(2), classBoolean];
    }
  return (
    <section className="top-of-book">
        <div className="top-of-book__container--spread">
            <div className="top-of-book__spread-wrapper">
                <h4 className="top-of-book__subtitle">Bid</h4>
                <h3 className="top-of-book__BA-price">${addCommas(bestBid)}</h3>
            </div>
            <div className="top-of-book__spread-wrapper">
                <h4 className="top-of-book__subtitle">Ask</h4>
                <h3 className="top-of-book__BA-price">${addCommas(bestAsk)}</h3>
            </div>
            <div className="top-of-book__spread-wrapper">
                <h4 className="top-of-book__subtitle">Spread</h4>
                <h3 className="top-of-book__BA-price">{spread(bestBid, bestAsk)}%</h3>
            </div>
        </div>
        <div className="top-of-book__container">
            <h3 className="top-of-book__price">${addCommas(price)}</h3>
            <h4 className="top-of-book__title">Price</h4>
        </div>
        <div className="top-of-book__container">
            <h3 className={`top-of-book__percent-change ${percent24hr(price24hr, price)[1] ? "top-of-book__percent-change--positive" : "top-of-book__percent-change--negative"}`}>{percent24hr(price24hr, price)[0]}%</h3>            
            <h4 className="top-of-book__subtitle">24hr change</h4>
        </div>
    </section>
  )
}

export default TopOfBook