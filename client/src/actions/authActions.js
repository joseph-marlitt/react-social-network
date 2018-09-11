import { GET_ERRORS, SET_CURRENT_USER } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login - Get User Token

export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //Save to Local Storage
      const { token } = res.data;
      //Set Token to local storage
      localStorage.setItem("jwtToken", token);
      //Set token to auth header
      setAuthToken(token);
      //Decode Token for user data
      const decoded = jwt_decode(token);
      //Set current User
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Set Logged in User

export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log User Out
export const logoutUser = () => dispatch => {
  //remove token from local strorage
  localStorage.removeItem("jwtToken");
  //Remove Auth Header
  setAuthToken(false);
  //Set Current User to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};
