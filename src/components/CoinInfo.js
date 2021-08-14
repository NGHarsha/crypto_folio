import React, { useState, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { createChart, CrosshairMode } from "lightweight-charts";
import "./CoinInfo.css";
import axios from "axios";
var W3CWebSocket = require("websocket").w3cwebsocket;

const CoinInfo = (props) => {
  // console.log(props.match);
  // console.log("Inside");
  const symbol = props.match.params.coinid;

  const chartContainerRef = useRef();
  const chart = useRef();
  const resizeObserver = useRef();

  const [data, setData] = useState([]);

  const addMessage = (message) => {
    // console.log("In message");
    var d = message["k"];
    // console.log(message);
    // console.log(d);
    var temp = {
      x: new Date(message.E),
      y: [d.o, d.h, d.l, d.c],
    };

    setData((state) => [...state, temp]);
    console.log(data);
    // console.log("state", data);
  };

  const clientRef = useRef(null);

  useEffect(() => {
    console.log("effect mount");

    let candleSeries;

    if (!chart.current) {
      chart.current = createChart(chartContainerRef.current, {
        width: 1800,
        height: 380,
        layout: {
          backgroundColor: "#000000",
          textColor: "rgba(255, 255, 255, 0.9)",
        },
        grid: {
          vertLines: {
            color: "rgba(197, 203, 206, 0.5)",
          },
          horzLines: {
            color: "rgba(197, 203, 206, 0.5)",
          },
        },
        crosshair: {
          mode: CrosshairMode.Magnet,
        },
        rightPriceScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
        },
        timeScale: {
          borderColor: "rgba(197, 203, 206, 0.8)",
        },
        priceScale: {
          autoScale: true,
        },
        localization: {
          priceFormatter: (price) => price.toFixed(5),
        },
      });

      //console.log(chart.current);

      candleSeries = chart.current.addCandlestickSeries({
        upColor: "#4bffb5",
        downColor: "#ff4976",
        borderDownColor: "#ff4976",
        borderUpColor: "#4bffb5",
        wickDownColor: "#838ca1",
        wickUpColor: "#838ca1",
      });

      const getHistoriclData = async () => {
        const res = await axios.get(
          `http://localhost:5000/api/coins/history/${symbol}usdt`
        );

        // console.log(res.data.data);
        // setData(res.data.data);
        candleSeries.setData(res.data.data);
      };
      getHistoriclData();
    }

    if (!clientRef.current) {
      const client = new W3CWebSocket(
        `wss://stream.binance.com:9443/ws/${symbol}usdt@kline_1d`
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
        // addMessage(JSON.parse(message.data));
        message = JSON.parse(message.data);
        console.log(message["k"].c);
        var d = message["k"];
        // console.log(message);
        // console.log(d);
        var temp = {
          time: d.t / 1000,
          open: parseFloat(d.o),
          high: parseFloat(d.h),
          low: parseFloat(d.l),
          close: parseFloat(d.c),
        };

        candleSeries.update(temp);
      };

      return () => {
        console.log("Cleanup");
        // Dereference, so it will set up next time
        clientRef.current = null;

        client.close();
      };
    }
  }, []);

  return (
    <div className="chart-container">
      <div ref={chartContainerRef} />
    </div>
  );
};

export default CoinInfo;
