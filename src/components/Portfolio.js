import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@material-ui/core";
import "./CoinList.css";
import "./Coin.css";
import AddAsset from "./AddAsset";
import { Dashboard } from "./Dashboard";

import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  grid: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "64px",
    color: "#000000",
    width: "100%",
    margin: "0px",
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: "center",
  },
}));

const Portfolio = (props) => {
  const classes = useStyles();
  const [userCoins, setUserCoins] = useState([]);
  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = useState("");
  const [render, setRender] = useState(0);

  const setCoinFromDialog = (coin) => {
    console.log("Inside setCoinFromDialog");
    // console.log([...userCoins, coin]);

    // setUserCoins([...userCoins, coin]);
    console.log(render);
    setRender(1);
  };

  const process = (coins) => {
    var sorted = Object.values(coins).sort(function (a, b) {
      return b.value - a.value;
    });

    setUserCoins(sorted);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/coins/user/${props.user.id}`,
          { headers: { Authorization: `Bearer ${props.user.token}` } }
        );
        console.log(res.data);
        if (res.status === 200) {
          process(res.data.coins);
        }
      } catch (err) {
        toast.error(err.response.data.message);
      }
    }
    fetchData();
  }, [render]);

  const handleClick = () => {
    setOpen(true);
    setScroll("body");
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="coin-app">
      {userCoins.length > 0 && (
        <Grid container>
          <Grid item xs={12} md={8} className={classes.paper}>
            <div className="coin-container">
              <div className="coin-row-header">
                <div className="coin-header">
                  <h1>Name</h1>
                  <p className="coin-symbol">Symbol</p>
                </div>
                <div className="coin-data">
                  <p className="coin-price">Total Holdings</p>
                  <p className="coin-volume">Total Volume</p>
                </div>
              </div>
            </div>

            {userCoins.map((coin) => {
              return (
                <div key={coin.id} className="coin-container">
                  <div className="coin-row">
                    <div className="coin">
                      <img src={coin.image} alt="crypto" />
                      <h1>{coin.name}</h1>
                      <p className="coin-symbol">{coin.symbol}</p>
                    </div>
                    <div className="coin-data">
                      <p className="coin-price">${coin.value}</p>
                      <p className="coin-volume">
                        {coin.volume.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <br />
            <Button variant="contained" color="primary" onClick={handleClick}>
              Add Asset
            </Button>
          </Grid>
          <Grid item xs={12} md={4} className={classes.paper}>
            <Dashboard coins={userCoins} />
          </Grid>
        </Grid>
      )}
      {userCoins.length === 0 && (
        <>
          <h3>You dont have any assets.</h3>
          <br />
          <Button variant="contained" color="primary" onClick={handleClick}>
            Add Asset
          </Button>
        </>
      )}

      <AddAsset
        open={open}
        handleClose={handleClose}
        setUserCoin={setCoinFromDialog}
        scroll={scroll}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  // console.log(state);
  return { user: state.user };
};

export default connect(mapStateToProps)(Portfolio);
