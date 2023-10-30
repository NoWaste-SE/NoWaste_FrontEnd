import React from 'react';
import './RestaurantCard.css';
import { Card } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import {useHistory } from "react-router-dom";
import { useState } from 'react';
import { CardContent, CardMedia, Grid, Rating, CardActionArea } from '@mui/material';

const RestaurantCard = (props) => {
    const history = useHistory();
    const [rateValue, setRateValue] = React.useState(2.5);
    const [discount, setDiscount] = useState(20);

    const handleShow = () => {
        history.push(`restaurant-view/${props.id}/`);
    };

    return ( 
        <div>
            <Card 
                className={`homepage-custumer-card-restaurant${props.isSingleResult ? '-single' : ''}`} 
                onClick={handleShow} 
                style={{borderRadius: '15px'}}
            >
                <CardActionArea>
                    <div 
                        style={{ position: 'relative' }}
                    >
                        <CardMedia
                            component="img"
                            sx={{ height: 140, width: '100%', objectFit: 'cover' }}
                            image={props.restaurant_image}  
                        />
                        <div 
                            style={{
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
                            className='restaurant-card-animation'
                        >
                            {props.discount *100 + "%"}
                        </div>
                    </div>
                    <CardContent 
                        sx={{ height: 130}}
                        className='restaurant-card-animation'
                    >
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography 
                                    gutterBottom 
                                    className='restaurant-name-hemepage-customer'
                                >
                                    {props.name}
                                </Typography>
                            </Grid>
                            <Grid item 
                                sx={{ display: 'flex', alignItems: 'center', mt: '-5px' }}
                            >
                                <Rating 
                                    defaultValue={props.rate} 
                                    precision={0.5} 
                                    readOnly 
                                    size="small" 
                                />
                            </Grid>
                        </Grid>
                        <Typography 
                            className="description-homepage-customer" 
                            color="text.secondary"
                        >
                            {props.number}
                        </Typography>
                        <Typography 
                            className="description-homepage-customer" 
                            color="text.secondary"
                        >
                            {props.address}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

export default RestaurantCard;