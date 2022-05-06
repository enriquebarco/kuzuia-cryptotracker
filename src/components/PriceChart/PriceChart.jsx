import React, {useState} from 'react'
import { Line, Chart } from "react-chartjs-2";
import { _Chart as _ChartJS } from 'chart.js/auto'
import _ from "lodash";
import "./PriceChart.scss";
import { addCommas } from '../../utils';

function PriceChart( { historicalData, setTimeFrame } ) {
    const [active, setActive] = useState("price-chart__button-six-mos");


    const opts = {
        plugins: {
            legend: {
                display: true,
                position: "bottom",
                align: "center",
                labels: {
                    color: "white"
                }
            },
        },
        tooltips: {
          intersect: false,
          mode: "index"
        },
        scales: {
            x: {
                ticks: {
                    color: "white"
                }
            },
            y: {
                ticks: {
                    callback: (value) => {
                        return "$" + value;
                    },
                    color:"white"
                }
            }
        },
        responsive: true,
        maintainAspectRatio: false
      };
      
      const handleTimeChange1 = () => {
          const string = "sixMonths";
        setActive("sixMonths");
        setTimeFrame(string);
    }

    const handleTimeChange2 = () => {
        const string = "threeMonths";
        setActive(string);
        setTimeFrame(string);
    }

    const handleTimeChange3 = () => {
        const string = "oneWeek";
        setActive(string);
        setTimeFrame(string);
    }
    
    if(_.isEmpty(historicalData)) {
        return <h2>choose</h2>
    };

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
                <button onClick={handleTimeChange1} className={`price-chart__button-six-mos ${active === "sixMonths" ? "price-chart__button-active" : ""}`}>6 Mos</button>
                <button onClick={handleTimeChange2} className={`price-chart__button-three-mos ${active === "threeMonths" ? "price-chart__button-active" : ""}`}>3 Mos</button>
                <button onClick={handleTimeChange3} className={`price-chart__button-one-wk ${active === "oneWeek" ? "price-chart__button-active" : ""}`}>1 Wk</button>
            </div>
            <Line data={historicalData} options={opts} />
        </div>
      </div>
  )
}

export default PriceChart