import React, { useEffect, useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./ShoppingCard.css";
import { SubmitButton, CancelButton } from "../CustomButtons/CustomButtons";

function ShoppingCard() {
    const token = localStorage.getItem("token");
    const [loading, setLoading] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const userid = localStorage.getItem("id");
    const history = useHistory();
    const [thereis, setThereis] = useState(false);

    useEffect(() => {
        axios.get(
            `http://188.121.124.63:8000/restaurant/cart/${userid}`, 
            {headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PATCH',
                'Authorization': 'Bearer ' + token?.slice(1, -1),
            }}
        )
        .then((response) => {
            if(response.data[0].orders.length != 0){
                console.log("here");
                console.log(response.data[0].orders);
                setAllOrders(response.data[0].orders);
                console.log(userid);
                setLoading(false);
                setThereis(true);
            }
            setLoading(false);
            console.log(thereis);
        })
        .catch((error) => {
            console.log(error);
            setLoading(true);
        });
    }, []);

    const handleContinueShopping = (id) => {
        history.push(`/restaurant-view/${id}/`);
    }

    const handleDeleteShopping = (idR, uuid) => {  
            axios.delete(
                `http://188.121.124.63:8000/restaurant/restaurant_view/${idR}/${userid}/order/${uuid}`, 
                {headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'Delete',
                    'Authorization': 'Bearer ' + token?.slice(1, -1),
                }}
            )
            .then((response) => {
                console.log(response);
                window.location.reload(false);
            })
            .catch((error) => {
                console.log(error);
            }); 
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
        thereis ? (allOrders.map((restaurant) => (
            <Box key={restaurant.restaurantDetails.id} className="shopping-card-restaurant-box">
            <Grid container spacing={2}>
                <Grid item lg={4} md={4} sm={4} xs={12}>
                <img
                    className="shopping-card-image"
                    src={restaurant.restaurantDetails.restaurant_image}
                    alt={restaurant.restaurantDetails.name}
                />
                </Grid>
                <Grid item lg={8} md={8} sm={8} xs={12}>
                <Grid container spacing={1}>
                    <Typography 
                        className="shopping-card-name"
                    >
                        {restaurant.restaurantDetails.name}
                    </Typography>
                    {restaurant.orderDetails.orderItems.map((order, index) => (
                    <>
                    <Grid item lg={12} md={8} sm={8} xs={12} key={index}>
                        <Typography 
                            className="shopping-card-order"
                        >
                            {order.name_and_price.name} 
                            <span 
                                className="shopping-card-quantity"
                            >
                                ×{order.quantity}
                            </span>
                            <span 
                                className="shopping-card-price"
                            >
                                ${order.quantity * order.name_and_price.price} 
                            </span>
                        </Typography>
                        {index !== restaurant.orderDetails.orderItems.length - 1 && <div className="line"></div>}
                    </Grid>
                    </>
                    ))}
                    <Grid container spacing={1} 
                        className="buttons-container-shopping-card"
                    >
                        <Grid item xs={12} 
                            className="buttons-container-shopping-card"
                        >
                            <SubmitButton
                                variant={"contained"}
                                type={"submit"}
                                onClick={() => handleContinueShopping(restaurant.restaurantDetails.id)}
                                title={"Continue"}
                                customWidth={"auto"}
                            />
                            <CancelButton
                                variant={"contained"}
                                type={"submit"}
                                onClick={() => handleDeleteShopping(restaurant.restaurantDetails.id, restaurant.orderDetails.id)}
                                title={"Delete"}
                                customWidth={"auto"}
                            />
                            {/* <button 
                                className="action-button-shopping-card button-1" 
                                onClick={() => handleContinueShopping(restaurant.restaurantDetails.id)}
                            >
                                Continue
                            </button> */}
                            {/* <button 
                                className="action-button-shopping-card button-2"
                                onClick={() => handleDeleteShopping(restaurant.restaurantDetails.id, restaurant.orderDetails.id)}
                            >
                                Delete
                            </button> */}
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
