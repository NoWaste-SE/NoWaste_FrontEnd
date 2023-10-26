import React, { useEffect, useState } from "react";
import './OrderPage.css';
import HeaderCustomer from "../components/HeaderCustomer";
import { ThemeProvider } from "@mui/styles";
import { Button, Box, Grid, Typography, createTheme, Checkbox } from "@material-ui/core";
import Footer from "../components/Footer";
import PlaceIcon from '@mui/icons-material/Place';
import WalletIcon from '@mui/icons-material/Wallet';
import axios from 'axios';
import Map from "../components/Map/Map";
import Modal from '@mui/material/Modal';
import { ToastContainer, toast } from 'react-toastify';
import {useHistory } from "react-router-dom";
import MoneyIcon from '@mui/icons-material/Money';
import { useParams } from 'react-router-dom';
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
    // const [checkPay, setCheckPay] = useState(true);
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
    const [loading, setLoading] = useState(true);

    //getting the lt and lng of map
    useEffect(() =>{
        axios.get(
            `http://188.121.124.63/user/${id}/lat_long/` , 
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,POST",
                'Authorization' : "Token " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            console.log("got Lat and Lng!");
            console.log(response.data);
            const data = response.data;
            console.log(data);
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

    const restaurantId = localStorage.getItem('restaurantId');
    console.log(restaurantId);
    const userId = localStorage.getItem('id');
    console.log("user:", userId);
    // const restaurantId =1;
    // const userId=5;
    useEffect(()=>{
        axios.get(`http://188.121.124.63/restaurant/restaurant_view/${IdOfRestaurant}/${userId}/order/`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
            .then((response) => {
                console.log(response.data);
                // console.log("oredrs",response.data[0]);
                // console.log("prices", response.data[0].Subtotal_Grandtotal_discount);
                // console.log("items: " , response.data[0].orderItems)
                setStatus(response.data[0].status);
                setShoppingCard(response.data[0]);
                setOrderItems(response.data[0].orderItems);
                setPrices(response.data[0].Subtotal_Grandtotal_discount);
                console.log("prices", response.data[0].Subtotal_Grandtotal_discount);
                setOrderId(response.data[0].id);
                setLoading(false);
            
            })
            .catch((error) => {
            console.log(error.response);
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
                console.log("successfully added");
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
        //for changing the status
        const userStatus = {
            status: "InProgress"
        };
        axios.put(`http://188.121.124.63/restaurant/restaurant_view/${IdOfRestaurant}/${userId}/order/${orderId}/`, userStatus,
        {headers :{
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "GET,PUT",
            'Authorization' : "Token " + token.slice(1,-1)
        }})
        .then((response) => {
            console.log(response);
            //for reducing the wallet
            const userData = {
                email: val,
                amount: prices[1]
            };
            console.log(userData);
            console.log(val);
            if(paymentMethod === "wallet"){
                axios.post("http://188.121.124.63/user/withdraw-wallet/", userData, 
                    {headers: {
                        'Content-Type' : 'application/json',
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Methods" : "PUT,PATCH",
                        'Authorization' : "Token " + token.slice(1,-1)   
                    }})
                .then((response) => {
                    console.log(response);
                    const newBalance = response.data.wallet_balance;
                    localStorage.setItem('wallet_balance', newBalance);
                    setBalance(newBalance);
                    //add alert
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
            }
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                } 
            }); 
    };
  
    const [showMap, setShowMap] = useState(false);
    const [blurBackground, setBlurBackground] = useState(false);
    
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
            <div className={`container ${blurBackground ? 'blur-background' : ''}`}>
                <ToastContainer />
                <Grid container spacing={2} sx={{paddingBottom: "1%"}} className="orderpage-root">
                    {loading ? (
                        <PulseLoader
                        type="bars"
                        color="black"
                        speedMultiplier={1}
                        className="spinner-orderpage"
                        />
                    ) : (
                    <Grid item lg={4} md={4} sm={12} style={{paddingLeft: "3%"}}>
                        <Box className="orderpage-box" style={{justifyContent: 'space-between'}}>
                            <Typography variant="h5"
                                gutterBottom
                                className="orderpage-title"
                            >
                                Shopping Card
                                {/* <span style={{color:"#E74C3C"}}>(2)</span> */}
                            </Typography>
                            <div className="orderpage-details-div">
                                <Grid container spacing={2} className="orderpage-grid" id="orderpage-shopping-card">      
                                    {orderItems && orderItems.map((order_list)=>(
                                        <Grid container spacing={2} >
                                            <Grid item>
                                                <Typography className="order-food">{order_list.name_and_price.name}</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography className="order-food">
                                                    <span  style={{color: '#8a8686'}}>{order_list.quantity} × </span>
                                                    {order_list.name_and_price.price}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        ))
                                    }
                                </Grid>
                            </div>
                            <hr className="hr-tag" />
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography className="order-food">Subtotal</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography className="order-food"> {prices[0]}$ </Typography>        
                                </Grid>
                            </Grid>
                            <hr className="hr-tag" />
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography className="order-food">Discount</Typography>
                                </Grid>
                                <Grid item >
                                    <Typography className="order-food"> {prices[2]*100}% </Typography>     
                                </Grid>
                            </Grid>
                            <hr className="hr-tag" />
                            <Grid container spacing={2} className="orderpage-grid">
                                <Grid item>
                                    <Typography className="order-food">Grand total</Typography>
                                </Grid>
                                <Grid item>
                                    <Typography className="order-food" id="grand-total"> {prices[1]}$ </Typography>          
                                </Grid>
                            </Grid> 
                            <Button id='order-submit' onClick={handlePayment} disabled={prices[1] > balance} className={prices[1] > balance ? '' :'order-submit'}>
                                Pay
                            </Button>
                        </Box>
                    </Grid>
                    )}
                    <Grid item lg={8} md={8} sm={12} style={{paddingLeft: "2%"}}>
                        <Box className="orderpage-box">
                            <Typography variant="h5"
                                gutterBottom
                                className="orderpage-title"
                            >
                                Shopping Info
                            </Typography>
                            <Grid container spacing={2} >
                                <Grid item>
                                    <Typography
                                        style={{alignSelf: 'flex-start', fontSize: '19px', marginLeft:'10%'}}
                                    >
                                        Address
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Button className="button-change-address" onClick={handleOpenMap}>
                                        Change Address
                                    </Button>
                                        <Modal open={showMap} onClose={handleCloseMap}>
                                            <Map location = {mylocation}/>
                                        </Modal>
                                </Grid>
                            </Grid>
                            <Box className="orderpage-shopinfo-box">
                                <Grid container spacing={2}>
                                    <Grid item xs={10}>
                                        <Typography style={{ display: "flex", marginLeft:'1px'}}>
                                            <PlaceIcon className="icon-order-page" style={{paddingLeft:"6px"}}/>
                                            <span style={{ flex: 1 , marginLeft: '-50%'}}>{shoppingCard.userAddress}</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1.5} justifyContent="flex-end">
                                    <Checkbox
                                        style={{ color: "green" , marginTop:"-22%"}}
                                        className="checkbox-orderpage"
                                        defaultChecked
                                        disabled
                                        onClick={handleCheckAdd}
                                    />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Typography
                                style={{alignSelf: 'flex-start', fontSize: '19px', marginTop: "30px", marginLeft:'1%'}}
                            >
                                Payment methods
                            </Typography>
                            <Box className="orderpage-shopinfo-box">
                                <Grid container spacing={3}>
                                    <Grid item xs={2}>
                                        <Typography style={{ display: "flex", marginLeft:'2px'}}>
                                            <WalletIcon className="icon-order-page" style={{paddingRight:"8px" , paddingLeft:"8px"}}/>
                                            <span style={{ flex: 1 }}>Wallet</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            <span className="order-balance" style={{ flex: 1 , marginLeft: '-115%'}}>Balance: {balance}$</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1.5} justifyContent="flex-end">
                                        <Checkbox
                                            style={{ color: "green" , marginTop:"-22%"}}
                                            className="checkbox-orderpage"
                                            defaultChecked
                                            // disabled
                                            checked={paymentMethod === "wallet"}
                                            onClick={() => handlePaymentMethod("wallet")}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box className="orderpage-shopinfo-box">
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <Typography style={{ display: "flex", marginLeft:'2px'}}>
                                            <MoneyIcon className="icon-order-page" style={{paddingRight:"8px" , paddingLeft:"8px"}}/>
                                            <span style={{ flex: 1 , marginLeft: "-30px"}}>Cash on delivery</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={1.5} justifyContent="flex-end">
                                        <Checkbox
                                            style={{ color: "green" , marginTop:"-22%"}}
                                            className="checkbox-orderpage"
                                            // defaultChecked
                                            // disabled
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
            <Footer />
        </ThemeProvider>
    )
}