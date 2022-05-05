import React from 'react'
import { Line, _Chart } from "react-chartjs-2";
import { _Chart as _ChartJS } from 'chart.js/auto'
import _ from "lodash";
import "./PriceChart.scss";

function PriceChart( { historicalData } ) {
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

  return (
    <div price-chart__container>
        <Line data={historicalData} options={opts} />
    </div>
  )
}

export default PriceChart