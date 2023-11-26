import React, { useEffect, useState, useCallback } from "react";
import { Avatar, Box, Button, createTheme, DialogTitle, Divider, Grid, IconButton, InputAdornment, TextField, ThemeProvider, Typography, withStyles, makeStyles } from "@material-ui/core";
import './EditProfile.css';
import HeaderRestaurant from '../../components/Header/HeaderRestaurant';
import axios from "axios";
import Footer from "../../components/Footer/Footer";
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { Link, useParams } from 'react-router-dom';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { Alert, Dialog } from "@mui/material";
import { useHistory } from "react-router-dom";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PhoneInput from 'material-ui-phone-number';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import MenuItem from '@mui/material/MenuItem';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from '@mui/icons-material/Add';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Map from "../../components/Map/Map";
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getCroppedImg from "../../components/Crop/cropImage";
import Cropper from "react-easy-crop";
import PulseLoader from "react-spinners/PulseLoader";

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
    dialogRoot: {
        width: '100%',
        minHeight: '300px',
        maxHeight: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflowY: 'scroll'
    },
});

const StyledDialog = withStyles(styles)(Dialog);

const useStyles = makeStyles((theme) => ({
    squareAvatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
      borderRadius: 0,
    },
}));

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

function getRandomColor() {
    const colors = ['#FFA600', '#fff2bf', '#ffe480', '#a2332a' , '#E74C3C' , '#690000' , '#595959', '#3e3e3e' , '#C6C6C6', '#ABABAB', '#B9B9B9'];
    return colors[Math.floor(Math.random() * colors.length)];
};

