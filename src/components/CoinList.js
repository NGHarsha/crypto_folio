import React, { useState, useEffect } from "react";
import "./CoinList.css";
import Coin from "./Coin";
import { storeCoins } from "../actions";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const CoinList = (props) => {
  const coins = props.coins;
  useEffect(() => {
    props.storeCoins();
  }, []);

  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="coin-app">
      <div className="coin-search">
        <form>
          <input
            className="coin-input"
            type="text"
            onChange={handleChange}
            placeholder="Search"
          />
        </form>
      </div>
      {filteredCoins.map((coin) => {
        return (
          <Link to={`/coin/${coin.symbol}/`} style={{ textDecoration: "none" }}>
            <Coin
              key={coin.id}
              name={coin.name}
              price={coin.current_price}
              symbol={coin.symbol}
              marketcap={coin.total_volume}
              volume={coin.market_cap}
              image={coin.image}
              priceChange={coin.price_change_percentage_24h}
            />
          </Link>
        );
      })}
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log(state);
  return { coins: state.coins };
};

export default connect(mapStateToProps, { storeCoins })(CoinList);
