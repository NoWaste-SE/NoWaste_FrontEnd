import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import axios from "axios";
import "./ShoppingCard.css";

function ShoppingCard() {
    const token = localStorage.getItem("token");
    const [allOrders, setAllOrders] = useState([]);
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
            setAllOrders(response.data);
        })
        .catch((error) => {
            console.log(error)});
    }, []);

    return (
        <>
        {allOrders.map((restaurant) => (
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
                <Typography className="shopping-card-name">
                    {restaurant.restaurant.name}
                </Typography>
                <Grid container spacing={1}>
                    {restaurant.items.map((order, index) => (
                    <>
                        <Grid item lg={12} md={8} sm={8} xs={12}>
                            <Typography>
                            ({order.quantity}) {order.item.name} - Price: ${order.total_price_after_discount}
                            </Typography>
                        </Grid>
                    </>
                    ))}
                </Grid>
                </Grid>
            </Grid>
            </Box>
        ))}
        </>
    );
}

export default ShoppingCard;
