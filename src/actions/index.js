import axios from "axios";
export const storeCoins = () => {
  return async (dispatch, getState) => {
    const res = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    );
    dispatch({
      type: "SAVE_COINS",
      payload: res.data,
    });
  };
};

export const storeUser = (type, data) => {
  // console.log(data);
  return {
    type: type,
    payload: data,
  };
};
