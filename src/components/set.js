import * as React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
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
import ShowComment from '../components/ShowComment';
import { useEffect } from 'react';
import { react } from '@babel/types';
import { Avatar, BottomNavigation, BottomNavigationAction, CardActions, CardContent, CardHeader, CardMedia, Chip, Collapse, Grid, Rating } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const RestaurantCard = () => {
    const history = useHistory();
    const [rateValue, setRateValue] = React.useState(2.5);
    const handleclick = () => {
    }
    return ( 
        <>
        {
        /* <div>
            <Card className='card-restaurant-homepage'>
                <Grid container spacing={1}>
                    <Grid item>
                        <CardMedia 
                            component="img"
                            src='/mohsen.jpg'
                            alt='restaurant'
                        />
                    </Grid>
                    <Grid item>
                        <CardHeader 
                            title="Name"
                            subheader="2023-05-02"
                            className='header-restaurant-homepage'
                        />
                        <CardActions disableSpacing>
                            <Rating name='read-only' readOnly className='rating-restaurant-homepage' value={rateValue}/>
                        </CardActions>
                        <CardContent>
                            <Typography className='description-restaurant-homepage'>
                                Description
                            </Typography>
                        </CardContent>
                        <CardContent>
                        <Button className='showmore-restaurant-homepage'>See More</Button>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </div> */}
        <Card className='card-restaurant-homepage'>
        {/* <div className='Container-card'> */}
            
        <CardMedia 
            component="img"
            src='/mohsen.jpg'
            alt='restaurant'
        />
            <div className='Containerwithoutimg'>
            <div className='nameandrating'> <div style={{fontSize: "large"}}>Name</div>
            <Rating style={{fontSize: 'large', marginLeft: "60px", marginTop:"3px"}} readOnly value={rateValue}/></div>
            <div className='Desc'>Lorem ipsum dolor sit amet consectetur</div>
            <hr className='hr-homepage'></hr>
            <div className='Discountandmore'><div className='Discount'>Discount</div><div className='seemore'><a href='http://google.com'> <font style={{color: 'black'}}>See More</font></a></div></div>
            </div>
        
        </Card>
        </>


        
   );
}

export default RestaurantCard;