function EditRestaurant(props){
    // const class_avatar = useStyles();
    const { value, defaultCountry, onChange, classes } = props;
    const [fullname, setFullname] = useState('');
    const [fullnameError, setFullnameError] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openButton = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };   
    const [doe, setDoe] = useState(null);
    const [color, setColor] = useState(localStorage.getItem('avatarColor') || getRandomColor());
    const [discount, setDiscount] = useState('');
    const [update, setUpdate] = useState('');
    const [phone, setPhone] = useState('');
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    const [data, setData] = useState('');
    const [city, setCity] = useState();
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState(' ');
    const [description, setDescription] = useState(" ");
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [newPasswordMatch, setNewPasswordMatch] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [profileImg, setProfileImg] = useState('');
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const [open, setOpen] = useState(false);
    const [validInputs, setValidInputs] = useState(false);
    const [openMenu, setOpenMenu] = useState(true);
    const [idFood, setIdFood] = useState();
    const idM = localStorage.getItem('id');
    const {idR} = useParams();
    const [food, setFood] = useState([]);
    const [foodName, setFoodName] = useState('');
    const [foodNameError, setFoodNameError] = useState(false);
    const [foodPicture, setFoodPicture] = useState('');
    const [foodPicture2, setFoodPicture2] = useState('');
    const [foodIngredient, setFoodIngredient] = useState('');
    const [foodIngredientError, setFoodIngredientError] = useState(false);
    const [remainFood, setRemainFood] = useState(0);
    const [remainFoodError, setRemainFoodError] = useState(false);
    const [foodPrice, setFoodPrice] = useState(0);
    const [foodPriceError, setFoodPriceError] = useState(false);
    const [menu, setMenu] = useState([]);
    const [openEdit, setOpenEdit] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [updateFoodPic, setUpdateFoodPic] = useState('');
    const [updateFoodPic2, setUpdateFoodPic2] = useState('');
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState();
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    let role = localStorage.getItem("role");
    role = role.replace(/"/g, "");
    const mylocation = [lat, lng, idR, role];
    const [openImg, setOpenImg] = React.useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [img, setImg] = useState(undefined);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);
    const history = useHistory();
    const [showMap, setShowMap] = useState(false);
    const [blurBackground, setBlurBackground] = useState(false);
    const [showSecondImage, setShowSecondImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const showCroppedImage = useCallback(async () => {
        try {
            setOpenImg(false);
            const croppedImage = await getCroppedImg(
                URL.createObjectURL(img),
                croppedAreaPixels,
                0
            );
            setCroppedImage(croppedImage);
            setUpdate({...update, restaurant_image: croppedImage});
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
        document.getElementById("photoInput").value = null;
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
        if(e.target.value.length > 256){
            setFullnameError(true);
        } else {
            setFullnameError(false);
        }
    };

    useEffect(() => {
        if(!localStorage.getItem('avatarColor')) {
            localStorage.setItem('avatarColor', color);
        }
    }, []);

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

    useEffect(() => {
        localStorage.setItem('lat', lat);
        localStorage.setItem('long', lng);
    }, [lat,lng]);

    const handlePhoneChange = (value) => {
        setUpdate({...update, number : value});
        localStorage.setItem('phone', value);
        setPhone(value);
    };

    const handleEstablishdate = (date) => {
        setDoe(date);
        console.log(data.date_of_establishment);
        const formattedDate = dayjs(date).format('YYYY-MM-DD');
        setUpdate({...update, date_of_establishment : formattedDate});
    };

    const handleDiscount = (e) => {
        setDiscount(e.target.value);
        setUpdate({...update, discount: e.target.value/100});
    };

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu);
        axios.get(
            `http://188.121.124.63/restaurant/managers/${idM}/restaurants/${idR}/food/` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,POST",
                'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            setMenu(response.data);
        })
        .catch((error) => console.log(error));
    };

    useEffect(() =>{
        axios.get(
            `http://188.121.124.63/user/all-countries/` , 
            {headers :{
                'Content-Type' : 'application/json'
            }}
        )
        .then((response) => {
            setCountries(response.data);
        })
        .catch((error) => console.log(error));
    },[]);

    //geting the lt and lng of map
    useEffect(() =>{
        axios.get(
            `http://188.121.124.63/restaurant/${idR}/lat_long` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,POST",
                'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            const data = response.data;
            setLat(data.lat);
            setLng(data.lon);
        })
        .catch((error) => console.log(error));
    },[]);

    useEffect(() =>{
        const userData = {
            name: country
        };
        axios.post(
            "http://188.121.124.63/user/cities-of-country/", 
            userData, 
            {headers:{
                "Content-Type" : "application/json"
            }}
        )
        .then((response) => {
            setCities(response.data);
        })
        .catch((error) => console.log(error));
    },[country]);

    const handleCity = (e) => {
        setCity(e.target.value);
    };

    const handleCountry = (e) => {
        setCountry(e.target.value);
    };

    const handleAddress = (e) => {
        setAddress(e.target.value);
    };

    const handleDescription = (e) => {
        setDescription(e.target.value);
        setUpdate({...update, description : e.target.value});
    };

    useEffect(() => {
        setNewPasswordMatch(newPassword === confirmPassword);
    }, [newPassword, confirmPassword]);

    useEffect(() => {
        setFullname(data.name);
        setDoe(data.date_of_establishment);
        setProfileImg(data.restaurant_image);
        setDiscount(data.discount * 100);
        setDescription(data.description);
        const arr = data?.address?data?.address.split(","):[];
        setCountry(arr[2] || '');
        setCity(arr[1] || '');
        setAddress(arr[0] || '');
    }, [data]);

    useEffect(() => {
        const temp = address + ',' + city + ',' + country;
        console.log("city is : ");
        console.log(city);
        console.log(temp);
        setUpdate({...update, address : temp})
    }, [country, city, address]);

    useEffect(() => {
        setFoodName(food.name);
        setFoodPrice(food.price);
        setFoodIngredient(food.ingredients);
        setRemainFood(food.remainder);
        setFoodPicture(food.food_pic);
        setFoodPicture2(food.food_pic2);
    }, [food]);

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
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setProfileImg(reader.result);
                setUpdate({...update, restaurant_image: reader.result});
            };
        }
    };

    const handleFoodPicture = (e) => {
        const file1 = e.target.files[0];
        const fileSize1 = file1.size;
        if(fileSize1 > MAX_FILE_SIZE){
            e.target.value = null;
            setFoodPicture(null);
            return;
        } else {
            const reader1 = new FileReader();
            reader1.readAsDataURL(file1);
            reader1.onloadend = () => {
                setFoodPicture(reader1.result);
                setUpdateFoodPic({...updateFoodPic, food_pic: reader1.result});
            };
        }
    };

    const handleFoodPicture2 = (e) => {
        const file1 = e.target.files[0];
        const fileSize1 = file1.size;
        if(fileSize1 > MAX_FILE_SIZE){
            e.target.value = null;
            setFoodPicture2(null);
            return;
        } else {
            const reader1 = new FileReader();
            reader1.readAsDataURL(file1);
            reader1.onloadend = () => {
                setFoodPicture2(reader1.result);
                setUpdateFoodPic2({...updateFoodPic2, food_pic2: reader1.result});
            };
        }
    };

    useEffect(() => {
        setFoodName('');
        setFoodIngredient('');
        setFoodPrice('');
        setRemainFood('');
        setFoodPicture('');
        setFoodPicture2('');
    }, [openAdd]);

    const handleFoodName = (e) => {
        setFoodName(e.target.value);
        if(e.target.value.length > 255){
            setFoodNameError(true);
        } else {
            setFoodNameError(false);
        }
    };

    const handleFoodIngredient = (e) => {
        setFoodIngredient(e.target.value);
        if(e.target.value.length > 256){
            setFoodIngredientError(true);
        } else {
            setFoodIngredientError(false);
        }
    };

    const handleRemain = (e) => {
        setRemainFood(e.target.value);
        if(!/^[0-9]+?$/.test(e.target.value) || e.target.value.trim() === ''){
            setRemainFoodError(true);
        } else {
            setRemainFoodError(false);
        }
    };

    const handleFoodPrice = (e) => {
        setFoodPrice(e.target.value);
        if(!/^[0-9]+([.][0-9]+)?$/.test(e.target.value) || e.target.value.trim() === ''){
            setFoodPriceError(true);
        } else {
            setFoodPriceError(false);
        }
    };
    
    useEffect(() => {
        let valid = !fullnameError && !newPasswordError && newPasswordMatch
                    // && password.trim().length > 0 && newPassword.trim().length > 0 && confirmPassword.trim().length > 0;
        setValidInputs(valid);
    }, [fullnameError, password, newPasswordError, confirmPasswordError, newPasswordMatch]);

    useEffect(() =>{
        axios.get(
            `http://188.121.124.63/restaurant/managers/${idM}/restaurants/${idR}/` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH,PUT,DELETE",
                'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            setData(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(true);
        })
    },[]);

    const firstChar = data?.name?data.name.charAt(0) : "UN";

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.patch(
            `http://188.121.124.63/restaurant/managers/${idM}/restaurants/${idR}/`, update,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then(()=> {
            setAlertMessage("Restaurant details updated successfully!");
            setAlertSeverity("success");
        })
        .catch((error) => {
            if (error.request) {
                setAlertMessage("Network error! Please try again later.");
                setAlertSeverity("error");
            } else{
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            }
        });
    };

    const handleDiscard = () => {
        window.location.reload(false);
    };

    const handleDeleteRestaurant = () => {
        axios.delete(
            `http://188.121.124.63/restaurant/managers/${idM}/restaurants/${idR}/`
        )
        .then(() => {
            history.push("/homepage-restaurant");
        })
        .catch((error) => console.log(error));
    };

    const handleDelete = (res) => {
        axios.delete(
            `http://188.121.124.63/restaurant/managers/${idM}/restaurants/${idR}/food/${idFood}/`, 
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then(() => {
            setAlertMessage("Food deleted successfully!");
            setAlertSeverity("success");
        })
        .catch((error) => {
            setAlertMessage("A problem has been occured! Please try again later.");
            setAlertSeverity("error");
        });
    };

    const handleOpenEdit = (e) => {
        setIdFood(e);
        setOpenEdit(!openEdit);
        axios.get(
            `http://188.121.124.63/restaurant/managers/${idM}/restaurants/${idR}/food/${e}/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setFood(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    };

    const handleEditThisFood = () => {
        const editData = {
            id: idFood,
            name: foodName, 
            price: foodPrice, 
            ingredients: foodIngredient, 
            food_pic: foodPicture,
            food_pic2: foodPicture2,
            remainder: remainFood,
            restaurant_id: idR
        };

        axios.put(
            `http://188.121.124.63/restaurant/managers/${idM}/restaurants/${idR}/food/${idFood}/`, 
            editData,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then(() => {
            setAlertMessage("Food updated successfully!");
            setAlertSeverity("success");
        })
        .catch(() => {
            setAlertMessage("A problem has been occured! Please try again later.");
            setAlertSeverity("error");
        });
    };

    const hanldeAddNewFood = (e) => {
        e.preventDefault();
        const userData = {
            name: foodName,
            price: foodPrice,
            ingredients: foodIngredient,
            food_pic: foodPicture,
            food_pic2: foodPicture2,
            remainder: remainFood,
            restaurant_id: idR
        };

        axios.post(
            `http://188.121.124.63/restaurant/managers/${idM}/restaurants/${idR}/food/`, 
            userData, 
            {headers:{
                "Content-Type" : "application/json", 
                'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then(() => {
            setAlertMessage("Food added successfully!");
            setAlertSeverity("success");
        })
        .catch((error) => {
            if (error.response) {
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            } 
            else if (error.request) {
                setAlertMessage("Network error! Please try again later.");
                setAlertSeverity("error");
            } 
            else {
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            }
        });
    };

    const handleOpenAdd = (e) => {
        setOpenAdd(!openAdd);
    };
    
    const handleOpenMap = () => {
        setShowMap(true);
        setBlurBackground(true);
    };
          
    const handleCloseMap = () => {
        setShowMap(false);
        setBlurBackground(false);
    };

    const isBase64 = (str) => {
        try {
          return btoa(atob(str)) == str;
        } catch (err) {
          return false;
        }
      };

    return ( 
        <ThemeProvider theme={theme}>
            <div 
                className="edit-back"
            >
                <HeaderRestaurant/>
                {loading ? (
                        <PulseLoader
                        type="bars"
                        color="black"
                        speedMultiplier={1}
                        className="edit-spinner"
                        
                        />
                ) : (
                    <div 
                        className={`container ${blurBackground ? 'blur-background' : ''}`}
                    >
                        <div >
                            <ToastContainer />
                        </div>
                        <Grid container spacing={2} 
                            className="edit-grid"
                        >
                            <Grid item md={3} sm={12} xs={12}>
                                <Box 
                                    className="edit-box"
                                >
                                    <Typography 
                                        variant="h5" 
                                        color="textPrimary"
                                        gutterBottom
                                        className="edit-title"
                                    >
                                        Profile Picture
                                    </Typography>
                                    <Avatar
                                        className="edit-avatar"
                                        style={{backgroundColor: color, fontSize:"40px"}}
                                        src={croppedImage}
                                    >
                                        {firstChar}
                                    </Avatar>
                                    <Typography 
                                        className="text-above-upload"
                                    >
                                        JPG or PNG no larger than 5 MB
                                    </Typography>
                                    {open && 
                                        <Alert 
                                            severity="error" 
                                            open={open} 
                                            onClose={handleClose} 
                                            className="image-alert" 
                                            variant="outlined" 
                                        >
                                            File size is too large.
                                        </Alert>
                                    } 
                                    <input
                                        accept="image/*"
                                        id="profile-image-input-restaurant"
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
                                    <label 
                                        htmlFor="profile-image-input-restaurant" 
                                        className="input-label"
                                    >
                                        <Button 
                                            className="upload-button" 
                                            component="span"
                                        >
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
                                    <div 
                                        className="App"
                                    >
                                        <div 
                                            className="crop-container"
                                        >
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
                                        className="crop-divider"
                                        id="top"
                                    />
                                    <Divider
                                        className="crop-divider"
                                        id="bottom"
                                    />
                                    <div
                                        className="crop-buttons"
                                    >
                                        <Button
                                            onClick={showCroppedImage}
                                            variant="contained"
                                            className="edit-button crop"
                                            id="save"
                                        >
                                            Apply
                                        </Button>
                                        <Button
                                            onClick={onClose}
                                            variant="contained"
                                            className="edit-button crop"
                                            id="discard"
                                        >
                                            Discard
                                        </Button>
                                    </div>
                                </Box>
                            </Modal>
                            <Grid item md={9} sm={12} xs={12}>
                                <Box 
                                    className="edit-box"
                                >
                                    <Typography 
                                        variant="h5" 
                                        color="textPrimary"
                                        gutterBottom
                                        className="edit-title"
                                    >
                                        Restaurant Details 
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                label="Restaurant name"
                                                variant="outlined"
                                                color="secondary"
                                                value={fullname}
                                                onChange={handleFullname}
                                                className="item"
                                                error={fullnameError}
                                                InputLabelProps={{ shrink: true }} 
                                                helperText={
                                                    <div className="edit-error">
                                                        {fullnameError && 'Name should have at most 256 characters.'}
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
                                                className="phone-input item"
                                                variant="outlined"
                                                inputProps={{
                                                    maxLength: 13
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} className="edit-field">
                                        <Grid item xs={12} sm={6} md={6}>
                                            <LocalizationProvider 
                                                dateAdapter={AdapterDayjs}
                                                InputLabelProps={{ shrink: true }}
                                            >
                                                <DemoContainer components={['DatePicker']} >
                                                    <DatePicker
                                                        label="Establishment date"
                                                        views={['year', 'month', 'day']}
                                                        sx={{width: '100%'}}
                                                        maxDate={dayjs()}
                                                        onChange={handleEstablishdate}
                                                        value={doe ? dayjs(doe) : null }
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6} lg={6}>
                                            <TextField
                                                label="Discount"
                                                variant="outlined"
                                                color="secondary"
                                                value={discount}
                                                onChange={handleDiscount}
                                                InputLabelProps={{ shrink: true }}  
                                                style={{marginTop: '8px'}}
                                                className="item"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2} 
                                        style={{marginTop: '10px'}}
                                    >
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                label="Country"
                                                variant="outlined"
                                                color="secondary"
                                                value={country}
                                                InputLabelProps={{ shrink: true }}
                                                className="item"
                                                onChange={handleCountry}
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: '290px'
                                                            },
                                                        },
                                                    },
                                                }}
                                            >
                                                <MenuItem 
                                                    value="select" 
                                                    disabled
                                                >
                                                    <em>
                                                        Select Country
                                                    </em>
                                                </MenuItem>
                                                {countries && 
                                                    countries.map((c, index) => (
                                                        <MenuItem 
                                                            style={{height: '40px' }} 
                                                            value={c}
                                                        >
                                                            {c}
                                                        </MenuItem>
                                                    )
                                                )} 
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <TextField
                                                label="City"
                                                variant="outlined"
                                                color="secondary"
                                                value={city}
                                                InputLabelProps={{ shrink: true }}
                                                className="item"
                                                onChange={handleCity}
                                                select
                                                SelectProps={{
                                                    MenuProps: {
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: '290px',
                                                            }
                                                        }
                                                    }
                                                }}
                                            > 
                                                <MenuItem 
                                                    value="select" 
                                                    disabled
                                                >
                                                    <em>
                                                        Select City
                                                    </em>
                                                </MenuItem>
                                                {cities && 
                                                    cities.map((c, index) => (
                                                        <MenuItem 
                                                            style={{height: '40px' }} 
                                                            value={c}
                                                        >
                                                            {c}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                        <TextField
                                            label="Address"
                                            variant="outlined"
                                            color="secondary"
                                            multiline
                                            value = {address?address:""}
                                            onChange={handleAddress}
                                            className="item"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton 
                                                            title="choose location" 
                                                            style={{marginLeft:"28%"}} 
                                                            onClick={handleOpenMap}
                                                        >
                                                            <TravelExploreIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                        <Modal 
                                            open={showMap} 
                                            onClose={handleCloseMap}
                                        >
                                            <Map 
                                                location={mylocation}
                                            />
                                        </Modal>
                                        <TextField
                                            label="Description"
                                            variant="outlined"
                                            color="secondary"
                                            multiline
                                            className="item"
                                            value={description}
                                            onChange={handleDescription}
                                            InputLabelProps={{ shrink: true }}  
                                        />
                                        {openMenu && 
                                            <Button 
                                                color="secondary"
                                                onClick={handleOpenMenu}
                                                className="showmenu-button edit-button"
                                            >
                                                Show Menu
                                            </Button>
                                        }
                                        {!openMenu && 
                                            <div>
                                                <Grid container spacing={1}
                                                    className="menu" 
                                                >
                                                    <IconButton 
                                                        title="Add food" 
                                                        className="add"
                                                    >
                                                        <AddIcon 
                                                            onClick={handleOpenAdd}
                                                        />
                                                    </IconButton>
                                                    <IconButton 
                                                        title="Hide menu" 
                                                        className="hide"
                                                    >
                                                        <ClearIcon 
                                                            onClick={handleOpenMenu}
                                                        />
                                                    </IconButton>
                                                </Grid>
                                                <StyledDialog 
                                                    open={openAdd}  
                                                    classes={{ paper: classes.dialogRoot }} 
                                                    onClose={handleOpenAdd}
                                                >
                                                    <DialogTitle 
                                                        className="edit-title"
                                                    >
                                                        Add Food
                                                    </DialogTitle>
                                                    <Grid container spacing={2}>
                                                        <Grid md ={6} sm={12} xs={12} className='edit-food-grid'>
                                                            <Avatar
                                                            className="food-avatar"
                                                            style={{backgroundColor: color}}
                                                            src={foodPicture}
                                                            >
                                                                F
                                                            </Avatar>
                                                            <input
                                                                accept="image/*"
                                                                id="food-image-input"
                                                                type="file"
                                                                onChange={handleFoodPicture}
                                                                hidden      
                                                                MAX_FILE_SIZE={MAX_FILE_SIZE}                   
                                                            />
                                                            <label 
                                                                htmlFor="food-image-input" 
                                                                className="food-image-button"
                                                            >
                                                                <Button 
                                                                    className="upload-button" 
                                                                    component="span"
                                                                >
                                                                    Upload the first food image
                                                                </Button>
                                                            </label>
                                                        </Grid>
                                                        <Grid md ={6} sm={12} xs={12} className='edit-food-grid'>
                                                            
                                                            <Avatar
                                                            className="food-avatar"
                                                            style={{backgroundColor: color}}
                                                            src={foodPicture2}
                                                            >
                                                                F
                                                            </Avatar>
                                                            <input
                                                                accept="image/*"
                                                                id="food-image-input2"
                                                                type="file"
                                                                onChange={handleFoodPicture2}
                                                                hidden      
                                                                MAX_FILE_SIZE={MAX_FILE_SIZE}                   
                                                            />
                                                            <label 
                                                                htmlFor="food-image-input2" 
                                                                className="food-image-button"
                                                            >
                                                                <Button 
                                                                    className="upload-button" 
                                                                    component="span"
                                                                    disabled={!foodPicture}
                                                                >
                                                                    Upload the second food image
                                                                </Button>
                                                            </label>
                                                        </Grid>

                                                    </Grid>
                                                    <TextField
                                                        label="Name"
                                                        variant="outlined"
                                                        color="secondary"
                                                        className="edit-field food"
                                                        required
                                                        value={foodName}
                                                        onChange={handleFoodName}
                                                        error={foodNameError}
                                                        helperText={
                                                            <div className="food-error">
                                                                {foodNameError && "Name should have at most 256 character."}
                                                            </div>
                                                        }
                                                    />
                                                    <TextField
                                                        label="Ingredient"
                                                        variant="outlined"
                                                        color="secondary"
                                                        multiline
                                                        className="edit-field food"
                                                        onChange={handleFoodIngredient}
                                                        error={foodIngredientError}
                                                        helperText={
                                                            <div className="food-error">
                                                                {foodIngredientError && "Ingredients should have at most 256 character."}
                                                            </div>
                                                        }
                                                    />
                                                    <Grid container spacing={2} 
                                                        className="edit-field remain-price" 
                                                    >
                                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                                            <TextField
                                                                label="Remain amount"
                                                                variant="outlined"
                                                                color="secondary"
                                                                value={remainFood}
                                                                required
                                                                className="remain"
                                                                onChange={handleRemain}
                                                                error={remainFoodError}
                                                                helperText={
                                                                    <div className="edit-error">
                                                                        {remainFoodError && "Remain amount must be number."}
                                                                    </div>
                                                                }
                                                            />
                                                        </Grid>
                                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                                            <TextField
                                                                label="Price"
                                                                variant="outlined"
                                                                color="secondary"
                                                                className="price"
                                                                required
                                                                value={foodPrice}
                                                                error={foodPriceError}
                                                                onChange={handleFoodPrice}
                                                                helperText={
                                                                    <div className="food-error">
                                                                        {foodPriceError && "Price must be a number."}
                                                                    </div>
                                                                }
                                                                InputProps={{
                                                                    startAdornment: (
                                                                        <InputAdornment 
                                                                            position="start" 
                                                                        >
                                                                            $
                                                                        </InputAdornment>
                                                                    )
                                                                }}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={2} 
                                                        className="food-button-grid"
                                                    >
                                                        <Grid item>
                                                            <Button 
                                                                className="edit-button" 
                                                                id="discard"
                                                                variant="contained"
                                                                onClick={handleOpenAdd}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </Grid>
                                                        <Grid item lg={2} md={2} sm={2}>
                                                            <Button 
                                                                className="edit-button" 
                                                                id="save" 
                                                                variant="contained" 
                                                                onClick={hanldeAddNewFood}
                                                            >
                                                                Add
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </StyledDialog>
                                                <Box 
                                                    className="menu-box"
                                                >
                                                    {menu && menu.map((res, index) => (
                                                        <div>
                                                            <Box 
                                                                className="food-box"
                                                            >
                                                                <Grid container spacing={4}>
                                                                    <Grid item lg={3} md={3} sm={3} >
                                                                        <div
                                                                            className="food-image-container"
                                                                            onMouseEnter={() => setShowSecondImage(res.id)}
                                                                            onMouseLeave={() => setShowSecondImage(null)}
                                                                        >
                                                                            <img
                                                                                src={showSecondImage === res.id && res.food_pic2!=null ? res.food_pic2 : res.food_pic}
                                                                                className="food-image"
                                                                            />
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item lg={5} md={5} sm={4} className='edit-food-grid'>
                                                                        <Typography 
                                                                            className="food-name"
                                                                        >
                                                                            {res.name}
                                                                        </Typography>
                                                                        <Typography 
                                                                            className="food-ingredient"
                                                                        >
                                                                            {res.ingredients}
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={2} className='edit-food-grid'>
                                                                        <Typography 
                                                                            className="food-price-menu"
                                                                        >
                                                                            {res.price}$
                                                                        </Typography>
                                                                        <Typography 
                                                                            className="food-remain-number"
                                                                        >
                                                                            {res.remainder} remain
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item lg={2} md={2} sm={3} className='edit-food-grid'>
                                                                        <Button 
                                                                            className="food-edit" 
                                                                            id="food-edit-button" 
                                                                            onClick={() => handleOpenEdit(res.id)}
                                                                        >
                                                                            Edit
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Box>
                                                            <StyledDialog 
                                                                open={openEdit} 
                                                                classes={{ paper: classes.dialogRoot }} 
                                                                onClose={handleOpenEdit}
                                                            >
                                                                <DialogTitle 
                                                                    className="edit-title"
                                                                >
                                                                    Edit Food
                                                                </DialogTitle>
                                                                <Grid container spacing={2}>
                                                                    <Grid md ={6} sm={12} xs={12} className='edit-food-grid'>
                                                                        <Avatar
                                                                        className="food-avatar"
                                                                        style={{backgroundColor: color}}
                                                                        src={foodPicture}
                                                                        >
                                                                            F
                                                                        </Avatar>
                                                                        <input
                                                                            accept="image/*"
                                                                            id="edit-food-image-input"
                                                                            type="file"
                                                                            onChange={handleFoodPicture}
                                                                            hidden      
                                                                            MAX_FILE_SIZE={MAX_FILE_SIZE}                   
                                                                        />
                                                                        <label 
                                                                            htmlFor="edit-food-image-input" 
                                                                            className="food-image-button"
                                                                        >
                                                                            <Button 
                                                                                className="upload-button" 
                                                                                component="span"
                                                                            >
                                                                                Upload the first food image
                                                                            </Button>
                                                                        </label>
                                                                    </Grid>
                                                                    <Grid md ={6} sm={12} xs={12} className='edit-food-grid'>
                                                                        
                                                                        <Avatar
                                                                        className="food-avatar"
                                                                        style={{backgroundColor: color}}
                                                                        src={foodPicture2}
                                                                        >
                                                                            F
                                                                        </Avatar>
                                                                        <input
                                                                            accept="image/*"
                                                                            id="edit-food-image-input2"
                                                                            type="file"
                                                                            onChange={handleFoodPicture2}
                                                                            hidden      
                                                                            MAX_FILE_SIZE={MAX_FILE_SIZE}                   
                                                                        />
                                                                        <label 
                                                                            htmlFor="edit-food-image-input2" 
                                                                            className="food-image-button"
                                                                        >
                                                                            <Button 
                                                                                className="upload-button" 
                                                                                component="span"
                                                                                disabled={foodPicture.includes('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')}
                                                                            >
                                                                                Upload the second food image
                                                                            </Button>
                                                                        </label>
                                                                    </Grid>

                                                                </Grid>
                                                                
                                                                
                                                                <TextField
                                                                    label="Name"
                                                                    variant="outlined"
                                                                    color="secondary"
                                                                    value={foodName}
                                                                    required
                                                                    className="edit-field food"
                                                                    onChange={handleFoodName}
                                                                    error={foodNameError}
                                                                    helperText={
                                                                        <div className="food-error">
                                                                            {foodNameError && "Name should have at most 256 character."}
                                                                        </div>
                                                                    }
                                                                    InputLabelProps={{ shrink: true }}
                                                                />
                                                                <TextField
                                                                    label="Ingredient"
                                                                    variant="outlined"
                                                                    color="secondary"
                                                                    value={foodIngredient}
                                                                    multiline
                                                                    className="edit-field food"
                                                                    onChange={handleFoodIngredient}
                                                                    error={foodIngredientError}
                                                                    helperText={
                                                                        <div className="food-error">
                                                                            {foodIngredientError && "Ingredients should have at most 256 character."}
                                                                        </div>
                                                                    }
                                                                    InputLabelProps={{ shrink: true }}
                                                                />
                                                                <Grid container spacing={2} 
                                                                    className="edit-field remain-price" 
                                                                >
                                                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                        <TextField
                                                                            label="Remain amount"
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            value={remainFood}
                                                                            required
                                                                            className="remain"
                                                                            onChange={handleRemain}
                                                                            error={remainFoodError}
                                                                            helperText={
                                                                                <div className="food-error">
                                                                                    {remainFoodError && "Remain amount must be number."}
                                                                                </div>
                                                                            }
                                                                        >
                                                                        </TextField>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6} sm={6} xs={12}>
                                                                        <TextField
                                                                            label="Price"
                                                                            variant="outlined"
                                                                            color="secondary"
                                                                            onChange={handleFoodPrice}
                                                                            value={foodPrice}
                                                                            required
                                                                            className="price"
                                                                            InputProps={{
                                                                                startAdornment: (
                                                                                    <InputAdornment 
                                                                                        position="end" 
                                                                                    >
                                                                                        $
                                                                                    </InputAdornment>
                                                                                ),
                                                                            }}
                                                                        />
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container spacing={2} 
                                                                    className="food-button-grid"
                                                                >
                                                                    <Grid item>
                                                                        <Button 
                                                                            className="edit-button" 
                                                                            id="discard" 
                                                                            variant="contained"
                                                                            onClick={handleDelete}
                                                                        >
                                                                            Delete
                                                                        </Button>
                                                                    </Grid>
                                                                    <Grid item container lg={5} md={5} sm={8}>
                                                                        <Grid item >
                                                                            <Button 
                                                                                className="edit-button" 
                                                                                id="discard"
                                                                                variant="contained"
                                                                                onClick={handleOpenEdit}
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <Button 
                                                                                className="edit-button" 
                                                                                id="save"
                                                                                variant="contained" 
                                                                                onClick={() => handleEditThisFood()}
                                                                            >
                                                                                Apply
                                                                            </Button>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                            </StyledDialog>
                                                        </div>
                                                    ))}
                                                </Box>
                                            </div>
                                        }
                                    <Grid container spacing={2} 
                                        className="edit-button-grid" 
                                        wrap="nowrap"
                                    >
                                        <Grid item>
                                            <Button 
                                                className="edit-button" 
                                                id="discard"
                                                variant="contained" 
                                                onClick={handleDeleteRestaurant}
                                            >
                                                Delete restaurant
                                            </Button>              
                                                        
                                        </Grid>  
                                        <Grid item container lg={5} md={6} sm={12} 
                                            justifyContent="flex-end"
                                        >
                                            <Grid item >
                                                <Button 
                                                    className="edit-button" 
                                                    id="discard"
                                                    variant="contained" 
                                                    onClick={handleDiscard}
                                                >
                                                    Discard
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button 
                                                    className="edit-button" 
                                                    id="save"
                                                    variant="contained" 
                                                    onClick={handleUpdate}
                                                    disabled={!validInputs}
                                                >
                                                    Save changes
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Grid>
                        </Grid> 
                    </div>
                )}
                <Footer/>
            </div>
        </ThemeProvider>
    );
}

export default withStyles(styles)(EditRestaurant);