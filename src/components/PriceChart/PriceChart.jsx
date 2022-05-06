import React, {useState} from 'react'
import { Line, Chart } from "react-chartjs-2";
import { _Chart as _ChartJS } from 'chart.js/auto'
import _ from "lodash";
import "./PriceChart.scss";
import chartGold from "../../assets/icons/chart-gold.png";
import lineWhite from "../../assets/icons/line-white.png";

function PriceChart( { historicalData, setTimeFrame, setIsChart } ) {
    const [activeChart, setActiveChart] = useState("sixMonths");


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
        setActiveChart("sixMonths");
        setTimeFrame(string);
    }

    const handleTimeChange2 = () => {
        const string = "threeMonths";
        setActiveChart(string);
        setTimeFrame(string);
    }

    const handleTimeChange3 = () => {
        const string = "oneWeek";
        setActiveChart(string);
        setTimeFrame(string);
    }

    const handleClick = () => {
        setIsChart(false)
    }

    return (
      <div className="price-chart">
        <div className="price-chart__title-wrapper">
            <h3 className="price-chart__title">Price Charts</h3>
            <div className="price-chart__button-wrapper">
                <img src={chartGold} alt="price chart " className="price-chart__icon" />
                <img onClick={handleClick} src={lineWhite} alt="order book " className="price-chart__icon" />
            </div>
        </div>
        <div className="price-chart__container">
            <div className="price-chart__dates-wrapper">
                <button onClick={handleTimeChange1} className={`price-chart__button ${activeChart === "sixMonths" ? "price-chart__button-active" : ""}`}>6 Mos</button>
                <button onClick={handleTimeChange2} className={`price-chart__button ${activeChart === "threeMonths" ? "price-chart__button-active" : ""}`}>3 Mos</button>
                <button onClick={handleTimeChange3} className={`price-chart__button ${activeChart === "oneWeek" ? "price-chart__button-active" : ""}`}>1 Wk</button>
            </div>
            <Line data={historicalData} options={opts} />
        </div>
      </div>
  )
}

export default PriceChart