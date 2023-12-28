import React, { useEffect, useState } from "react";
import { Button, Box, Grid, Typography, createTheme, Checkbox, Modal, ThemeProvider } from "@material-ui/core";
import './OrderPage.css';
import HeaderCustomer from "../../components/Header/HeaderCustomer";
import Footer from "../../components/Footer/Footer";
import PlaceIcon from '@mui/icons-material/Place';
import WalletIcon from '@mui/icons-material/Wallet';
import axios from 'axios';
import Map from "../../components/Map/Map";
import { ToastContainer, toast } from 'react-toastify';
import { useHistory, useParams } from "react-router-dom";
import MoneyIcon from '@mui/icons-material/Money';
import PulseLoader from "react-spinners/PulseLoader";

const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46',
        },
        secondary: {
            main: '#a44704',
        }
    },
})

export default function OrderPage(){
    const [shoppingCard, setShoppingCard] = useState([]);  
    const [orderItems, setOrderItems] = useState([]);
    const token = localStorage.getItem('token');
    const [checkAdd, setCheckAdd] = useState(true);
    const [prices, setPrices] = useState([]);
    const [balance, setBalance] = useState(localStorage.getItem('wallet_balance'));
    const val = JSON.parse(localStorage.getItem('email'));
    const [alertSeverity, setAlertSeverity] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const history = useHistory();
    const [paymentMethod, setPaymentMethod] = useState("wallet");
    const [status, setStatus] = useState();
    const [orderId, setOrderId] = useState();
    const {IdOfRestaurant} = useParams();
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    let role = localStorage.getItem("role");
    role = role.replace(/"/g, "");
    const id = localStorage.getItem("id");
    const mylocation = [lat, lng, parseInt(id), role];
    const restaurantId = localStorage.getItem('restaurantId');
    const userId = localStorage.getItem('id');
    const [showMap, setShowMap] = useState(false);
    const [blurBackground, setBlurBackground] = useState(false);
    const [loading, setLoading] = useState(true);
    const [thereis, setThereis] = useState(false);

    useEffect(() =>{
        axios.get(
            `http://188.121.124.63:8000/user/${id}/lat_long/` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,POST",
                'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            const data = response.data;
            setLat(data.lat);
            setLng(data.lon);
        })
        .catch((error) => console.log(error));
    },[]);

    const handleCheckAdd = () => {
        setCheckAdd(!checkAdd);
    };

    const handlePaymentMethod = (method) => {
        setPaymentMethod(method);
    };

    useEffect(()=>{
        axios.get(
            `http://188.121.124.63:8000/restaurant/restaurant_view/${IdOfRestaurant}/${userId}/order/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            if(response.data.length != 0)
            {
                console.log("here");
                setThereis(true);
                console.log(response.data[0]);
                setStatus(response.data[0].status);
                setShoppingCard(response.data[0].restaurantDetails);
                setOrderItems(response.data[0].orderItems);
                setPrices(response.data[0].Subtotal_Grandtotal_discount);
                setOrderId(response.data[0].id);
            }
            console.log("here2");
            setLoading(false);
        })
        .catch((error) => {
            // console.log(error);
            console.log("errorrrrr");
            setLoading(true);
        });
    },[]);

    useEffect(() => {
        if(alertMessage !== "" && alertSeverity !== ""){
            if(alertSeverity === "success"){
                toast.success(alertMessage, {
                    position: toast.POSITION.TOP_CENTER,
                    title: "Success",
                    autoClose: 7000,
                    onClose: () => {
                        history.push("/homepage-customer");
                    }
                });
            } else {
                toast.error(alertMessage, {
                    position: toast.POSITION.TOP_CENTER,
                    title: "Error",
                    autoClose: 7000
                })
            }
        }
    }, [alertMessage, alertSeverity]);

    const handlePayment = (e) => {
        e.preventDefault();
        const userStatus = {
            status: "InProgress"
        };
        axios.put(
            `http://188.121.124.63:8000/restaurant/restaurant_view/${IdOfRestaurant}/${userId}/order/${orderId}/`, 
            userStatus,
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PUT",
                'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            const userData = {
                email: val,
                amount: prices[1]
            };
            if(paymentMethod === "wallet"){
                axios.post(
                    "http://188.121.124.63:8000/user/withdraw-wallet/", 
                    userData, 
                    {headers: {
                        'Content-Type' : 'application/json',
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Methods" : "PUT,PATCH",
                        'Authorization' : "Bearer " + token.slice(1,-1)   
                    }}
                )
                .then((response) => {
                    const newBalance = response.data.wallet_balance;
                    localStorage.setItem('wallet_balance', newBalance);
                    setBalance(newBalance);
                    setAlertMessage("Payment successful! Thank you for your purchase.");
                    setAlertSeverity("success");
                })
                .catch((error) => {
                    if (error.response) {
                        setAlertMessage("An error occured. Please try again later.");
                        setAlertSeverity("error");
                        console.log(error);
                    }
                });
            } else{
                setAlertMessage("Order submitted successfully! Thank you for your purchase");
                setAlertSeverity("success");
            }}
        )
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
            } 
        }); 
    };
      
    const handleOpenMap = () => {
        setShowMap(true);
        setBlurBackground(true);
    };
        
    const handleCloseMap = () => {
        setShowMap(false);
        setBlurBackground(false);
    };
  
    return(
        <ThemeProvider theme={theme}>
            <HeaderCustomer />
            {thereis ? (
            <div 
                className={`container ${blurBackground ? 'blur-background' : ''}`}
            >
                <ToastContainer />
                <Grid container spacing={2} 
                    className="orderpage-root"
                >
                    {loading ? (
                        <PulseLoader
                        type="bars"
                        color="black"
                        speedMultiplier={1}
                        className="spinner-orderpage"
                        
                        />
                    ) : (
                    <Grid item lg={4} md={4} sm={12}>
                        <Box 
                            className="orderpage-box" 
                        >
                            <Typography variant="h5"
                                gutterBottom
                                className="orderpage-title"
                            >
                                Shopping Card
                            </Typography>
                            <div 
                                className="orderpage-details-div"
                            >
                                <Grid container spacing={2} 
                                    className="orderpage-grid" 
                                    id="orderpage-shopping-card"
                                >      
                                    {orderItems && orderItems.map((order_list)=>(
                                        <Grid container spacing={2} >
                                            <Grid item>
                                                <Typography 
                                                    className="order-food"
                                                >
                                                    {order_list.name_and_price.name}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography 
                                                    className="order-food"
                                                >
                                                    <span 
                                                        className="quantity"
                                                    >
                                                        {order_list.quantity} ×&nbsp;
                                                    </span>
                                                    {order_list.name_and_price.price}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        ))
                                    }
                                </Grid>
                            </div>
                            <hr 
                                className="hr-tag" 
                            />
                            <Grid container spacing={2} 
                                className="orderpage-grid"
                            >
                                <Grid item>
                                    <Typography 
                                        className="order-food"
                                    >
                                        Subtotal
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography 
                                        className="order-food"
                                    > 
                                        {prices[0]}$ 
                                    </Typography>        
                                </Grid>
                            </Grid>
                            <hr 
                                className="hr-tag" 
                            />
                            <Grid container spacing={2} 
                                className="orderpage-grid"
                            >
                                <Grid item>
                                    <Typography 
                                        className="order-food"
                                    >
                                        Discount
                                    </Typography>
                                </Grid>
                                <Grid item >
                                    <Typography 
                                        className="order-food"
                                    > 
                                        {prices[2]*100}% 
                                    </Typography>     
                                </Grid>
                            </Grid>
                            <hr 
                                className="hr-tag" 
                            />
                            <Grid container spacing={2} 
                                className="orderpage-grid"
                            >
                                <Grid item>
                                    <Typography 
                                        className="order-food"
                                    >
                                        Grand total
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography 
                                        className="order-food" 
                                        id="grand-total"
                                    > 
                                        {prices[1]}$ 
                                    </Typography>          
                                </Grid>
                            </Grid> 
                            <Button 
                                id='order-submit' 
                                onClick={handlePayment} 
                                disabled={prices[1] > balance} 
                                className={prices[1] > balance ? '' :'order-submit'}
                            >
                                Pay
                            </Button>
                        </Box>
                    </Grid>
                    )}
                    <Grid item lg={8} md={8} sm={12}>
                        <Box 
                            className="orderpage-box"
                        >
                            <Typography 
                                variant="h5"
                                gutterBottom
                                className="orderpage-title"
                            >
                                Shopping Info
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item>
                                    <Typography
                                        className="shopinfo-details-title"
                                    >
                                        Address
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button 
                                        className="button-change-address" 
                                        onClick={handleOpenMap}
                                    >
                                        Change Address
                                    </Button>
                                        <Modal 
                                            open={showMap} 
                                            onClose={handleCloseMap}
                                        >
                                            <Map 
                                                location={mylocation}
                                            />
                                        </Modal>
                                </Grid>
                            </Grid>
                            <Box 
                                className="orderpage-shopinfo-box"
                            >
                                <Grid container spacing={2}>
                                    <Grid item>
                                        <Typography 
                                            id="address-info"
                                        >
                                            <PlaceIcon 
                                                className="icon-order-page" 
                                            />
                                            {shoppingCard.address}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1.5}>
                                        <Checkbox
                                            className="orderpage-checkbox "
                                            defaultChecked
                                            disabled
                                            onClick={handleCheckAdd}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Typography
                                className="shopinfo-details-title"
                            >
                                Payment methods
                            </Typography>
                            <Box 
                                className="orderpage-shopinfo-box"
                            >
                                <Grid container spacing={2}>
                                    <Grid item >
                                        <Typography
                                            id="wallet-info" 
                                        >
                                            <WalletIcon 
                                                className="icon-order-page" 
                                            />
                                            Wallet
                                            <span 
                                                id="order-balance" 
                                            >
                                                Balance: {balance}$
                                            </span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1.5}>
                                        <Checkbox
                                            className="orderpage-checkbox"
                                            defaultChecked
                                            checked={paymentMethod === "wallet"}
                                            onClick={() => handlePaymentMethod("wallet")}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box 
                                className="orderpage-shopinfo-box"
                            >
                                <Grid container spacing={2}>
                                    <Grid item >
                                        <Typography 
                                            id="cash-info"
                                        >
                                            <MoneyIcon 
                                                className="icon-order-page" 
                                            />
                                            Cash on delivery
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1.5}>
                                        <Checkbox
                                            className="orderpage-checkbox"
                                            checked={paymentMethod === "cash"}
                                            onClick={() => handlePaymentMethod("cash")}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </div>
            ) : (
            loading ? (
                <PulseLoader
                type="bars"
                color="black"
                speedMultiplier={1}
                className="spinner-orderpage-whole"
                />
            ) : 
            (
                <div 
                    className="no-order-message-container"
                >
                    <h2 
                        className="no-order-message-order-page"
                    >
                        There is not any order!
                    </h2>
                </div>
            ))}
            <Footer />
        </ThemeProvider>
    )
}