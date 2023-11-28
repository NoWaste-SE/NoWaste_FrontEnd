import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./ShoppingCard.css";

function ShoppingCard() {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios.get(
            `http://188.121.124.63/user/orders/`, 
            {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PATCH',
                'Authorization': 'Bearer ' + token.slice(1, -1),
            }}
        )
        .then((response) => {
            console.log(response);
            setAllOrders(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error);
            setLoading(true);
        });
    }, []);

    const handleContinueShopping = (id) => {
        history.push(`/restaurant-view/${id}/`);
    }

    const handleDeleteShopping = () => {  
    }
    return (
        <>
        {loading ? (
            <PulseLoader
            type="bars"
            color="black"
            speedMultiplier={1}
            className="spinner-shopping-card"
            />
        ) : (
        allOrders ? (allOrders.map((restaurant) => (
            <Box key={restaurant.restaurant.id} className="shopping-card-restaurant-box">
            <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={4} xs={12}>
                <img
                    className="shopping-card-image"
                    src={restaurant.restaurant.restaurant_image}
                    alt={restaurant.restaurant.name}
                />
                </Grid>
                <Grid item lg={8} md={8} sm={8} xs={12}>
                <Grid container spacing={1}>
                    <Typography 
                        className="shopping-card-name"
                    >
                        {restaurant.restaurant.name}
                    </Typography>
                    {restaurant.items.map((order, index) => (
                    <>
                    <Grid item lg={12} md={8} sm={8} xs={12} key={index}>
                        <Typography 
                            className="shopping-card-order"
                        >
                            {order.item.name} 
                            <span 
                                className="shopping-card-quantity"
                            >
                                ×{order.quantity}
                            </span>
                            <span 
                                className="shopping-card-price"
                            >
                                ${order.total_price_after_discount} 
                            </span>
                        </Typography>
                        {index !== restaurant.items.length - 1 && <div className="line"></div>}
                    </Grid>
                    </>
                    ))}
                    <Grid container spacing={1} 
                        className="buttons-container-shopping-card"
                    >
                        <Grid item xs={12} 
                            className="buttons-container-shopping-card"
                        >
                            <button 
                                className="action-button-shopping-card button-1" 
                                onClick={() => handleContinueShopping(restaurant.restaurant.id)}
                            >
                                Continue
                            </button>
                            <button 
                                className="action-button-shopping-card button-2"
                                onClick={handleDeleteShopping}
                            >
                                Delete
                            </button>
                        </Grid>
                    </Grid>
                </Grid>
                </Grid>
            </Grid>
            </Box>
        ))) : (
            <div 
                className="no-order-message-container"
            >
                <img 
                    src='/oops!.png' 
                    alt="No order available" 
                    className="food-image-restaurant-view" 
                />
                <h2 
                    className="no-order-message"
                >
                    No order is available.
                </h2>
            </div>
        ))}
        </>
    );
}

export default ShoppingCard;
