import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core/";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Paper from "@material-ui/core/Paper";
import Draggable from "react-draggable";

import Input from "@material-ui/core/Input";
import FilledInput from "@material-ui/core/FilledInput";
import IconButton from "@material-ui/core/IconButton";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import axios from "axios";
import { connect } from "react-redux";
import { toast } from "react-toastify";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: "250px",
  },
}));

function AssetTransaction({ open, handleClose, coin, user }) {
  const classes = useStyles();

  const [values, setValues] = useState({
    atprice: "",
    volume: "",
  });

  const handleChange = (e, id) => {
    setValues({ ...values, [id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    console.log(values.atprice, values.volume, values.atprice * values.volume);
    const investment = (values.volume * values.atprice).toFixed(4);
    try {
      const res = await axios.post(
        `http://localhost:5000/api/coins/user/${user.id}`,
        {
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          volume: values.volume,
          atprice: values.atprice,
          investment,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      console.log(res.data);
      if (res.status === 201) {
        toast.success("Added Asset Transaction Successfully");
        handleClose({ type: "success", coin: res.data.coin });
      }
    } catch (err) {
      toast.error(err.response);
    }
    setValues({ atprice: "", volume: "" });
    handleClose({ type: "fail" });
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          Add {coin.name} Transaction
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Bought At Price
              </InputLabel>
              <OutlinedInput
                id="atprice"
                value={values.atprice}
                onChange={(e) => handleChange(e, "atprice")}
                endAdornment={<InputAdornment position="end">$</InputAdornment>}
                labelWidth={70}
              />
              <FormHelperText id="standard-weight-helper-text">
                Current price of {coin.symbol} is {coin.current_price}$
              </FormHelperText>
            </FormControl>
            <FormControl
              className={clsx(classes.margin, classes.textField)}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Volume Bought
              </InputLabel>
              <OutlinedInput
                id="volume"
                value={values.volume}
                onChange={(e) => handleChange(e, "volume")}
                endAdornment={
                  <InputAdornment position="end">{coin.symbol}</InputAdornment>
                }
                labelWidth={70}
              />
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

export default connect(mapStateToProps)(AssetTransaction);
