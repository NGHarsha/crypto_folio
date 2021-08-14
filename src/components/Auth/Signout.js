import React, { useEffect } from "react";
import { connect } from "react-redux";
import { storeUser } from "../../actions";
import { useHistory } from "react-router";
import { toast } from "react-toastify";

const Signout = (props) => {
  const history = useHistory();

  useEffect(() => {
    props.storeUser("DELETE_USER", null);
    toast.success("Logout Success");
    history.push("/");
  }, []);

  return (
    <div>
      <h3>Logging you out. Please wait.</h3>
    </div>
  );
};

export default connect(null, { storeUser })(Signout);
