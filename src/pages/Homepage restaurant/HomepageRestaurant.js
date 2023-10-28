import React, { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { Button, withStyles, ThemeProvider, Typography, TextField, Box, Grid, createTheme, MenuItem} from '@material-ui/core';
import { Card, CardActionArea, CardMedia, CardContent, Chip, Rating, Modal } from '@mui/material';
import { useHistory } from "react-router-dom";
import HeaderRestaurant from '../../components/HeaderRestaurant';
import axios from 'axios';
import { makeStyles } from '@mui/styles';
import "./HomepageRestaurant.css";
import PhoneInput from 'material-ui-phone-number';
import PlaceIcon from '@mui/icons-material/Place';
import MdPhone from '@mui/icons-material/Phone';
import '../../components/Homepage restaurant card/OwnRestaurantCard.css';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import Fab from '@mui/material/Fab';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddPagination from '../../components/Pagination';
import Pagination from '@mui/material/Pagination';

const useStyles = makeStyles({
    ul: {
        "& .MuiPaginationItem-root": {
            color: "#ffa600"
        }
    }
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
});

const styles = theme => ({
    field: {
      margin: '10px 0',
      width : "100px"
    },
    countryList: {
      ...theme.typography.body1,
      width : "100px"
    }
});

const breakpoints = {
    default: 3,
    1100: 2,
    700:1
};

function HomepageRestaurant(props){
    const { value, defaultCountry, onChange, classes } = props;
    const [validInputs, setValidInputs] = useState(false);
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newAddress, setNewAddress] = useState('');
    const [newDiscount, setNewDiscount] = useState('');
    const [newType, setNewType] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const [openNetwork, setOpenNetwork] = useState(null);
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const history = useHistory();
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const [openModal, setOpenModal] = React.useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const classesStyle = useStyles();
    const [page, setPage] = useState(1);
    const PER_PAGE = 6;
    const _DATA = AddPagination(restaurants, PER_PAGE);

    const handleShow = (res) => {
        history.push(`edit-restaurant/${id}/restaurants/${res.id}`);
    };

    const handleDelete = (res) => {
        console.log("i'm here to delete.");
        axios.delete(
            `http://188.121.124.63/restaurant/managers/${id}/restaurants/${res.id}/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then(() => {
            setAlertSeverity("success");
            setAlertMessage("Restaurant deleted successfully!");
        })
        .catch((error) => {
            console.log(error);
            setAlertSeverity("error");
            setAlertMessage("A problem has been occured! Please try again later.");
        });
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
            setAlertSeverity("");
            setAlertMessage("");
        }
    }, [alertMessage, alertSeverity]);  

    const handleEdit = (res) => {
        history.push(`edit-restaurant/${id}/restaurants/${res.id}`);
    };

    function setHeight() {
        const box = document.querySelector('.box');
        const boxHeight = box.offsetHeight;
        const image = document.querySelector('.background');
        image.style.height = `${boxHeight}px`;
    };

    const handleCloseNetwork = () => {
        setOpenNetwork(false);
        setHeight();
    };

    useEffect(() => {
        let valid = false;
        if (!(newAddress || newDiscount || newName || newPhone))
            valid = false;
        setValidInputs(valid);
    }, [newAddress, newName, newDiscount, newPhone]);

    useEffect(() =>{
        axios.get(
            `http://188.121.124.63/restaurant/managers/${id}/restaurants/` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,POST",
                'Authorization' : "Token " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            setRestaurants(response.data);
        })
        .catch((error) => console.log(error));
    },[]);

    const handlePagination = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    const handleAddName = (e) => {
        setNewName(e.target.value);
    };

    const handleAddPhone = (e) => {
        setNewPhone(e);
    };

    const handleAddDiscount = (e) => {
        setNewDiscount(e.target.value / 100);
    };

    const handleAddAddress = (e) => {
        setNewAddress(e.target.value);
    };

    const handleType = (e) => {
        setNewType(e.target.value);
    };

    const handleDescription = (e) => {
        setNewDescription(e.target.value);
    };

    const handleCancel = () => {
        window.location.reload(false);
    };


    const handleAdd = (e) => {
        e.preventDefault();
        const userData = {
            number: newPhone,
            name: newName,
            address: newAddress,
            rate: 0 ,
            restaurant_image: "",
            data_of_establishment: null,
            discount: newDiscount,
            type: newType,
            description: newDescription
        };
        axios.post(
            `http://188.121.124.63/restaurant/managers/${id}/restaurants/`, 
            userData, 
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then(() => {
            setAlertMessage("Restaurant added successfully!");
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
        });  
    }
    
    return ( 
        <ThemeProvider theme={theme}>
            <HeaderRestaurant />
            <h1 
                className='home-res-title'
            >
                My Restaurants
            </h1>
            <div>
                <div>
                    <ToastContainer />
                </div>
                <Fab 
                    className='add-restaurant'
                    aria-label="add"
                    onClick={handleOpenModal}>
                    <AddBusinessIcon />
                </Fab>
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        className="add_res_box" 
                    >
                        <div 
                            className='add-title'
                        >
                            <Typography 
                                variant='h5'
                            >
                                Add new restaurant
                            </Typography>
                        </div>
                        <TextField 
                            label="Name"
                            variant="outlined"
                            color="secondary"
                            onChange={handleAddName}
                            className='add-restaurant-field'
                        />
                        <TextField 
                            label="Address"
                            variant="outlined"
                            color="secondary"
                            onChange={handleAddAddress}
                            multiline
                            className='add-restaurant-field'
                        />
                        <PhoneInput
                            label="Phone number"
                            defaultCountry="ir"
                            color="secondary"
                            InputLabelProps={{ shrink: true }} 
                            className="phone-input add-restaurant-field"
                            inputClass={classes.field}
                            variant="outlined"
                            onChange={handleAddPhone}
                            inputProps={{
                                maxLength: 13
                            }}
                        />
                        <Grid container spacing={2}>
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField 
                                    label="Discount"
                                    variant="outlined"
                                    color="secondary"
                                    onChange={handleAddDiscount}
                                    className='add-restaurant-field'
                                />
                            </Grid> 
                            <Grid item lg={6} md={6} sm={12} xs={12}>
                                <TextField
                                    select
                                    label="Type of restaurant"
                                    color="secondary"
                                    variant="outlined"
                                    className='add-restaurant-field'
                                    onChange={handleType}
                                >
                                    <MenuItem 
                                        value="select" 
                                        disabled
                                    >
                                        <em>
                                            Select type
                                        </em>
                                    </MenuItem>
                                    <MenuItem 
                                        value="Iranian"
                                    >
                                        Iranian
                                    </MenuItem>
                                    <MenuItem 
                                        value="Foreign"
                                    >
                                        Foreign
                                    </MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <TextField
                            label="Description"
                            variant="outlined"
                            color="secondary"
                            multiline
                            rows={2}
                            maxRows={3}
                            onChange={handleDescription}
                            className='add-restaurant-field'
                        /> 
                        <Grid container spacing={2} 
                            className="new-restaurant-button-grid" 
                            wrap="nowrap"
                        >
                            <Grid item style={{paddingLeft: '20px'}}>
                                <Button 
                                    className="add-restaurant-button" 
                                    id="cancel" 
                                    variant="contained" 
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item style={{textAlign:"center"}}>
                                <Button 
                                    className="add-restaurant-button" 
                                    id="add" 
                                    variant="contained" 
                                    onClick={handleAdd}
                                >
                                    Add
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>
            </div>      
            {restaurants && restaurants.length > 0 ? 
                ( 
                    <Masonry 
                        breakpointCols={breakpoints}
                    >
                        {_DATA.currentData() && _DATA.currentData().map((res, index) => (
                            <div 
                                key={index} 
                                onClick={() => handleEdit(res)}
                            >
                                <Card 
                                    className='homepage-restaurant-card-restaurant' 
                                >
                                    <CardActionArea >
                                        <Grid container spacing={2}>
                                            <Grid item md={6}>
                                                <div 
                                                    style={{ position: 'relative' }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        className='homepage-restaurant-card'
                                                        image={res.restaurant_image}
                                                    />
                                                </div>
                                            </Grid>
                                            <Grid item md={6}>
                                                <CardContent 
                                                    className='home-restaurant-animation'
                                                >
                                                    <Grid container>
                                                        <Grid item>
                                                            <Typography 
                                                                className='restaurant-name-hemepage-restaurant' 
                                                                gutterBottom
                                                            >
                                                                {res.name}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item container 
                                                            className='restaurant-phone'
                                                        >
                                                            <Chip
                                                                icon={<MdPhone sx={{ fontSize: 20 }}/>}
                                                                sx={{mb:1, fontSize: "15px"}}
                                                                label={res.number}
                                                            />
                                                        </Grid>
                                                        <Grid item container 
                                                            className='restaurant-address'
                                                        >
                                                            <Chip
                                                                icon={<PlaceIcon sx={{ fontSize: 20 }}/>}
                                                                sx={{fontSize: "15px"}}
                                                                label={res.address}
                                                            />
                                                        </Grid>
                                                        <Grid item container 
                                                            alignItems="center" 
                                                            display= 'flex'
                                                        >
                                                            <Grid item container 
                                                                alignItems="center" style={{ marginBottom: "15px", width: "auto", marginLeft: "10px"}}
                                                            >
                                                                <Typography 
                                                                    style={{marginTop:'2.5%' }}
                                                                >
                                                                    {res.rate}
                                                                </Typography>    
                                                                <Rating 
                                                                    name="half-rating" 
                                                                    defaultValue={res.rate} 
                                                                    precision={0.1} 
                                                                    size="small" 
                                                                    readOnly 
                                                                    style={{marginTop: '2px'}}
                                                                />
                                                            </Grid>
                                                            <Button
                                                                variant='contained'
                                                                className='delete-restaurant-button'
                                                                onClick={(e) =>{
                                                                    e.stopPropagation();
                                                                    handleDelete(res)}
                                                                } 
                                                            >
                                                                Delete
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Grid>
                                        </Grid>
                                    </CardActionArea>
                                </Card>
                            </div>
                        ))}
                    </Masonry>
                ) : (
                    <div 
                        className="no-menu-message-container"
                    >
                        <img 
                            src='/oops!.png' 
                            alt="No menu available" 
                            className="food-image-restaurant-view" 
                        />
                        <Typography 
                            className="no-menu-message"
                        >
                            No restaurant is added yet.
                        </Typography>
                    </div>        
                )
            }     
            <Box 
                className="homepage-restaurant-pagination"
            >
                <Pagination 
                    count={Math.ceil(restaurants.length / PER_PAGE)} 
                    onChange={handlePagination} 
                    variant="outlined" 
                    classes={{ ul: classesStyle.ul }} 
                />
            </Box>
        </ThemeProvider>
    );
}

export default withStyles(styles)(HomepageRestaurant);