import { Update } from "@material-ui/icons";
import React, { useState, useEffect, useRef, useReducer } from "react";
import "./Coin.css";
var W3CWebSocket = require("websocket").w3cwebsocket;

function reducer(state, action) {
  const { p, pc } = action.payload;
  var c1 = p > state.dprice ? " green" : " red";
  var c2 = pc > state.dpriceChange ? " green" : " red";

  return { dprice: p, priceColor: c1, dpriceChange: pc, priceChangeColor: c2 };
}

const Coin = ({
  name,
  price,
  symbol,
  marketcap,
  volume,
  image,
  priceChange,
}) => {
  const clientRef = useRef(null);

  //priceColor depends on dynamic price. When state variables depend on each other it's good to use useReducer instead of useState.
  //Redux is used when state needs to be passed on to multiple children. useReducer is component specific.
  const [state, dispatch] = useReducer(reducer, {
    dprice: price,
    priceColor: "",
    dpriceChange: priceChange,
    priceChangeColor: "",
  });

  const { dprice, priceColor, dpriceChange, priceChangeColor } = state;

  useEffect(() => {
    if (!clientRef.current) {
      console.log("Inside");
      const client = new W3CWebSocket(
        `wss://stream.binance.com:9443/ws/${symbol}usdt@ticker`
      );
      clientRef.current = client;

      window.client = client;

      client.onerror = (e) => console.error(e);

      client.onopen = () => {
        console.log("ws opened");
      };

      client.onclose = () => {
        if (clientRef.current) {
          // Connection failed
          console.log("ws closed by server");
        } else {
          // Cleanup initiated from app side, can return here, to not attempt a reconnect
          console.log("ws closed by app component unmount");
          return;
        }

        console.log("ws closed");
      };

      client.onmessage = (message) => {
        var data = JSON.parse(message.data);

        let p = parseFloat(data.c).toFixed(3);
        let pc = parseFloat(data.P);

        //if useState is used in place of useReducer, the logic will be as follow.
        // setDpriceChange((cpc) => {
        //   pc > cpc
        //     ? setPriceChangeColor((c) => {
        //         return "green";
        //       })
        //     : setPriceChangeColor((c) => {
        //         return "red";
        //       });
        //   return pc;
        // });
        // setDprice((cp) => {
        //   p > cp
        //     ? setPriceColor((c) => {
        //         return "green";
        //       })
        //     : setPriceColor((c) => {
        //         return "red";
        //       });
        //   return p;
        // });

        dispatch({ payload: { p, pc } });
      };

      return () => {
        console.log("Cleanup");
        // Dereference, so it will set up next time
        clientRef.current = null;

        client.close();
      };
    }
  }, [dispatch]);
  return (
    <div className="coin-container">
      <div className="coin-row">
        <div className="coin">
          <img src={image} alt="crypto" />
          <h1>{name}</h1>
          <p className="coin-symbol">{symbol}</p>
        </div>
        <div className="coin-data">
          {/* <p className="coin-price">${price}</p> */}
          <p className={`coin-price`} style={{ color: priceColor }}>
            {dprice}
          </p>
          <p className="coin-volume">${volume.toLocaleString()}</p>

          {/* {priceChange < 0 ? (
            <p className="coin-percent red">{dpriceChange.toFixed(2)}%</p>
          ) : (
            <p className="coin-percent">{dpriceChange.toFixed(2)}%</p>
          )} */}
          <p className={`coin-percent`} style={{ color: priceChangeColor }}>
            {dpriceChange.toFixed(2)}%
          </p>

          <p className="coin-marketcap">
            Mkt Cap: ${marketcap.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Coin;
