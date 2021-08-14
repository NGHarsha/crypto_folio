import React, { useState, useRef, useEffect } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Button } from "@material-ui/core";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";

import AssetTransaction from "./AssetTransaction";

const AddAsset = ({ open, handleClose, scroll, coins, setUserCoin }) => {
  const coinRefs = useRef(new Array());

  const [currentCoin, setCurrentCoin] = useState("");
  const [search, setSearch] = useState("");

  const [innerOpen, setInnerOpen] = useState(false);

  const handleClickOpen = () => {
    setInnerOpen(true);
  };

  const handleInnerClose = (res) => {
    console.log(res.type, res.coin);
    if (res.type === "success") {
      setUserCoin(res.coin);
    }
    setInnerOpen(false);
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleCloseOperations = () => {
    setSearch("");
    handleClose();
  };

  const handleClick = (e, index) => {
    console.log(coinRefs.current[index]);
    // console.log(coinRefs.current[index].symbol.toUpperCase());
    setCurrentCoin({
      ...coinRefs.current[index].coin,
      symbol: coinRefs.current[index].coin.symbol.toUpperCase(),
    });
    handleCloseOperations();
    handleClickOpen();
  };

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleCloseOperations}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        {/* <DialogTitle id="scroll-dialog-title">Search Asset</DialogTitle> */}
        <DialogContent
          dividers={scroll === "paper"}
          style={{ height: "80vh", width: "400px" }}
        >
          <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
            <div>
              <TextField
                label="Search Asset"
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onChange={handleChange}
              />
            </div>
            {filteredCoins.length > 0 &&
              filteredCoins.map((coin, index) => {
                return (
                  <div className="coin-container">
                    <div className="coin-row">
                      <a
                        href="#"
                        onClick={(event) => handleClick(event, index)}
                        style={{ textDecoration: "none" }}
                      >
                        <div className="coin">
                          <img src={coin.image} alt="crypto" />
                          <h1
                            ref={() =>
                              (coinRefs.current[index] = {
                                coin,
                              })
                            }
                          >
                            {coin.name}
                          </h1>
                          <p className="coin-symbol">{coin.symbol}</p>
                        </div>
                      </a>
                    </div>
                  </div>
                );
              })}
          </DialogContentText>
        </DialogContent>
        <DialogActions></DialogActions>
      </Dialog>
      <AssetTransaction
        open={innerOpen}
        handleClose={handleInnerClose}
        coin={currentCoin}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return { coins: state.coins };
};

export default connect(mapStateToProps)(AddAsset);
