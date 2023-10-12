import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { yellow } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import './RestaurantCard.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccountCircle } from '@material-ui/icons';
import Masonry from 'react-masonry-css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Food from '../components/Food';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import NavigationIcon from '@material-ui/icons/Navigation';
import { Button, Card } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useHistory } from "react-router-dom";
import Header from '../components/Header';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { react } from '@babel/types';
import { Avatar, BottomNavigation, BottomNavigationAction, CardActions, CardContent, CardHeader, CardMedia, Chip, Collapse, Grid, Rating } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import CardActionArea from '@mui/material/CardActionArea';
import Icon from '@mui/material/Icon';
import DiscountIcon from '@mui/icons-material/Discount';
import StarRateIcon from '@mui/icons-material/StarRate';

const RestaurantCard = (props) => {
    const history = useHistory();
    const [rateValue, setRateValue] = React.useState(2.5);
    const [discount, setDiscount] = useState(20);
    // localStorage.setItem('restaurantId', props.id);



    const handleShow = () => {
        history.push(`restaurant-view/${props.id}/`);
    }
    console.log(props.isSingleResult);
    return ( 
        <div>
        {/* <Card className= 'homepage-custumer-card-restaurant' onClick={handleShow}> */}
        <Card className={`homepage-custumer-card-restaurant${props.isSingleResult ? '-single' : ''}`} onClick={handleShow} style={{borderRadius: '15px'}}>
            <CardActionArea>
                <div style={{ position: 'relative' }}>
                    <CardMedia
                        component="img"
                        sx={{ height: 140, width: '100%', objectFit: 'cover' }}
                        // image="/mohsen.jpg"        
                        image={props.restaurant_image}  
                        // title={food.Type}
                    />
                    <div style={{
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        backgroundColor: '#E74C3C',
                        color: 'white',
                        padding: '5px',
                        width: '38px',
                        height: '20px',
                        fontSize: '20px'
                        }}
                    >
                        {/* {discount + "%"} */}
                        {props.discount *100 + "%"}
                    </div>
                </div>
                <CardContent sx={{ height: 130}}>
                    <Grid container spacing={2}>
                        <Grid item>
                            <Typography gutterBottom className='restaurant-name-hemepage-customer'>
                                {props.name}
                            </Typography>
                        </Grid>
                        <Grid item sx={{ display: 'flex', alignItems: 'center', mt: '-5px' }}>
                            <Rating defaultValue={props.rate} precision={0.5} readOnly size="small" />
                            {/* <Typography 
                            // style={{marginLeft: '75%', marginTop: '-10%', fontSize: '1em'}}
                                sx={{
                                    marginLeft: 'auto',
                                    fontSize: '1.5em',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }}
                            >
                                {props.rate}
                                <StarRateIcon className='startIcon-homepage' style={{ color: '#faaf00', }} />
                            </Typography> */}
                        </Grid>
                    </Grid>
                    {/* <Typography className="description-homepage-customer" color="text.secondary">{props.description}</Typography>  */}
                    <Typography className="description-homepage-customer" color="text.secondary">{props.number}</Typography>
                    <Typography className="description-homepage-customer" color="text.secondary">{props.address}</Typography>
                </CardContent>
            </CardActionArea>
            {/* <CardActions>
            </CardActions> */}
        </Card>
    </div>
    );
}

export default RestaurantCard;