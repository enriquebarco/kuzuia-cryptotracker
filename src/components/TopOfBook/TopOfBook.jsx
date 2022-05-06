import React from 'react';
import { addCommas } from '../../utils';
import "./TopOfBook.scss";

function TopOfBook({ price, price24hr, volume }) {

    const percent24hr = (previous, current) => {
        const curPrice = parseFloat(current);
        const prePrice = parseFloat(previous);
        const pChange = (((curPrice - prePrice) / prePrice) * 100);

        const classBoolean = pChange > 0

        return [pChange.toFixed(2), classBoolean];
    }

    if(!price) {
        return;
    }

  return (
    <section className="top-of-book">
        
        <div className="top-of-book__container">
            <h3 className="top-of-book__text">{addCommas(parseFloat(volume).toFixed(2))}</h3>
            <h4 className="top-of-book__subtitle">30d Volume</h4>
        </div>
        <div className="top-of-book__container">
            <h3 className="top-of-book__price">${addCommas(price)}</h3>
            <h4 className="top-of-book__title">Price</h4>
        </div>
        <div className="top-of-book__container">
            <h3 className={`top-of-book__text ${percent24hr(price24hr, price)[1] ? "top-of-book__text--positive" : "top-of-book__text--negative"}`}>{percent24hr(price24hr, price)[0]}%</h3>            
            <h4 className="top-of-book__subtitle">24hr change</h4>
        </div>
    </section>
  )
}

export default TopOfBook