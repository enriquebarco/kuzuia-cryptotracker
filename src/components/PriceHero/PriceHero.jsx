import React from 'react';
import { addCommas } from '../../utils';
import "./PriceHero.scss";

function PriceHero({ price, price24hr, volume }) {

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
    <section className="hero">
        
        <div className="hero__container">
            <h3 className="hero__text">{addCommas(parseFloat(volume).toFixed(2))}</h3>
            <h4 className="hero__subtitle">30d Volume</h4>
        </div>
        <div className="hero__container">
            <h3 className="hero__price">${addCommas(price)}</h3>
            <h4 className="hero__title">Price</h4>
        </div>
        <div className="hero__container">
            <h3 className={`hero__text ${percent24hr(price24hr, price)[1] ? "hero__text--positive" : "hero__text--negative"}`}>{percent24hr(price24hr, price)[0]}%</h3>            
            <h4 className="hero__subtitle">24hr change</h4>
        </div>
    </section>
  )
}

export default PriceHero