import React from 'react'
import bitcoin from "../../assets/images/bitcoin.gif";
import "./Placeholder.scss";

function Placeholder() {
  return (
    <div className="placeholder">
      <img src={bitcoin} alt="bitcoin gif" className="placeholder__image" />
    </div>
  )
}

export default Placeholder