import { Box, Button, Container, createTheme, Icon, InputAdornment, TextField, ThemeProvider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {useHistory } from "react-router-dom";
import './Login-Signup.css'
import axios from "axios";
import { Alert } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46',
        },
        secondary: {
            main: '#a44704',
        }
    },
    overrides: {
        MuiFormLabel: {
            asterisk: {
                color: '#db3131',
                '&$error': {
                color: '#db3131'
                }
            }
        }
    }
});

export default function NewPassword(){
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [validInputs, setValidInputs] = useState(false);
    const [openNetwork, setOpenNetwork] = useState(null);
    const history = useHistory();

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
        if(e.target.value.length < 8 || !/[a-zA-Z]+/.test(e.target.value)){
            setPasswordError(true)
        } else {
            setPasswordError(false)
        }
    };

    const handleChangeConfirmPass = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
    };
    
    const handleCloseNetwork = () => {
        setOpenNetwork(false);
        setHeight();
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            password: password,
            email: JSON.parse(localStorage.getItem('email'))
        };

        axios.post("http://188.121.124.63/user/fp-newpassword/", 
                    userData, 
                    {headers:{"Content-Type" : "application/json"}}
        )
        .then(() => {
            history.push('./login')
        })
        .catch((error) => {
            if (error.request) {
                setOpenNetwork(true);
            } 
            else {
                console.log(error);
            }
        });   
    };

    useEffect(() => {
        setPasswordMatch(password === confirmPassword);
    }, [confirmPassword]);

    useEffect(() => {
        setHeight();
    }, [openNetwork]);

    useEffect(() => {
        let isValid = !passwordError && passwordMatch && password.trim().length > 0 && confirmPassword.trim().length > 0;
        setValidInputs(isValid);
    }, [passwordError, passwordMatch, password, confirmPassword]);

    function setHeight() {        
        const box = document.querySelector('.box');
        const boxHeight = box.offsetHeight;
        
        const image = document.querySelector('.background');
        image.style.height = `${boxHeight}px`;
    };

    useEffect(() => {
        setHeight(); 
        window.addEventListener('resize', setHeight);
        window.onpopstate = () => {
          setHeight();
        };
        return () => {
          window.removeEventListener('resize', setHeight);
          window.onpopstate = null;
        };
    }, []);

    return ( 
        <ThemeProvider theme={theme}>
            <div className="root">
                <Container className="container">
                    <img
                        className="background"
                        src="/Reset-Pass.jpg"
                        alt="NoWaste"
                    />
                    <Box 
                        className="box"
                    >
                        <Typography 
                            variant="h5" 
                            color="textPrimary"
                            gutterBottom
                            className="text"
                            id="reset-pass"
                        >
                            Reset your password
                        </Typography>
                        <form 
                            noValidate 
                            autoComplete="off" 
                            className="form"
                        >
                            {openNetwork && 
                                <Alert 
                                    severity="error" 
                                    open={openNetwork} 
                                    onClose={handleCloseNetwork} 
                                    variant="outlined" 
                                    className="alert-error"
                                >
                                    Network error!
                                </Alert>
                            } 
                            <TextField 
                                    label="New password"
                                    variant="outlined"
                                    color="secondary"
                                    required
                                    className="field"
                                    name="password"
                                    onChange={handleChangePassword}
                                    error={passwordError}
                                    helperText={
                                        <div className="error">
                                            {passwordError && 'Password must be mixture of letters and numbers.'}
                                        </div>
                                    }
                                    type= {showPassword ? 'text' : 'password'}
                                        InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Icon>
                                                    <LockIcon />
                                                </Icon> 
                                            </InputAdornment>
                                        ),
                                    }}
                            />
                            <TextField 
                                label="Confirm new password"
                                variant="outlined"
                                color="secondary"
                                required
                                className="field"
                                name="confirmPassword"
                                onChange={handleChangeConfirmPass}
                                error={passwordMatch === false}
                                helperText={
                                    <div className="error">
                                        {!passwordMatch && 'Password do not match!'}
                                    </div>
                                }
                                type= {showPassword ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon>
                                                <LockOpenIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <Button 
                                variant="contained"
                                type="submit"
                                required
                                className="field"
                                id="submit"
                                disabled={!validInputs}
                                onClick={handleSubmit}
                            >
                                Save
                            </Button>
                        </form>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    )
}