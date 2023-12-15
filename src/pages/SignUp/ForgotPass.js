import { Box, Button, Container, createTheme, Icon, IconButton, InputAdornment, TextField, ThemeProvider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import SyncLockIcon from '@mui/icons-material/SyncLock';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import './Login-Signup.css'
import { Alert } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CancelButton } from "../../components/CustomButtons/CustomButtons";

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

export default function ForgotPass(){
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [token, setToken] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validInputs, setValidInputs] = useState(false);
    const [open, setOpen] = useState(null);
    const [alertSeverity, setAlertSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [openNetwork, setOpenNetwork] = useState(null);
    const history = useHistory();
    
    const handleEmail = (e) => {
        setEmail(e.target.value);
        if(!/\S+@\S+\.\S+/.test(e.target.value) || e.target.value.trim().length === 0)   {
            setEmailError(true);
        } else {
            setEmailError(false);
        }
    };

    const handleNewPassword = (e) => {
        setNewPassword(e.target.value);
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
        
    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseNetwork = () => {
        setOpenNetwork(false);
        setHeight();
    };

    useEffect(() => {
        setHeight();
    }, [open]);

    useEffect(() => {
        setHeight();
    }, [openNetwork]);

    useEffect(() => {
        let isValid = email.trim().length > 0 && !emailError && newPassword.trim().length >0;
        setValidInputs(isValid);
    }, [email, newPassword]);
    
    function setHeight() {        
        const box = document.querySelector('.box');
        const boxHeight = box.offsetHeight;
        
        const image = document.querySelector('.background');
        image.style.height = `${boxHeight}px`;
    }

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

    useEffect(() => {
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('email', JSON.stringify(email));
    }, [token, email]);
    
    useEffect(() => {
        if(alertMessage !== "" && alertSeverity !== ""){
            if(alertSeverity === "success"){
                toast.success(alertMessage, {
                                position: toast.POSITION.TOP_CENTER,
                                title: "Success",
                                autoClose: 7000,
                                pauseOnHover: true
                            });
            } else {
                toast.error(alertMessage, {
                                position: toast.POSITION.TOP_CENTER,
                                title: "Error",
                                autoClose: 3000,
                                pauseOnHover: true
                            });
            };
            setAlertMessage("");
            setAlertSeverity("");
        }
    }, [alertMessage, alertSeverity]);
        
    const handleClick = (e) => {
        e.preventDefault();
        const userData = {
            email: email
        };
        axios.post("http://188.121.124.63/user/forgot-password/", 
            userData, 
            {headers:{"Content-Type" : "application/json"}}
        )
        .then(() => {
            setAlertMessage("We've just sent you an email including your new password. Enter your new password to continue.");
            setAlertSeverity("success");
        })
        .catch((error) => {
            setAlertMessage("An error occured. Please try agian later.");
            setAlertSeverity("error");
            if (error.response) {
                setOpen(true);
            } 
            else if (error.request) {
                setOpenNetwork(true);
            } 
            else {
                console.log(error);
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            code: newPassword,
            email: email
        };
        axios.post("http://188.121.124.63/user/fp-verify/", 
            userData, 
            {headers:{"Content-Type" : "application/json"}}
        )
        .then((response) => {
            setToken(response.data.token);
            history.push('./new-password')
        })
        .catch((error) => {
            if (error.response) {
                setOpen(true);
            } 
            else if (error.request) {
                setOpenNetwork(true);
            } 
        });    
    };

    return ( 
        <ThemeProvider theme={theme}>
            <div className="root">
                <Container className="container">
                    <div >
                        <ToastContainer />
                    </div>
                    <img
                        className="background"
                        src="/Reset-Pass.jpg"
                        alt="NoWaste"
                    />
                    <Box className="box">
                        <Typography 
                            variant="h5" 
                            color="textPrimary"
                            gutterBottom
                            className="text"
                            id="forgotpassword"
                        >
                            Forgot Your Password?
                        </Typography>
                        <form 
                            noValidate 
                            className="form"
                        >
                            {open && 
                                <Alert 
                                    className="alert-error" 
                                    variant="outlined"
                                    severity="error" 
                                    open={open} 
                                    onClose={handleClose} 
                                >
                                    Incorrect code!
                                </Alert>
                            }
                            {openNetwork && 
                                <Alert 
                                    className="alert-error" 
                                    variant="outlined" 
                                    severity="error" 
                                    open={openNetwork} 
                                    onClose={handleCloseNetwork} 
                                >
                                    Network error!
                                </Alert>
                            } 
                            <TextField 
                                label="Email address"
                                variant="outlined"
                                color="secondary"
                                required
                                className="field"
                                value={email}
                                onChange={handleEmail}
                                error={emailError}
                                helperText={ 
                                    <div 
                                        className="error" 
                                        id="forget"
                                    >
                                        {emailError && "Email is invalid!"}
                                    </div>
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position="start"
                                        >
                                            <Icon>
                                                <EmailIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment 
                                            position="end"
                                        >
                                            <IconButton 
                                                onClick={handleClick} 
                                                disabled={emailError || email.length ===0}
                                            >
                                                <SendIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField 
                                label="Code"
                                variant="outlined"
                                color="secondary"
                                required
                                className="field"
                                value={newPassword}
                                onChange={handleNewPassword}
                                type= {showPassword ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment 
                                            position="start"
                                        >
                                            <Icon>
                                                <SyncLockIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment 
                                            position="end"
                                        >
                                            <IconButton 
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <CancelButton
                                variant={"contained"}
                                type={"submit"}
                                disabled={!validInputs}
                                onClick={handleSubmit}
                                title={"Continue"}
                                customWidth={"70%"}
                            />
                            {/* <Button 
                                variant="contained" 
                                type="submit" 
                                color="primary"
                                className="field"
                                id="submit"
                                onClick={handleSubmit}
                                disabled={!validInputs}
                            >
                                Continue
                            </Button> */}
                        </form> 
                        <Typography 
                            className="already"
                        >
                            <Link 
                                to="/login" 
                                className="link"
                            >
                                Back to login
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    )
};