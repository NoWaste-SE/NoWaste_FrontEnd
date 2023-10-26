import React, { useEffect, useState ,  useCallback} from "react";
import { Avatar, Box, Button, createTheme, Divider, FormControl, Grid, Icon, IconButton, InputAdornment, MenuItem, TextField, ThemeProvider, Typography, withStyles } from "@material-ui/core";
import './EditProfileManager.css';
import HeaderRestaurant from '../components/HeaderRestaurant';
import './Login-Signup.css';
import './Restaurant-View.css';
import PhoneInput from 'material-ui-phone-number';
import 'react-phone-input-2/lib/style.css';
import { DatePicker } from '@mui/x-date-pickers'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axios from "axios";
import { useHistory } from "react-router-dom";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Visibility, VisibilityOff } from "@material-ui/icons";
import Footer from "../components/Footer";
import { Alert, AlertTitle } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getCroppedImg from "../components/cropImage";
import Cropper from "react-easy-crop";
import Modal from '@mui/material/Modal';

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: "76%",
    width: "90%",
    bgcolor: "background.paper",
    border: "3px solid #fff",
    borderRadius: 1,
    boxShadow: 24,
};

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
    }
})
function getRandomColor() {
    const colors = ['#FFA600', '#fff2bf', '#ffe480', '#a2332a' , '#E74C3C' , '#690000' , '#595959', '#3e3e3e' , '#C6C6C6', '#ABABAB', '#B9B9B9'];
    return colors[Math.floor(Math.random() * colors.length)];
}

