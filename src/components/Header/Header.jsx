import React from 'react'
import logo from "../../assets/icons/logo.png";
import "./Header.scss";

function Header({ currencies, pair, handleSelect }) {
  return (
    <header className="header">
        <img src={logo} alt="logo" className="header__logo" />
          <select name="currency" value={pair} onChange={handleSelect}className="header__selector">
            {currencies.map((xe, indx) => {
              return (
                <option className="header__selector-option" key={indx} value={xe.id}>{xe.display_name}</option>
              )
            })}
          </select>
          <h1 className="header__title">Kuzuia</h1>
    </header>
  )
}

export default Header