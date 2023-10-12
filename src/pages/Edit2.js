import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, createTheme, FormControl, Grid, Icon, IconButton, InputAdornment, MenuItem, TextField, ThemeProvider, Typography, withStyles } from "@material-ui/core";
import './EditProfile.css';
import Header from '../components/Header';
import './Login-Signup.css';
import './Restaurant-View.css';
// import PhoneInput from 'react-phone-input-2';
import PhoneInput from 'material-ui-phone-number';
import 'react-phone-input-2/lib/style.css';
import { DatePicker } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import AdapterDayjs from '@date-io/dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from "axios";
import { useHistory } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Visibility, VisibilityOff } from "@material-ui/icons";

const styles = theme => ({
    field: {
      margin: '10px 0',
      width : "100px",
    },
    countryList: {
      ...theme.typography.body1,
      width : "100px",
    },
  });
const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46',
        },
        secondary: {
            main: '#a44704',
        }
    },
    // overrides: {
    //     MuiFormLabel: {
    //         asterisk: {
    //             color: '#db3131',
    //             '&$error': {
    //             color: '#db3131'
    //             }
    //         }
    //     }
    // }
})
function getRandomColor() {
    const colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#00BCD4', '#009688', '#4CAF50', '#FFC107', '#FF5722'];
    return colors[Math.floor(Math.random() * colors.length)];
}
function Edit(props){
    const { value, defaultCountry, onChange, classes } = props;
    const [fullname, setFullname] = useState('');
    const [fullnameError, setFullnameError] = useState(false);
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState('');
    // const [emailError, setEmailError] = useState(false);
    const [color, setColor] = useState(localStorage.getItem('avatarColor') || getRandomColor());
    const [update, setUpdate] = useState('');
    const [phone, setPhone] = useState('');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const [data, setData] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [show, setShow] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    
    const handleFullname = (e) => {
        setFullname(e.target.value);
        setUpdate({...update, name: e.target.value})
        if(!/^[a-zA-Z]+\s[a-zA-Z]+$/gm.test(e.target.value)){
            setFullnameError(true);
        } else {
            setFullnameError(false);
        }
    };
    // const handleEmail = (e) => {
    //     // setData({...data, email: e.target.value})
    //     if(!/[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(e.target.value)) {
    //         setEmailError(true);
    //     } else{
    //         setEmailError(false);
    //     }
    // }
    useEffect(() => {
        if(!localStorage.getItem('avatarColor')) {
            localStorage.setItem('avatarColor', color);
        }
    }, [])

    const handlePhoneChange = (value) => {
        setUpdate({...update, phone_number : value});
        localStorage.setItem('phone', value);
        setPhone(value);
    };
    const handleBirthdate = (date) => {
        setDob(date);
        console.log(data.date_of_birth);
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setUpdate({...update, date_of_birth : formattedDate});
    }
    const handleGender = (e) => {
        setGender(e.target.value);
        setUpdate({...update, gender: e.target.value});
    }
    const handleCity = (e) => {
        setCity(e.target.value);
    }
    const handleCountry = (e) => {
        setCountry(e.target.value);
    }
    const handleAddress = (e) => {
        setAddress(e.target.value);
    }
    useEffect(() => {
        const temp = country + '$' + city + '$' + address;
        setUpdate({...update, address : temp})
    }, [country, city, address])

    useEffect(() =>{
        axios.get(
            `http://nowaste39.pythonanywhere.com/user/customer_profile/${id}/` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            console.log(response);
            setData(response.data)
        })
        .catch((error) => console.log(error));
    },[]);
    
    useEffect(() => {
        setFullname(data.name);
    }, [data.name]);

    useEffect(() => {
        setGender(data.gender);
    }, [data.gender]);

    useEffect(() => {
        setDob(data.date_of_birth);
    }, [data.date_of_birth]);

    useEffect(() => {
        const arr = data?.address?data?.address.split("$"):"";
        setCountry(arr[0])
        setCity(arr[1]);
        setAddress(arr[2]);
    }, [data.address]);

    const history = useHistory();
    const handleChange = () => {
        history.push('./change-password')
    };
    const handleClickShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
    const handleMouseDownCurrentPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownNewPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownConfirmPassword = (event) => {
        event.preventDefault();
    };

    const firstChar = data?.name?data.name.charAt(0) : "UN";

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.patch(
            `http://nowaste39.pythonanywhere.com/user/customer_profile/${id}/`, update,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response)=> {
            console.log(response);
            console.log("succesfully updated");
        })
        .catch((error) => console.log(error));

    }

    return(
        <ThemeProvider theme={theme}>
            <Header/>
            <div className="edit-root">
                <Box className='edit-box'>
                    <Typography
                        variant='h4'
                        color="textPrimary"
                        gutterBottom
                        className='text'
                    >
                        Profile
                    </Typography>
                    <Avatar
                        className="edit-avatar"
                        style={{backgroundColor: color}}
                        src="public/3.jpg"
                        sx={{width:'15rem', height:'12rem'}}
                    >
                        {firstChar}
                    </Avatar>
                    <FormControl className="edit-field">
                        <TextField
                            label="Full name"
                            variant="outlined"
                            color="secondary"
                            value={fullname}
                            onChange={handleFullname}
                            error={fullnameError}
                            helperText={
                                <div className="edit-error">
                                    {fullnameError && 'Your full name should have at least two words.'}
                                </div>
                            }
                        />
                    </FormControl>
                    <FormControl className="edit-field">
                        <TextField
                            label="Email address"
                            variant="outlined"
                            color="secondary"
                            value={data.email}
                            InputLabelProps={{ shrink: true }}  
                            // disabled                          
                            InputProps={{
                                readOnly: true
                            }}
                        />
                    </FormControl>
                    <FormControl className="edit-field">
                        <PhoneInput
                            label="Phone number"
                            value={data.phone_number}
                            defaultCountry="ir"
                            color="secondary"
                            onChange={handlePhoneChange}
                            inputClass={classes.field}
                            style={{width: '100%'}}
                            variant="outlined"
                            InputLabelProps={{ shrink: true, color: "error"}}
                        />
                    </FormControl>
                    <FormControl className="edit-field">
                        <TextField
                            select
                            label="Gender"
                            color="secondary"
                            variant="outlined"
                            value={gender}
                            InputLabelProps={{ shrink: true }}
                            style= {{textAlign: 'left', width:'100%'}}
                            onChange={handleGender}
                        >
                            <MenuItem value="select" disabled>
                                <em>Select gender</em>
                            </MenuItem>
                            <MenuItem value="male">
                                Male
                            </MenuItem>
                            <MenuItem value="female">
                                Female
                            </MenuItem>
                        </TextField>
                    </FormControl>
                    <FormControl className="edit-field">
                        <LocalizationProvider dateAdapter={AdapterDayjs} style={{width: '150%'}} InputLabelProps={{ shrink: true }}>
                            <DemoContainer components={['DatePicker']} >
                                <DatePicker
                                    label="Date of birth"
                                    views={['year', 'month', 'day']}
                                    sx={{width: '100%'}}
                                    maxDate={dayjs()}
                                    onChange={handleBirthdate}
                                    // value={dayjs(dob)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </FormControl>
                    <FormControl className="edit-field">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    label="Country"
                                    variant="outlined"
                                    color="secondary"
                                    value={country}
                                    onChange={handleCountry}
                                /> 
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <TextField
                                    label="City"
                                    variant="outlined"
                                    color="secondary"
                                    value={city}
                                    onChange={handleCity}
                                /> 
                            </Grid>
                        </Grid>
                    </FormControl>
                    <FormControl className="edit-field">
                        <TextField
                            label="Address"
                            variant="outlined"
                            color="secondary"
                            multiline
                            value={address}
                            onChange={handleAddress}
                        /> 
                    </FormControl>
                    <Grid container style={{
                        marginBottom: "10px",
                        justifyContent: "center",
                        marginLeft: "85px",
                    }} spacing={2}>
                        <Grid item>
                            <Button variant="contained" onClick={() => setShow(prev => !prev)}>Change Password </Button>
                            {show && <div >
                                <FormControl className="edit-field">
                                <TextField
                                    label="Current Passsword"
                                    variant="outlined"
                                    color="secondary"
                                    // onClick={handleCurrentPassword}
                                    type= {showCurrentPassword ? 'text' : 'password'}
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
                                                    onClick={handleClickShowCurrentPassword}
                                                    onMouseDown={handleMouseDownCurrentPassword}
                                                >
                                                    {showCurrentPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}

                                />
                            </FormControl>
                            <FormControl className="edit-field">
                                <TextField
                                    label="New Password"
                                    variant="outlined"
                                    color="secondary"
                                    // onChange={handleChangePassword}
                                    // error={passwordError}
                                    // helperText={
                                    //     <div className="error">
                                    //         {passwordError && 'Password must be mixture of letters and numbers.'}
                                    //     </div>
                                    // }
                                    type= {showNewPassword ? 'text' : 'password'}
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
                                                    onClick={handleClickShowNewPassword}
                                                    onMouseDown={handleMouseDownNewPassword}
                                                >
                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            </FormControl>
                            <FormControl className="edit-field">
                                <TextField
                                    label="Confirm New Password"
                                    // onChange={handleChangeConfirmPass}
                                    variant="outlined"
                                    // error={passwordMatch === false}
                                    // helperText={
                                    //     <div className="error">
                                    //         {!passwordMatch && 'Password do not match!'}
                                    //     </div>
                                    // }
                                    type= {showConfirmPassword ? 'text' : 'password'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Icon>
                                                    <LockOpenIcon />
                                                </Icon> 
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton 
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowConfirmPassword}
                                                    onMouseDown={handleMouseDownConfirmPassword}
                                                >
                                                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}

                                />
                            </FormControl>
                            </div>
                            }
                        </Grid>
                        <Grid item>
                            <Button variant="contained" onClick={handleUpdate}>Update</Button>
                        </Grid>
                    </Grid>
                </Box>

            </div>
        </ThemeProvider>

    )
}

export default withStyles(styles)(Edit);