import React from 'react'
import { Line, _Chart } from "react-chartjs-2";
import { _Chart as _ChartJS } from 'chart.js/auto'
import _ from "lodash";
import "./PriceChart.scss";

function PriceChart( { historicalData, setTimeFrame } ) {
    const opts = {
        tooltips: {
          intersect: false,
          mode: "index"
        },
        responsive: true,
        maintainAspectRatio: false
      };
    if(_.isEmpty(historicalData)) {
        return <h2>choose</h2>
    };

    const handleTimeChange = (e) => {
        switch (e.target.className) {
            case "price-chart__button-six-mos": {
                setTimeFrame("sixMonths");
            }
            break;
            case "price-chart__button-three-mos": {
                console.log("clicked?")
                setTimeFrame("threeMonths");
            }
                break;
            case "price-chart__button-one-wk": {
                setTimeFrame("oneWeek");
            }
                break;
        }
        // setTimeFrame("sixMonths")
    }

  return (
      <div className="price-chart">
        <div className="price-chart__title-wrapper">
            <h3 className="price-chart__title">Price Charts</h3>
            <div className="price-chart__button-wrapper">
                <h5 className="price-chart__subtitle">Select</h5>
                <button className="price-chart__button">Charts</button>
                <button className="price-chart__button">Book</button>
            </div>
        </div>
        <div className="price-chart__container">
            <div className="price-chart__dates-wrapper">
                <button onClick={handleTimeChange} className="price-chart__button-six-mos">6 Mos</button>
                <button onClick={handleTimeChange} className="price-chart__button-three-mos">3 Mos</button>
                <button onClick={handleTimeChange} className="price-chart__button-one-wk">1 Wk</button>
            </div>
            <Line data={historicalData} options={opts} />
        </div>
      </div>
  )
}

export default PriceChart