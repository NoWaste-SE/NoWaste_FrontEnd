import React, { useEffect, useState } from "react";
import {Box, createTheme, Grid, IconButton, Tooltip, ThemeProvider, Typography} from "@material-ui/core";
// import '../../pages/Edit Profile/EditProfile.css';
import HeaderRestaurant from '../Header/HeaderRestaurant';
import 'react-phone-input-2/lib/style.css';
import axios from "axios";
import Footer from "../Footer/Footer";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import './Dashboard.css';
import { useMemo } from "react";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
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
});

function createData(name, customer_name, customer_email, order, price, date, status, restaurant_id, order_id) {
    return {
        name,
        customer_name,
        customer_email,
        order,
        price,
        date,
        status,
        restaurant_id,
        order_id
    };
}  

export default function DashboardRestaurant(){
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const [orderHistory, setOrderHistory] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;
    const [rows, setRows] = useState([]);
    const rowsWithIndex = rows.map((row, index) => ({ ...row, index }));
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const ordersToShow = rowsWithIndex.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(rowsWithIndex.length / ordersPerPage);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({ field: null, direction: 'asc' });

    const handleSort = (field) => {
        const newSortConfig = { field, direction: 'asc' };
        if (sortConfig.field === field && sortConfig.direction === 'asc') {
            newSortConfig.direction = 'desc';
        }
        setSortConfig(newSortConfig);
    };

    const sortedData = useMemo(() => {
        if (sortConfig.field) {
            const compareFunction = (a, b) => {
                if (a[sortConfig.field] < b[sortConfig.field]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.field] > b[sortConfig.field]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            };
            return ordersToShow.sort(compareFunction);
            }
            return ordersToShow;
    }, [sortConfig, ordersToShow]);

    useEffect(() => {
        axios.get(
            `http://188.121.124.63/restaurant/${id}/orderview/`,
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                // 'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            setOrderHistory(response.data);
            setLoading(false);
        })
        .catch((error) => {
            setLoading(true);
            console.log(error);
        });
    }, []);

    useEffect(() => {
        console.log("order history is populated");
        if (orderHistory) {
        const newRows = orderHistory.map((order) => {
            if (order.orderDetails.restaurantDetails && order.userDetails) {
            const restaurant_name = order.orderDetails.restaurantDetails.name;
            const customer_name = order.userDetails.name;
            const customer_email = order.userDetails.email;
            let orderText = "";
            let price_tmp = 0;
            let price = 0;
            if (order.orderDetails.orderItems && order.orderDetails.orderItems.length >= 0) {
                orderText = order.orderDetails.orderItems
                    .map((item) => `${item.quantity}×${item.name_and_price.name}`)
                    .join(', ');
                    
                price_tmp = order.orderDetails.orderItems
                    .map((item) => price += item.quantity * Number(item.name_and_price.price));  
            } else {
                orderText = "No item";
            }
            const date = new Date(order.created_at).toISOString().split('T')[0];
            const status = order.status;
            const restaurant_id = order.orderDetails.restaurantDetails.id;
            const order_id = order.orderDetails.id;
            return createData(
                restaurant_name,
                customer_name,
                customer_email,
                orderText,
                price,
                date,
                status,
                restaurant_id,
                order_id
            );
            }
            return null; 
        });
            setRows(newRows.filter(Boolean)); 
        }
    }, [orderHistory]);

    const getRowColor = (status) => {
        if(status === "Completed") {
            return "rgba(65, 156, 86, 0.5)";
        } else if(status === "InProgress") {
            return "rgba(242, 223, 51, 0.4)";
        } else if(status === "notOrdered") {
            return "rgba(245, 132, 12, 0.4)"
        } else if(status === "Cancled"){
            return "rgba(176, 173, 169, 0.5)";
        } 
    };

    const handleStatus = (status) => {
        if(status === "InProgress")
            return "In progress";
        else if(status === "notOrdered")
            return "Not ordered";
        return status;
    };

    const showCancelIcon = (status) => {
        return status === 'notOrdered';
    };

    const showAcceptIcon = (status) => {
        return status === 'notOrdered';
    };

    const handleCancleOrdering = (Oid, Rid) => {
        const userData = {
            status:"Cancled"
        };
        axios.put(
            `http://188.121.124.63/restaurant/restaurant_view/${Rid}/${id}/order/${Oid}/`, 
            userData,
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            window.location.reload(false);
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
            } 
        }); 
    }

    const handleAcceptOrdering = (Oid, Rid) => {
        const userData = {
            status:"InProgress"
        }
        axios.put(
            `http://188.121.124.63/restaurant/restaurant_view/${Rid}/${id}/order/${Oid}/`, 
            userData,
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)
            }}
        )
        .then((response) => {
            window.location.reload(false);
        })
        .catch((error) => {
            if (error.response) {
                console.log(error.response);
            } 
        }); 
    }

    return (
        <ThemeProvider theme={theme}>
            <div 
                className="dashboard-back"
            >
                <HeaderRestaurant />
                <h1 
                    className='dashboard-title'
                >
                    Dashboard
                </h1>
                {loading ? (
                    <PulseLoader
                    type="bars"
                    color="black"
                    speedMultiplier={1}
                    className="dashboard-spinner-manager"
                    
                    />
                ) : (
                <Grid container spacing={2} 
                    className="dashboard-grid"
                >
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box 
                            className="dashboard-box" 
                            id="order-history-box"
                        >
                            <Typography
                                variant="h5" 
                                color="textPrimary"
                                gutterBottom
                                className="dashboard-title-manager"
                            >
                                Order history
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table 
                                    sx={{ minWidth: 650 }} 
                                    aria-label="simple table"
                                >
                                    <TableHead>
                                    <TableRow>
                                        <TableCell 
                                            sx={{ minWidth: "110px" }}
                                            onClick={() => handleSort('name')}
                                        >
                                            Restaurant name
                                            {sortConfig.field === 'name' && (
                                                <>
                                                    {sortConfig.direction === 'asc' ? (
                                                        <KeyboardArrowUp 
                                                            style={{ fontSize: '16px', verticalAlign: 'middle' }} 
                                                        />
                                                    ) : (
                                                        <KeyboardArrowDown 
                                                            style={{ fontSize: '16px', verticalAlign: 'middle' }} 
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </TableCell>

                                        <TableCell onClick={() => handleSort('customer_name')} sx={{ minWidth: "110px" }}>
                                            Customer name
                                            {sortConfig.field === 'customer-name' && (
                                                <>
                                                    {sortConfig.direction === 'asc' ? (
                                                        <KeyboardArrowUp 
                                                            style={{ fontSize: '16px', verticalAlign: 'middle' }} 
                                                        />
                                                    ) : (
                                                        <KeyboardArrowDown 
                                                            style={{ fontSize: '16px', verticalAlign: 'middle' }} 
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </TableCell>
                                        <TableCell>Customer email</TableCell>
                                        <TableCell 
                                            align="left"
                                        >
                                            Order
                                        </TableCell>
                                        <TableCell 
                                            align="left" 
                                            onClick={() => handleSort('price')}
                                        >
                                            Price
                                            {sortConfig.field === 'price' && (
                                            <>
                                                {sortConfig.direction === 'asc' ? (
                                                    <KeyboardArrowUp 
                                                        style={{ fontSize: '16px', verticalAlign: 'middle' }} 
                                                    />
                                                ) : (
                                                    <KeyboardArrowDown 
                                                        style={{ fontSize: '16px', verticalAlign: 'middle' }} 
                                                    />
                                                )}
                                            </>
                                        )}
                                        </TableCell>
                                        <TableCell align="left">Date</TableCell>
                                        <TableCell 
                                            align="left" 
                                            onClick={() => handleSort('status')}
                                        >
                                            Status
                                            {sortConfig.field === 'status' && (
                                            <>
                                                {sortConfig.direction === 'asc' ? (
                                                    <KeyboardArrowUp 
                                                        style={{ fontSize: '16px', verticalAlign: 'middle' }} 
                                                    />
                                                ) : (
                                                    <KeyboardArrowDown 
                                                        style={{ fontSize: '16px', verticalAlign: 'middle' }} 
                                                    />
                                                )}
                                            </>
                                        )}
                                        </TableCell>
                                    </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {sortedData.map((row) => (
                                            <TableRow key={row.order_id}
                                                tabIndex={-1}
                                                style={{backgroundColor: getRowColor(row.status)}}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.name}
                                                </TableCell>
                                                <TableCell align="left">{row.customer_name}</TableCell>
                                                <TableCell align="left">{row.customer_email}</TableCell>
                                                <TableCell align="left">{row.order}</TableCell>
                                                <TableCell align="left">{row.price}</TableCell>
                                                <TableCell align="left">{row.date}</TableCell>
                                                <TableCell align="left">
                                                    {handleStatus(row.status)}
                                                    {showAcceptIcon(row.status) && 
                                                        <Tooltip 
                                                            title="Accept"
                                                        >
                                                            <IconButton 
                                                                onClick={() => handleAcceptOrdering(row.order_id, row.restaurant_id)} 
                                                                title="Cancel order"
                                                            >
                                                                <CheckIcon 
                                                                    style={{color:'green'}}
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                    {showCancelIcon(row.status) && 
                                                        <Tooltip 
                                                            title="Reject"
                                                        >
                                                            <IconButton 
                                                                onClick={() => handleCancleOrdering(row.order_id, row.restaurant_id)} 
                                                                title="Cancel order"
                                                            >
                                                                <ClearIcon 
                                                                    style={{color:'red'}}
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    }
                                                </TableCell>
                                            </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                <div 
                                    style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
                                >
                                    <Pagination 
                                        count={totalPages} 
                                        page={currentPage} 
                                        onChange={(event, page) => setCurrentPage(page)} 
                                        shape="rounded"
                                    />
                                </div>
                            </TableContainer>
                        </Box>
                    </Grid>
                </Grid>
                )}
                <Footer />
            </div>
        </ThemeProvider>
    )
}