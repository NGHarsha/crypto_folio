import { combineReducers } from "redux";

const coinsReducer = (coins = [], action) => {
  if (action.type === "SAVE_COINS") {
    coins = action.payload;
  }
  return coins;
};

const userReducer = (user = { isLoggedIn: false }, action) => {
  if (action.type === "UPDATE_USER") {
    user = {
      id: action.payload.userId,
      email: action.payload.email,
      token: action.payload.token,
      isLoggedIn: true,
    };
  }
  if (action.type === "DELETE_USER") {
    user = { isLoggedIn: false };
  }
  return user;
};

export default combineReducers({
  coins: coinsReducer,
  user: userReducer,
});
