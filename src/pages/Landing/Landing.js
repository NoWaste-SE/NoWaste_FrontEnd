import { Box, Container, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Typical from "react-typical";
import './Landing.css';
import PulseLoader from "react-spinners/PulseLoader";

export default function Landing() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);

  const handleLogin = () => {
      history.push('./login');
  };

  const handleSignup = () => {
      history.push('./sign-up');
  };

  // const [data, setData] = useState([]);
  // const [done, setDone] = useState(undefined);
  // useEffect(() => {
  //   setTimeout(() => {
  //     fetch("https://jsonplaceholder.typicode.com/posts")
  //       .then((response) => response.json())
  //       .then((json) => {
  //         console.log(json);
  //         setData(json);
  //         setDone(true);
  //       });
  //   }, 3000);
  // }, []);
  useEffect(() => {
    // window.onload = () => {
    //   setLoading(false);
    // }
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }, []);

  return (
      <div className="loading">
          {loading ? (
              <PulseLoader
                  type="bars"
                  color='black'
                  speedMultiplier={"1"}
                  className="spinner"
                  data-testid="spinner-element"
              />
          ) : (
              <div className="land-back">
                  <nav className="navbar">
                      <form>
                          <button 
                              className="buttonland" 
                              role="button" 
                              onClick={handleLogin}
                          >
                              Log in
                          </button>
                          <button 
                              className="buttonland 
                              signup" 
                              role="button" 
                              onClick={handleSignup}
                          >
                              Sign up
                          </button>
                      </form>
                  </nav>
                  <Container className="container">
                      <Box className="land-box">
                          <Typography
                              variant="h2"
                              color="textPrimary"
                              gutterBottom
                              className="land-text"
                              id="title"
                          >
                              Craving Something? 
                          </Typography>
                          <Typography
                              variant="h2"
                              color="textPrimary"
                              gutterBottom
                              className="land-text"
                              id="text"
                          >
                              <Typical
                                  loop={1}
                                  wrapper="b"
                                  steps={['Good food shouldn\'t cost a fortune.',3000, 'Delicious food that won\'t break the bank !', 3000]}
                              />
                              <br />
                              Try us and see
                              <span 
                                  role="img" 
                                  aria-label="eye"
                              > 
                                  👀
                              </span>
                          </Typography>
                          <form>
                              <button 
                                  className="button-order"  
                                  role="button" 
                                  onClick={handleLogin}
                              >
                                  Let's Order !
                              </button>
                          </form>
                      </Box>
                  </Container>
              </div>
          )}
      </div>
  );
}