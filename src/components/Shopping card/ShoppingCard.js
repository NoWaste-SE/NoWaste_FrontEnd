import React from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import "./ShoppingCard.css"

function ShoppingCard() {
  // Mock data for two restaurants
    const restaurants = [
        {
        id: 1,
        name: "KFC",
        image: "kfc.jpg",
        orders: [
            { itemName: "Chicken Burger", count: 2, price: 5.99 },
            { itemName: "Fries", count: 1, price: 2.49 },
        ],
        },
        {
        id: 2,
        name: "Pizza Hut",
        image: "pizzahut.jpg",
        orders: [
            { itemName: "Pepperoni Pizza", count: 1, price: 12.99 },
            { itemName: "Garlic Bread", count: 1, price: 4.99 },
        ],
        },
    ];

    return (
        <>
        {restaurants.map((restaurant) => (
            <Box key={restaurant.id} className="shopping-card-restaurant-box">
            <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={4} xs={12}>
                <img
                    className="shopping-card-image"
                    src={restaurant.image}
                    alt={restaurant.name}
                />
                </Grid>
                <Grid item lg={8} md={8} sm={8} xs={12}>
                <Typography className="shopping-card-name">
                    {restaurant.name}
                </Typography>
                <Grid container spacing={1}>
                    {restaurant.orders.map((order, index) => (
                    <>
                        <Grid item lg={12} md={8} sm={8} xs={12}>
                            <Typography>
                            ({order.count}) {order.itemName} - Price: ${order.price}
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
