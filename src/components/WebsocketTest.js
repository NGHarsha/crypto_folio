import React, { useEffect, useRef, useState } from "react";
var W3CWebSocket = require("websocket").w3cwebsocket;

const WebsocketTest = () => {
  const [data, setData] = useState([]);

  const clientRef = useRef(null);

  useEffect(() => {
    console.log("effect mount");
    if (!clientRef.current) {
      const client = new W3CWebSocket(
        `wss://stream.binance.com:9443/ws/btcusdt@kline_1m`
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
        // console.log(message.data);
        setData((cdata) => [...cdata, message.data]);
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
    <div>
      <h3>{data.length}</h3>
    </div>
  );
};

export default WebsocketTest;
