import { Box, Button, Container, createTheme, Icon, InputAdornment, TextField, ThemeProvider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CodeIcon from '@mui/icons-material/Code';
import './Login-Signup.css'
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
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
})

export default function Verification(){

    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState(false);
    const [email, setEmail] = useState([]);
    const [validInputs, setValidInputs] = useState(false);
    const [open, setOpen] = useState(null);
    const [openNetwork, setOpenNetwork] = useState(null);


    const handleCode = (e) => {
        setCode(e.target.value);
        if(!/^\d{6}$/.test(e.target.value)){
            setCodeError(true);
        } else {
            setCodeError(false);
        }
    }

    useEffect(() => {
        let isValid = !codeError;
        setValidInputs(isValid);
    }, [code]);

    function setHeight() {
        const box = document.querySelector('.box');
        const boxHeight = box.offsetHeight;
        const image = document.querySelector('.background');
        image.style.height = `${boxHeight}px`;
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseNetwork = () => {
        setOpenNetwork(false);
        setHeight();
    }

    useEffect(() => {
        setHeight();
    }, [open]);

    useEffect(() => {
        setHeight();
    }, [openNetwork]);

    const history = useHistory();

    useEffect(() => {
        const email = JSON.parse(localStorage.getItem('email'));
        if (email) {
            setEmail(email);
            console.log(email);
        }
    }, []);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            code: code,
            email: email,
            name: JSON.parse(localStorage.getItem("fullname")),
            role: JSON.parse(localStorage.getItem("role")),
            password: JSON.parse(localStorage.getItem("password"))
        };
        axios.post("http://188.121.124.63/user/verify-email/", userData, {headers:{"Content-Type" : "application/json"}})
        .then((response) => {
            console.log(response);
            history.push("/homepage-customer");
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
                console.log("server responded");
                setOpen(true);
                console.log(error);
            } 
            else if (error.request) {
                setOpenNetwork(true);
                console.log("network error");
                console.log(error);
            } 
            // else {
            //     setOpen(true);
            //     console.log(error);
            // }
        });
    };

    return ( 
        <ThemeProvider theme={theme}>
            <div className="root">
                <Container className="container">
                    <img
                        className="background"
                        src="/f2.jpg"
                        alt="NoWaste"
                    />
                    <Box className="box">
                        <Typography variant="h5" 
                            color="textPrimary"
                            gutterBottom
                            className="text"
                            style={{fontWeight: 'bold', fontSize: '30px'}}
                        >
                            Verification
                        </Typography>
                        <Typography 
                            className="verification"
                        >
                            Enter the verification code we just sent you on your email address.
                        </Typography>
                        <form noValidate autoComplete="off" style={{textAlign: 'center'}}>
                            {open && <Alert severity="error" open={open} onClose={handleClose} className="alert-error" variant="outlined">
                                    Incorrect code!
                                </Alert>
                            }
                            {openNetwork && <Alert severity="error" open={openNetwork} onClose={handleCloseNetwork} variant="outlined" className="alert-error filed">
                                    Network error!
                                </Alert>
                            } 
                            <TextField 
                                label="Code"
                                variant="outlined"
                                color="secondary"
                                required
                                className="field"
                                value={code}
                                onChange={handleCode}
                                error={codeError}
                                helperText={ 
                                    <div className="error" id="verify">
                                        {codeError && "Code must have 6 numbers."}
                                    </div>
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon>
                                                <CodeIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <Button 
                                variant="contained" 
                                type="submit" 
                                color="primary"
                                className="field"
                                id="submit"
                                disabled={!validInputs}
                                onClick={handleSubmit}
                                style={{ marginTop: '-5px'}}
                            >
                                Verify code
                            </Button>
                        </form> 
                        <Typography 
                            style={{fontSize: '1em'}}
                            className="text"
                        >
                        {/* <Link to="/" className="link-pass">Resend code?</Link> */}
                        </Typography>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    )
}