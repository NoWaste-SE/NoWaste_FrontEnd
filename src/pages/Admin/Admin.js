import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, createTheme, Divider, Grid, Icon, InputAdornment, MenuItem, TextField, ThemeProvider, Typography, withStyles,CssBaseline ,BottomNavigation ,BottomNavigationAction ,Paper ,List ,ListItem ,ListItemAvatar ,ListItemText,NavigationIcon ,Fab } from "@material-ui/core";
import './Admin.css';
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as MU from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Collapse } from "@mui/material";
import { Alert } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PersonIcon from '@mui/icons-material/Person';
import SendIcon from '@mui/icons-material/Send';
import LogoutIcon from '@mui/icons-material/Logout';

const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46',
        },
        secondary: {
            main: '#a44704',
        }
    }
});

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
};

const ExpandMore = MU.styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
    }),
}));

function getRandomColor() {
    const colors = ['#3b5d8c', '#29a666', '#a029a6', '#d5e036', '#e05536', '#e0366c', '#e036c1', '#369fe0', '#36e0bb', '#5ee036', '#e09f36', '#827878'];
    return colors[Math.floor(Math.random() * colors.length)];
};


export default function Admin() {
    const [loading, setLoading] = useState(true);
    const [managers, setManagers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [seeRestaurants, setSeeRestaurants] = React.useState([]);
    const [avatarColors, setAvatarColors] = React.useState([]);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertSeverity, setAlertSeverity] = useState('');
    const token = localStorage.getItem('token');
    const [value, setValue] = useState(0);
    const ref = React.useRef(null);

    useEffect(() => {
        axios.get(
            'http://188.121.124.63/user/admin-profile/',
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setManagers(response.data.Managers);
            console.log(response.data);
            setRequests(response.data.Requests);
            setLoading(false);
        })
        .catch(error => console.log(error));
    }, []);

    useEffect(() => {
        for (let i = 0; i < managers.length; i++) {
            const temp = avatarColors;
            temp.push(getRandomColor());
            setAvatarColors(temp);
        };
        const expand = Array(managers.length).fill(false);
        setSeeRestaurants(expand);
    }, [managers]);

    const handleSeeRestaurants = (index) => {
        setSeeRestaurants(prevState => {
            const temp = [...prevState];
            temp[index] = !temp[index];
            return temp;
        });
    };

    const handleReject = (id) => {
        axios.get(`http://188.121.124.63/user/temp-manager-reject/${id}`,
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }})
        .then(() => {
            console.log("rejected successfully");
            setAlertMessage("Manager has been rejected!");
            setAlertSeverity("success");
        })
        .catch((error) => {
            if (error.request) {
                setAlertMessage("Network error! Please try again later.");
                setAlertSeverity("error");
            } else {
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            }
        })
    };

    const handleAccept = (email, name) => {
        const userData = {
            name: name,
            email: email
        };
        axios.post(`http://188.121.124.63/user/temp-manager-confirm/`,
            userData,
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "POST,PUT",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }})
        .then(() => {
            console.log("accepted successfully");
            setAlertMessage("Manager has been accepted!");
            setAlertSeverity("success");
            setRequests(prevRequests => prevRequests.filter(request => request.email !== email));
        })
        .catch((error) => {
            if (error.request) {
                setAlertMessage("Network error! Please try again later.");
                setAlertSeverity("error");
            } else {
                setAlertMessage("A problem has been occured! Please try again later.");
                setAlertSeverity("error");
            }
        });
    };

    function truncateDescription(description, maxLength) {
        if (description.length > maxLength) {
            return `${description.substring(0, maxLength)}...`;
        }
        return description;
    }
    
    const handleReloadPage = () => {
        window.location.reload();
    };

    useEffect(() => {
        if(alertMessage !== "" && alertSeverity !== "") {
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
    


    function SeeManagers(props) {
        return(
            <div>
                <Typography
                    variant="h4"
                    color="textPrimary"
                    className="adimin-title"
                    sx={{ textAlign: 'center' }}
                >
                    Managers
                </Typography>
                    {props.managers.map((manager, index) => (
                        <Box
                            className="manager-details"
                            key={index}
                        >
                            <Grid container style={{marginTop:'2%'}}>
                                <Grid item md={3} sm={3} xs={3}
                                    className="admin-info-avatar"
                                >
                                    <Avatar
                                        src={manager.manager_image}
                                        className="avatar"
                                        style={{ backgroundColor: avatarColors[index] }}
                                    />                                            
                                </Grid>
                                <Grid item md={9} sm={9} xs={9}
                                    className="admin-info"
                                >
                                    <Typography className="info-text">
                                        <span className="info-label">Manager Name:</span>{" "}
                                        {manager.name}
                                    </Typography>
                                    <Typography className="info-text">
                                        <span className="info-label">Email address:</span>{" "}
                                        {manager.email}
                                    </Typography>
                                    <Typography className="info-text">
                                        <span className="info-label">Phone number:</span>{" "}
                                        {manager.number != null ? manager.number : "-"}
                                    </Typography>
                                    <Typography className="restaurants">
                                        {seeRestaurants[index] ? (
                                            <>
                                            Hide restaurants{" "}
                                            <ExpandMore
                                                expand={seeRestaurants[index]}
                                                onClick={() => handleSeeRestaurants(index)}
                                                aria-expanded={seeRestaurants[index]}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon />
                                            </ExpandMore>
                                            </>
                                        ) : (
                                            <>
                                            See restaurants{" "}
                                            <ExpandMore
                                                expand={seeRestaurants[index]}
                                                onClick={() => handleSeeRestaurants(index)}
                                                aria-expanded={seeRestaurants[index]}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon />
                                            </ExpandMore>
                                            </>
                                        )}
                                    </Typography>
                                    <Collapse
                                        in={seeRestaurants[index]}
                                        timeout='auto'
                                        unmountOnExit
                                        key={index}
                                    >
                                        {manager.restaurants.map((restaurant, index) => (
                                            <Box 
                                                className="restaurant-box"
                                            >
                                                <Grid container spacing={2}>
                                                    <Grid item md={4}>
                                                        <img 
                                                            className="restaurant-image"
                                                            src={restaurant.restaurant_image}
                                                        />
                                                    </Grid>
                                                    <Grid item md={8}>
                                                        <Typography className="info-text">
                                                            <span className="info-label">Name:</span>{" "}
                                                            {restaurant.name}
                                                        </Typography>
                                                        <Typography className="info-text">
                                                            <span className="info-label">Address:</span>{" "}
                                                            {restaurant.address}
                                                        </Typography>
                                                        <Typography className="info-text">
                                                            <span className="info-label">Phone number:</span>{" "}
                                                            {restaurant.number}
                                                        </Typography>
                                                        <Typography className="info-text">
                                                            <span className="info-label">Rate:</span>{" "}
                                                            {restaurant.rate}
                                                        </Typography>
                                                        <Typography className="info-text">
                                                            <span className="info-label">Discount:</span>{" "}
                                                            {restaurant.discount*100}%
                                                        </Typography>
                                                        <Typography className="info-text">
                                                            <span className="info-label">Date:</span>{" "}
                                                            {restaurant.date_of_establishment}
                                                        </Typography>
                                                        <Typography className="info-text">
                                                            <span className="info-label">Description:</span>{" "}
                                                            {truncateDescription(restaurant.description, 100)}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        ))}
                                    </Collapse>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
            </div>       
        )
    } 
    
    function SeeRequests(props) {
        return(
            <div>
                <Typography
                    variant="h4"
                    color="textPrimary"
                    gutterBottom
                    className="adimin-title"
                    sx={{ textAlign: 'center' }}
                >
                    Requests
                </Typography>
                    {props.requests.map((request, index) => (
                        <Box
                            className="request-details requests"
                            key={index}
                        >
                            <Grid container spacing={3}>
                                <Grid item md={8} sm={12}
                                    className="admin-info"
                                >
                                    <Typography className="info-text">
                                        <span className="info-label">Name:</span>{" "}
                                        {request.name}
                                    </Typography>
                                    <Typography className="info-text">
                                        <span className="info-label">Email address:</span>{" "}
                                        {request.email}
                                    </Typography>
                                </Grid>
                                <Grid item md={2}
                                    className="info"
                                >
                                    <Button
                                        className="request-button reject"
                                        onClick={() => handleReject(request.id)}
                                    >
                                        Reject
                                    </Button>
                                </Grid>
                                <Grid item md={2}
                                    className="admin-info"
                                >
                                    <Button
                                        className="request-button accept"
                                        onClick={() => handleAccept(request.email, request.name)}
                                    >
                                        Accept
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
            {/* </Grid> */}
            </div>
        )
    }  
    
    return (
        <ThemeProvider theme={theme}>
            <div>
                <ToastContainer />
            </div>
            {loading ? (
                <PulseLoader
                type="bars"
                color="black"
                speedMultiplier={1}
                className="loading"
                />
            ) : (
            
                <Grid container>
                    <Grid item md={6} sm={12} xs={12}>
                        <Box className='admin-main-box'>
                            <Box className='admin-box'>
                                <List>
                                    {value === 0 && <SeeManagers managers={managers} setManagers={setManagers} />}
                                    {value === 1 && <SeeRequests requests={requests} setRequests={setRequests} />}
                                </List>
                                
                            </Box>
                            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
                                <BottomNavigation
                                    showLabels
                                    value={value}
                                    onChange={(event, newValue) => {
                                        setValue(newValue);
                                    }}
                                >
                                    <BottomNavigationAction label="Managers" icon={<PersonIcon />} />
                                    <BottomNavigationAction label="Requests" icon={<SendIcon />} />
                                </BottomNavigation>
                            </Paper>
                        </Box>
                    </Grid>
                    <Grid container item md={6} sm={12} xs={12}>
                        <Grid item md={12} sm={12} xs={12} style={{display:'flex',justifyContent:'center',alignItems:'center'}} className='admin-img'>
                            <img 
                                style={{width: '60%'}}
                                src="/admin.png"   
                            />
                        </Grid>
                        <Grid item md={12} sm={12} xs={12} style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                            <Fab variant="extended" className="admin-logout">
                                <LogoutIcon sx={{ mr: 1 }} />
                                Logout
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
                
            )}
            </ThemeProvider>
        );
    }