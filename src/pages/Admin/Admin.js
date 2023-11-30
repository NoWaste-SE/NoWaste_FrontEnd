import React, { useEffect, useState } from "react";
import { Avatar, Box, Button, createTheme, Divider, Grid, Icon, InputAdornment, MenuItem, TextField, ThemeProvider, Typography, withStyles } from "@material-ui/core";
import './Admin.css';
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as MU from '@mui/material';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Collapse } from "@mui/material";

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

    useEffect(() => {
        axios.get(
            'http://188.121.124.63/user/admin-profile/',
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
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

    return (
        <ThemeProvider theme={theme}>
            {loading ? (
                <PulseLoader
                    type="bars"
                    color="black"
                    speedMultiplier={1}
                    className="loading"
                />
            ) : (
                <Grid container spacing={3} 
                    className="admin-container"
                >
                    <Grid item md={6}>
                        <Typography
                            variant="h4"
                            color="textPrimary"
                            gutterBottom
                            className="title"
                        >
                            Managers
                        </Typography>
                        {managers.map((manager, index) => (
                            <Box
                                className="manager-details"
                                key={index}
                            >
                                <Grid container spacing={2}>
                                    <Grid item md={3}
                                        className="info"
                                    >
                                        <Avatar
                                            src={manager.manager_image}
                                            className="avatar"
                                            style={{ backgroundColor: avatarColors[index] }}
                                        />                                            
                                    </Grid>
                                    <Grid item md={9}
                                        className="info"
                                    >
                                        <Typography>
                                            Name: {manager.name}
                                        </Typography>
                                        <Typography>
                                            Email address: {manager.email}
                                        </Typography>
                                        <Typography>
                                            Phone number: {manager.number != null ? manager.number : "-"}
                                        </Typography>
                                        <Typography 
                                            className="restaurants"
                                        >
                                            See restaurants 
                                            <ExpandMore
                                                expand={seeRestaurants[index]}
                                                onClick={() => handleSeeRestaurants(index)}
                                                aria-expanded={seeRestaurants[index]}
                                                aria-label="show more"
                                            >
                                                <ExpandMoreIcon />
                                            </ExpandMore>
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
                                                            <Typography>
                                                                Name: {restaurant.name}
                                                            </Typography>
                                                            <Typography>
                                                                Address: {restaurant.address}
                                                            </Typography>
                                                            <Typography>
                                                                Phone number: {restaurant.number}
                                                            </Typography>
                                                            <Typography>
                                                                Rate: {restaurant.rate}
                                                            </Typography>
                                                            <Typography>
                                                                Discount: {restaurant.discount*100}%
                                                            </Typography>
                                                            <Typography>
                                                                Establishment date: {restaurant.date_of_establishment}
                                                            </Typography>
                                                            <Typography>
                                                                Description: {restaurant.description}
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
                    </Grid>
                    <Grid item md={1}>
                        <Divider 
                            className="divider"
                            orientation="vertical" 
                        />
                    </Grid>
                    <Grid item md={5}
                        id="requests"
                    >
                        <Typography
                            variant="h4"
                            color="textPrimary"
                            gutterBottom
                            className="title"
                        >
                            Requests
                        </Typography>
                        {requests.map((request, index) => (
                            <Box
                                className="request-details requests"
                                key={index}
                            >
                                <Grid container spacing={3}>
                                    <Grid item md={8} sm={12}
                                        className="info"
                                    >
                                        <Typography>
                                            Full name: {request.name}
                                        </Typography>
                                        <Typography>
                                            Email address: {request.email}
                                        </Typography>
                                    </Grid>
                                    <Grid item md={2}
                                        className="info"
                                    >
                                        <Button
                                            className="request-button reject"
                                        >
                                            Reject
                                        </Button>
                                    </Grid>
                                    <Grid item md={2}
                                        className="info"
                                    >
                                        <Button
                                            className="request-button accept"
                                        >
                                            Accept
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                    </Grid>
                </Grid>
            )}
        </ThemeProvider>
    )
}