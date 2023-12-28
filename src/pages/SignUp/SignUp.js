import { Box, Container, createTheme, FormControlLabel, Icon, InputAdornment, TextField, ThemeProvider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useHistory } from "react-router-dom";
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import './Login-Signup.css';
import axios from "axios";
import Checkbox from '@mui/material/Checkbox';
import { Alert} from "@mui/material";
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
                },
            }
        }
    }
});

export default function SignUp(){
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('customer');
    const [email, setEmail] = useState('');
    const [balance, setBalance] = useState(0);
    const [emailError, setEmailError] = useState(false);
    const [fullname, setFullname] = useState("");
    const [fullnameError, setFullnameError] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [validInputs, setValidInputs] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(null);
    const [openNetwork, setOpenNetwork] = useState(null);
    const [id, setId] = useState('');

    useEffect(() => {
      window.addEventListener("load", () => {
        setLoading(false);
      })
    }, []);  

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if(!/[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(e.target.value)) {
            setEmailError(true);
        } else{
            setEmailError(false);
        }
    };
    
    const handleFullname = (e) => {
        setFullname(e.target.value);
        if(!/^[a-zA-Z]+\s[a-zA-Z]+$/gm.test(e.target.value)){
            setFullnameError(true);
        } else {
            setFullnameError(false);
        }
    };

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

    const handleClose = () => {
        setOpen(false);
        setHeight();
    };
    
    const handleCloseNetwork = () => {
        setOpenNetwork(false);
        setHeight();
    };

    useEffect(() => {
        setPasswordMatch(password === confirmPassword);
    }, [confirmPassword]);

    useEffect(() => {
        if(confirmPassword.length > 0){
            setPasswordMatch(password === confirmPassword);
        }
    }, [password]);

    useEffect(() => {
        let isValid = !fullnameError && !emailError && !passwordError && passwordMatch 
                        && password.trim().length > 0 && confirmPassword.trim().length > 0;
        setValidInputs(isValid);
    }, [fullnameError, emailError, passwordError, passwordMatch, password, confirmPassword]);

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

    useEffect(() => {
        setHeight();
    }, [open]);

    useEffect(() => {
        setHeight();
    }, [openNetwork]);
    
    const history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            name: fullname,
            email: email
        };
        axios.post("http://188.121.124.63:8000/user/signup/", 
                    userData, 
                    {headers:{"Content-Type" : "application/json"}}
        )
        .then(() => {
            history.push("/verification");
        })
        .catch((error) => {
            if (error.response) {
                setOpen(true);
            } 
            else if (error.request) {
                setOpenNetwork(true);
            } 
            else {
                setOpen(true);
            }
        });
    };

    useEffect(() => {
        localStorage.setItem('email', JSON.stringify(email));
        localStorage.setItem('role', JSON.stringify(role));
        localStorage.setItem('password', JSON.stringify(password));
        localStorage.setItem('fullname', JSON.stringify(fullname));
        localStorage.setItem('wallet_balance', JSON.stringify(balance));
        localStorage.setItem('id', JSON.stringify(id));
    }, [email, role, password, fullname, balance,id]);

    return ( 
        <ThemeProvider theme={theme}>
            <div className="root">
                <Container className="container">
                    <img
                        className="background"
                        src="/Signup-Login.jpg"
                        alt="NoWaste"
                    />
                    <Box className="box">
                        <Typography variant="h5" 
                            color="textPrimary"
                            gutterBottom
                            className="text"
                            id="signup"
                        >
                            Sign Up 
                        </Typography>
                        <form 
                            noValidate 
                            autoComplete="off" 
                            className="form"
                        >
                            {open && 
                                <Alert 
                                    severity="error" 
                                    open={open} 
                                    onClose={handleClose} 
                                    variant="outlined" 
                                    className="alert-error"
                                >
                                    Email is invalid or already taken!
                                </Alert>
                            } 
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
                                className="field"
                                label="Full name"
                                variant="outlined"
                                color="secondary"
                                required
                                placeholder="Full name"
                                data-testid="full-name"
                                value={fullname}
                                onChange={handleFullname}
                                error={fullnameError}
                                helperText={
                                    <div className="error">
                                        {fullnameError && 'Your full name should have at least two words.'}
                                    </div>
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon>
                                                <PersonIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField 
                                className="field"
                                label="Email address"
                                variant="outlined"
                                color="secondary"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={handleEmailChange}
                                error={emailError}
                                helperText={
                                    <div className="error">
                                        {emailError && 'Invalid email Address!'}
                                    </div>
                                }
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon>
                                                <AlternateEmailIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField 
                                label="Password"
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
                                type= {'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon>
                                                <LockIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <TextField 
                                label="Confirm password"
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
                                                <LockIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    )
                                }}
                            />
                            <FormControlLabel 
                                className='checkbox' 
                                onClick={() => setRole("restaurant")} 
                                id="signupcheck"
                                control={<Checkbox 
                                            sx={{color: '#f18b72', '&.Mui-checked': {color: '#E74C3C'}}}
                                        />}
                                label={
                                    <Typography className="text" >
                                        Sign up as restaurant manager
                                    </Typography>
                                }   
                            />
                            <CancelButton
                                variant={"contained"}
                                type={"submit"}
                                disabled={!validInputs}
                                onClick={handleSubmit}
                                title={"Sign up"}
                                customWidth={"70%"}
                            />
                        </form> 
                        <Typography
                            className="already"
                        >
                            Already have an account?&nbsp;
                            <Link to="/login" 
                                className="link"
                            >
                                Log in
                            </Link>
                        </Typography>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>        
    )
}