const EditProfileManager = () => {
    // const { value, defaultCountry, onChange, classes } = props;
    const [fullname, setFullname] = useState('');
    const [fullnameError, setFullnameError] = useState(false);
    const [gender, setGender] = useState('');
    const [dob, setDob] = useState(null);
    // const [emailError, setEmailError] = useState(false);
    const [color, setColor] = useState(localStorage.getItem('avatarColor') || getRandomColor());
    const [update, setUpdate] = useState('');
    const [phone, setPhone] = useState('');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const [data, setData] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [newPasswordMatch, setNewPasswordMatch] = useState(false);
    const [show, setShow] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [profileImg, setProfileImg] = useState('');
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const [open, setOpen] = useState(false);
    const [openNetwork, setOpenNetwork] = useState(false);
    const [openWrongPass, setOpenWrongPass] = useState(false);
    const [validInputs, setValidInputs] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');const [openImg, setOpenImg] = React.useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [img, setImg] = useState(undefined);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const showCroppedImage = useCallback(async () => {
        try {
          setOpenImg(false);
          const croppedImage = await getCroppedImg(
            URL.createObjectURL(img),
            croppedAreaPixels,
            0
        );
        setCroppedImage(croppedImage);
        setUpdate({...update, manager_image: croppedImage});
        console.log(croppedImage);
        } catch (e) {
          console.error(e);
        }
      }, [croppedAreaPixels]);
      const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      }, []);
    
      const onClose = useCallback(() => {
        setCroppedAreaPixels(null);
        setCroppedImage(null);
        setOpenImg(false);
        setImg(undefined);
        const photoInput = document.getElementById("photoInput");
        if (photoInput) {
            photoInput.value = null;
        }
      }, []);
    
      const handleCloseImg = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        onClose();
      };



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
    const handlePassword = (e) => {
        setPassword(e.target.value);
    };
    const handlenewPassword = (e) => {
        setNewPassword(e.target.value);
        if(e.target.value.length < 8 || !/[a-zA-Z]+/.test(e.target.value)){
            setNewPasswordError(true);
        } else {
            setNewPasswordError(false);
        }
    };
    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };
    useEffect(() => {
        setNewPasswordMatch(newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    useEffect(() =>{
        axios.get(
            `http://188.121.124.63/restaurant/managers/${id}/` , 
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
        setProfileImg(data.manager_image);
    }, [data.manager_image])

    useEffect(() => {
        setGender(data.gender);
    }, [data.gender]);

    useEffect(() => {
        setDob(data.date_of_birth);
    }, [data.date_of_birth]);

    const history = useHistory();
    const handleCloseNetwork = () => {
        setOpenNetwork(false);
    };
    const handleCloseWrongPass = () => {
        setOpenWrongPass(false);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const handleProfileImg = (e) => {
        const file = e.target.files[0];
        const fileSize = file.size;
        if(fileSize > MAX_FILE_SIZE){
            setOpen(true);
            e.target.value = null;
            setProfileImg(null);
            return;
        } else{
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setProfileImg(reader.result);
                setUpdate({...update, manager_image: reader.result});
            };
        }
        // console.log(profileImg);
    };
    
    useEffect(() => {
        let valid = !fullnameError && !newPasswordError && newPasswordMatch
                    // && password.trim().length > 0 && newPassword.trim().length > 0 && confirmPassword.trim().length > 0;
        setValidInputs(valid);
    }, [fullnameError, password, newPasswordError, confirmPasswordError, newPasswordMatch]);

    const handleClickShowCurrentPassword = () => setShowCurrentPassword(!showCurrentPassword);
    const handleMouseDownCurrentPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownnewPassword = (event) => {
        event.preventDefault();
    };
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownconfirmPassword = (event) => {
        event.preventDefault();
    };
    const handleReloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if(alertMessage !== "" && alertSeverity !== ""){
            if(alertSeverity === "success"){
                toast.success(alertMessage, {
                            position: toast.POSITION.BOTTOM_LEFT,
                            title: "Success",
                            autoClose: 7000,
                            pauseOnHover: true,
                            onClose: handleReloadPage
                        });
            } else {
                toast.error(alertMessage, {
                            position: toast.POSITION.BOTTOM_LEFT,
                            title: "Error",
                            autoClose: 3000,
                            pauseOnHover: true
                        });
            }
            setAlertMessage("");
            setAlertSeverity("");
        }
    }, [alertMessage, alertSeverity]);

    const firstChar = data?.name?data.name.charAt(0) : "UN";
    const handleUpdate = (e) => {
        e.preventDefault();
        axios.patch(
            `http://188.121.124.63/restaurant/managers/${id}`, update,
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
            setAlertMessage("Profile updated successfully!");
            setAlertSeverity("success");
            // window.location.reload(false);
        })
        .catch((error) => {
            console.log(error)
            if (error.request) {
                setOpenNetwork(true);
                console.log("network error");
                setAlertMessage("Network error! Please try again later.");
                setAlertSeverity("error");
            } else{
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            }
        });

        if(newPassword && password && confirmPassword)
        {
            console.log("coming");
            e.preventDefault();
            axios.patch(
                `http://188.121.124.63/user/change_password/${id}/`, {"old_password": password, "password": newPassword, "password2": confirmPassword},
                {headers: {
                    'Content-Type' : 'application/json',
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Methods" : "PUT,PATCH",
                    'Authorization' : "Token " + token.slice(1,-1)   
                }}
            )
            .then((response)=> {
                console.log(response);
                console.log("succesfully updated password");
                // window.location.reload(false);
                setAlertMessage("Your password changed successfully!");
                setAlertSeverity("success");
            })
            .catch((error) => {
                console.log(error);
                if (error.response) {
                    // setOpenWrongPass(true);
                    setAlertMessage("Your current password is wrong! Please try again later.");
                    setAlertSeverity("error");
                    console.log("wrong password");
                } else if (error.request){
                    // setOpenNetwork(true);
                    setAlertMessage("Network error! Please try again later.");
                    setAlertSeverity("error");
                    console.log("network error");
                }
            });
        }
    }

    const handleDiscard = () => {
        window.location.reload(false);
    }
    return ( 
        <ThemeProvider theme={theme}>
            <div className="edit-back-manager">
                <HeaderRestaurant/>
                <Grid container spacing={2} className="edit-grid-manager">
                    <div >
                        <ToastContainer />
                    </div>
                    <Grid item md={3} sm={12} xs={12}>
                        <Box className="edit-box-manager">
                            <Typography variant="h5" 
                                color="textPrimary"
                                gutterBottom
                                className="edit-title-manager"
                                // style={{fontWeight: 'bold', fontSize: '30px'}}
                            >
                                Profile Picture
                            </Typography>
                            <Avatar
                                className="edit-avatar-manager"
                                style={{backgroundColor: color, fontSize:"40px"}}
                                src={croppedImage}
                            >
                                {firstChar}
                            </Avatar>
                            {/* <Typography className="text-above-upload-manager">
                                JPG or PNG no larger than 5 MB
                            </Typography>
                            {open && <Alert severity="error" open={open} onClose={handleClose} className="image-alert-manager" variant="outlined" >
                                        File size is too large.
                                    </Alert>
                            } */}
                            <input
                                accept="image/*"
                                id="photoInput"
                                type="file"
                                hidden      
                                MAX_FILE_SIZE={MAX_FILE_SIZE}        
                                onClick={(e) => {
                                    onClose();
                                  }}
                                  onChange={(e) => {
                                    const [file] = e.target.files;
                                    setImg(file);
                                    setOpenImg(true);
                                  }}                  
                            />
                            <label htmlFor="photoInput" className="input-label-manager">
                                <Button className="upload-button-manager"  component="span">
                                    Upload new image
                                </Button>
                            </label>
                        </Box>
                    </Grid>
                    <Modal
                open={openImg}
                onClose={handleCloseImg}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{ margin: 10 }}
              >
                <Box sx={style}>
                  <div className="App">
                    <div className="crop-container">
                      <Cropper
                        image={img ? URL.createObjectURL(img) : null}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                      />
                    </div>
                  </div>

                  <Divider
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      position: "absolute",
                      width: "100%",
                      top: 50,
                    }}
                  ></Divider>
                  <Divider
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      position: "absolute",
                      width: "100%",
                      bottom: 50,
                    }}
                  ></Divider>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      position: "absolute",
                      bottom: 5,
                      justifyContent: "center",
                      alignItems: "center",
                      left: "50%",
                      transform: "translate(-50%, 0%)",
                      width: "90%",
                    }}
                  >
                    <Button
                      onClick={showCroppedImage}
                      variant="contained"
                      style={{ backgroundColor: 'green' , fontFamily:'Montserrat' , fontWeight:'bold'}}
                    >
                      Apply cutting
                    </Button>
                    <Button
                      onClick={onClose}
                      variant="contained"
                      style={{ backgroundColor: 'red' , marginLeft:'3%' , fontFamily:'Montserrat', fontWeight:'bold'}}
                    >
                      dissuassion
                    </Button>
                  </div>
                </Box>
              </Modal>
                    <Grid item md={9} sm={12} xs={12}>
                        <Box className="edit-box-manager">
                            <Typography variant="h5" 
                                color="textPrimary"
                                gutterBottom
                                className="edit-title-manager"
                                // style={{fontWeight: 'bold', fontSize: '30px'}}
                            >
                                Account Details 
                            </Typography>
                            <FormControl className="edit-field-manager">
                                <Grid container spacing={2}>
                                    {/* {openNetwork && 
                                            <Grid item lg={12} sm={12} md={12}>
                                                {openNetwork && <Alert severity="error" onClose={handleCloseNetwork} variant="outlined"> 
                                                                    Network error!
                                                                </Alert>
                                                }
                                            </Grid> 
                                    } */}
                                    {/* {openWrongPass && 
                                        <Grid item lg={12} sm={12} md={12}>
                                                {openWrongPass && <Alert severity="error" onClose={handleCloseWrongPass} variant="outlined">
                                                                    Current password is wrong!
                                                                </Alert> 
                                                }                                        
                                        </Grid>    
                                    } */}
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            label="Full name"
                                            variant="outlined"
                                            color="secondary"
                                            value={fullname}
                                            onChange={handleFullname}
                                            style={{width: '100%'}}
                                            error={fullnameError}
                                            InputLabelProps={{ shrink: true }} 
                                            helperText={
                                                <div className="edit-error-manager">
                                                    {fullnameError && 'Your full name should have at least two words.'}
                                                </div>
                                            }
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <PhoneInput
                                            label="Phone number"
                                            value={data.number}
                                            defaultCountry="ir"
                                            color="secondary"
                                            onChange={handlePhoneChange}
                                            InputLabelProps={{ shrink: true }} 
                                            // inputClass={classes.field}
                                            className="phone-input-manager"
                                            style={{width: '100%'}}
                                            variant="outlined"
                                            // focused={true}
                                            inputProps={{
                                                maxLength: 13
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </FormControl>
                            <FormControl className="edit-field-manager">
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
                                {show && <>
                                <FormControl className="edit-field-manager">
                                    <TextField
                                        label="Current passsword"
                                        variant="outlined"
                                        color="secondary"
                                        onChange={handlePassword}
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

                                <FormControl className="edit-field-manager">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        label="New password"
                                        variant="outlined"
                                        style={{width: '100%'}}
                                        color="secondary"
                                        onChange={handlenewPassword}
                                        type= {showNewPassword ? 'text' : 'password'}
                                        error={newPasswordError}
                                        helperText= {
                                            <div className="edit-error-manager">
                                                {newPasswordError && 'Password must be mixture of letters and numbers.'}
                                            </div>
                                        }
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
                                                        onMouseDown={handleMouseDownnewPassword}
                                                    >
                                                        {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6}>
                                        <TextField
                                            label="Confirm new password"
                                            variant="outlined"
                                            style={{width: '100%'}}
                                            color="secondary"
                                            onChange={handleConfirmPassword}
                                            error={newPasswordMatch === false}
                                            helperText={
                                                <div className="edit-error-manager">
                                                    {!newPasswordMatch && 'Password do not match!'}
                                                </div>
                                            }
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
                                                            onMouseDown={handleMouseDownconfirmPassword}
                                                        >
                                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                            />
                                    </Grid>
                                    </Grid>
                                </FormControl>
                                </>
                                }
                            <Grid container spacing={2} className="edit-button-grid-manager" wrap="nowrap">
                                <Grid item>
                                    <Button className="edit-save-changepass-button"  id="edit-button" variant="contained" onClick={() => setShow(prev => !prev)}>Change password </Button>
                                </Grid>
                                <Grid item container lg={5} md={6} sm={12}
                                // style={{marginRight: "-10px"}}
                                justifyContent="flex-end"
                                >
                                    <Grid item style={{paddingRight: '5px'}}>
                                        <Button className="edit-discard-button-manager" id="edit-button" variant="contained" onClick={handleDiscard}
                                            // style={{marginRight: "2%"}}
                                            // style={{backgroundColor: '#E74C3C'}}
                                        >Discard</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button className="edit-save-changepass-button-manager" id="edit-button" variant="contained" onClick={handleUpdate}
                                            disabled={!validInputs}
                                            // style={{marginRight: "-2%"}}
                                        >Save changes</Button>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Box>
                    </Grid>
                </Grid> 
                <Footer/>
            </div>
        </ThemeProvider>

    );
}
export default EditProfileManager;