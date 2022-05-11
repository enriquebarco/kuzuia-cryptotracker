import React, {useState} from 'react'
import { Line } from "react-chartjs-2";
// eslint-disable-next-line
import { _Chart as _ChartJS } from 'chart.js/auto'
import "./PriceChart.scss";
import chartGold from "../../assets/icons/chart-gold.png";
import lineWhite from "../../assets/icons/line-white.png";
import { addCommas } from "../../utils";

function PriceChart( { historicalData, setTimeFrame, setIsChart } ) {
    const [activeChart, setActiveChart] = useState("sixMonths");


    const responsiveFonts = (size) => {

        if(size >= 1280) {
            return 16;
        }

        if(size >= 678) {
            return 14;
        }

        
        return 12;
    }


    const opts = {
        plugins: {
            legend: {
                display: true,
                position: "bottom",
                align: "center",
                labels: {
                    color: "white",
                    font: {
                        size: responsiveFonts(window.innerWidth),
                    }
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
                    color: "white",
                    font: {
                        size: responsiveFonts(window.innerWidth),
                    }
                }
            },
            y: {
                ticks: {
                    callback: (value, index, ticks) => {
                        return "$" + addCommas(value.toString());
                    },
                    color:"white",
                    font: {
                        size: responsiveFonts(window.innerWidth),
                    }
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
      <section className="price-chart">
        <div className="price-chart__title-wrapper">
            <h3 className="price-chart__title">Price Charts</h3>
            <div className="price-chart__button-wrapper">
                <img src={chartGold} alt="price chart " className="price-chart__icon" />
                <img onClick={handleClick} src={lineWhite} alt="order book " className="price-chart__icon" />
            </div>
        </div>
        <div className="price-chart__container">
            <h3 className="price-chart__title-desk">Price Chart</h3>
            <div className="price-chart__dates-wrapper">
                <button onClick={handleTimeChange1} className={`price-chart__button ${activeChart === "sixMonths" ? "price-chart__button-active" : ""}`}>6 Mos</button>
                <button onClick={handleTimeChange2} className={`price-chart__button ${activeChart === "threeMonths" ? "price-chart__button-active" : ""}`}>3 Mos</button>
                <button onClick={handleTimeChange3} className={`price-chart__button ${activeChart === "oneWeek" ? "price-chart__button-active" : ""}`}>1 Wk</button>
            </div>
            <Line data={historicalData} options={opts} />
        </div>
      </section>
  )
}

export default PriceChart