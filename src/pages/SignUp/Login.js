import { Box, Container, createTheme, Icon, IconButton, InputAdornment, TextField, ThemeProvider, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material"
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import { Link, useHistory } from "react-router-dom";
import './Login-Signup.css'
import { Alert } from "@mui/material";
import AuthContext from "../../Context/AuthContext";
import { CancelButton } from "../../components/CustomButtons/CustomButtons";

const theme = createTheme({
    palette: {
        primary: {
            main: '#E74C3c',
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

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const [refresh_token, setRefresh_token] = useState('');
    const [id, setId] = useState('');
    const [wallet_balance, setWallet_balance] = useState('');
    const [role, setRole] = useState('');
    const [list_of_favorites_res, setList_of_favorites_res] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validInputs, setValidInputs] = useState(false);
    const [open, setOpen] = useState(null);
    const [openNetwork, setOpenNetwork] = useState(null);
    const history = useHistory();
    const [adminLogin, setAdminLogin] = useState(false);
    const {user,authTokens,loginUser} = useContext(AuthContext);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    useEffect(() => {
        let isValid = email.trim().length > 0 && password.trim().length > 0;
        setValidInputs(isValid);
    }, [email, password]);

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
        localStorage.setItem('token', JSON.stringify(token));
    }, [token]);

    useEffect(() => {
        localStorage.setItem('refresh_token', JSON.stringify(refresh_token));
    }, [refresh_token]);

    useEffect(() => {
        localStorage.setItem('email', JSON.stringify(email));
    }, [email]);

    useEffect(() => {
        localStorage.setItem('id', JSON.stringify(id));
    }, [id]);

    useEffect(() => {
        localStorage.setItem('wallet_balance', JSON.stringify(wallet_balance));
    }, [wallet_balance]);

    useEffect(() => {
        localStorage.setItem('role', JSON.stringify(role));
    }, [role]);

    useEffect(() => {
        localStorage.setItem('list_of_favorites_res', JSON.stringify(list_of_favorites_res));
    }, [list_of_favorites_res]);

    const handleClose = () => {
        setHeight();
    };

    const handleCloseNetwork = () => {
        setOpenNetwork(false);
        setHeight();
    };

    useEffect(() => {
        setHeight();
    }, [adminLogin]);

    useEffect(() => {
        setHeight();
    }, [open]);

    useEffect(() => {
        setHeight();
    }, [openNetwork]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            password: password,
            email: email
        };
        loginUser(userData)
        .then((response) => {
            setToken(response.access_token);
            setRefresh_token(response.refresh_token);
            setId(response.id);
            setWallet_balance(response.wallet_balance);
            setRole(response.role);
            setList_of_favorites_res(response.list_of_favorites_res);
            if (response.role === "customer")
                history.push("/homepage-customer");
            else if (response.role === "admin")
                history.push("/admin");
            else
                history.push("/homepage-restaurant");
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
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
                <Container className={`container ${adminLogin ? 'admin-login' : ''}`}>
                    <img
                        className="background"
                        src="/Signup-Login.jpg"
                        alt="NoWaste"
                        borderRadius="25px"
                    />
                    <Box className="box">
                        <Typography variant="h5" 
                            color="textPrimary"
                            gutterBottom
                            className="text"
                            id="login"
                        >
                            {adminLogin ? 'Admin Login' : 'Login'}
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
                                    Incorrect email address or password!
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
                                label="Email address"
                                variant="outlined"
                                color="secondary"
                                required
                                className="field"
                                value={email}
                                onChange={handleEmail}
                                style={{marginBottom: '10%'}}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon>
                                                <EmailIcon />
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
                                value={password}
                                onChange={handlePassword}
                                type= {showPassword ? 'text' : 'password'}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Icon>
                                                <LockIcon />
                                            </Icon> 
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
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
                            <Link to="/forgot-password" >
                                <Typography className="forgetpassword" >
                                    Forgot password?
                                </Typography>
                            </Link>
                            <CancelButton
                                variant={"contained"}
                                type={"submit"}
                                disabled={!validInputs}
                                onClick={handleSubmit}
                                title={"Login"}
                                customWidth={"70%"}
                            />
                        </form> 
                        {!adminLogin? (
                            <>
                                <Typography 
                                    className="already"
                                >
                                    Don't have an account?&nbsp;
                                    <Link to="/sign-up" 
                                        className="link"
                                    >
                                        Sign up
                                    </Link>
                                </Typography>
                                <Typography 
                                    className="are-you-admin-text"
                                    onClick={() => setAdminLogin(!adminLogin)}
                                >
                                    Are you admin?
                                </Typography>
                            </>
                        ) : (
                            <Typography 
                                className="are-you-admin-text"
                                onClick={() => setAdminLogin(!adminLogin)}
                            >
                                Login as user
                            </Typography>
                        )}
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    )
}