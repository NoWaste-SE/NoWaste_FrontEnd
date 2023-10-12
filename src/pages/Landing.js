import { Box, Button, Container, createTheme, FormControlLabel, Grid, Icon, InputAdornment, TextField, ThemeProvider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
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
    <div  className="loading">
            {loading ? (
                <PulseLoader
                type="bars"
                color='black'
                speedMultiplier={"1"}
                className="spinner"/>
            ) : (
                <div className="landback">
                <nav className="navbar">
                    <form>
                    <button className="buttonland" role="button" onClick={handleLogin}>Log in</button>
                    <button className="buttonland signup" role="button" onClick={handleSignup}>Sign up</button>
                    </form>
                </nav>
        
                <Container className="container">
                <Box className="landbox">
                    <Typography
                    variant="h2"
                    color="textPrimary"
                    gutterBottom
                    className="landtext"
                    style={{fontSize: '50px', color: 'black'}}
                    >
                    Craving Something? 
                    </Typography>
                    <Typography
                    variant="h2"
                    color="textPrimary"
                    gutterBottom
                    className="landtext"
                    style={{ fontSize: '20px', color: 'black'}}
                    >
                    <Typical
                        loop={1}
                        wrapper="b"
                        steps={['Good food shouldn\'t cost a fortune.',3000, 'Delicious food that won\'t break the bank !', 3000]}
                    />
                    <br />
                    Try us and see
                    <span role="img" aria-label="eye"> 👀</span>
                    </Typography>
                    <form>
                    <button className="button-order" role="button" onClick={handleLogin}>
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