import { Box, Button, Container, createTheme, Icon, InputAdornment, TextField, ThemeProvider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import CodeIcon from '@mui/icons-material/Code';
import './Login-Signup.css'
import axios from "axios";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Alert } from "@mui/material";
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
})

export default function Verification(){
    const [code, setCode] = useState('');
    const [codeError, setCodeError] = useState(false);
    const [token, setToken] = useState('');
    const [refresh_token, setRefresh_token] = useState('');
    const [id, setId] = useState('');
    const [role, setRole] = useState('');
    const [list_of_favorites_res, setList_of_favorites_res] = useState('');
    const [email, setEmail] = useState([]);
    const [validInputs, setValidInputs] = useState(false);
    const [open, setOpen] = useState(null);
    const [openNetwork, setOpenNetwork] = useState(null);
    const history = useHistory();

    const handleCode = (e) => {
        setCode(e.target.value);
        if(!/^\d{6}$/.test(e.target.value)){
            setCodeError(true);
        } else {
            setCodeError(false);
        }
    };

    useEffect(() => {
        let isValid = !codeError;
        setValidInputs(isValid);
    }, [code]);

    useEffect(() => {
        localStorage.setItem('id', JSON.stringify(id));
        localStorage.setItem('token', JSON.stringify(token));
        localStorage.setItem('refresh_token', JSON.stringify(refresh_token));
        localStorage.setItem('list_of_favorites_res', JSON.stringify(list_of_favorites_res));
        // localStorage.setItem('role', JSON.stringify(role));
    }, [id, token, refresh_token, list_of_favorites_res, role]);
    

    function setHeight() {
        const box = document.querySelector('.box');
        const boxHeight = box.offsetHeight;
        const image = document.querySelector('.background');
        image.style.height = `${boxHeight}px`;
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
        const email = JSON.parse(localStorage.getItem('email'));
        if (email) {
            setEmail(email);
            console.log(email);
        };

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
            name: JSON.parse(localStorage.getItem("fullname")),
            password: JSON.parse(localStorage.getItem("password")),
            email: email,
            role: JSON.parse(localStorage.getItem("role")),
            code: code
        };
        console.log(userData);
        axios.post("http://188.121.124.63:8000/user/verify-email/", 
                    userData, 
                    {headers:{"Content-Type" : "application/json"}}
        )
        .then((response) => {
            setToken(response.data.access_token);
            setRefresh_token(response.data.refresh_token);
            setId(response.data.id);
            setList_of_favorites_res(response.data.list_of_favorites_res);
            setRole(response.data.role);
            if (response.data.role === "customer")
                history.push("/homepage-customer");
            else
                history.push("/homepage-restaurant");
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
                    <img
                        className="background"
                        src="/Verification.jpg"
                        alt="NoWaste"
                    />
                    <Box className="box">
                        <Typography variant="h5" 
                            color="textPrimary"
                            gutterBottom
                            className="text"
                            id="verification"
                        >
                            Verification
                        </Typography>
                        <Typography 
                            className="verification-detail"
                        >
                            Enter the verification code we just sent you on your email address.
                        </Typography>
                        <form 
                            noValidate 
                            className="form"
                        >
                            {open && 
                                <Alert 
                                    severity="error" 
                                    open={open} 
                                    onClose={handleClose} 
                                    className="alert-error" 
                                    variant="outlined"
                                >
                                    Incorrect code!
                                </Alert>
                            }
                            {openNetwork && 
                                <Alert 
                                    severity="error" 
                                    open={openNetwork} 
                                    onClose={handleCloseNetwork} 
                                    className="alert-error"
                                    variant="outlined" 
                                >
                                    Network error!
                                </Alert>
                            } 
                            <TextField 
                                label="Code"
                                variant="outlined"
                                color="secondary"
                                required
                                placeholder="Code"
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
                            <CancelButton
                                variant={"contained"}
                                type={"submit"}
                                disabled={!validInputs}
                                onClick={handleSubmit}
                                title={"Verify code"}
                                customWidth={"70%"}
                            />
                            {/* <Button 
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
                            </Button> */}
                        </form>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    )
}