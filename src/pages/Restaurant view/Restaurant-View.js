import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Rating, BottomNavigation, BottomNavigationAction, Collapse, Chip, Modal, Stack, Pagination, Box, ThemeProvider } from '@mui/material';
import { Grid, Avatar, Typography, Button } from "@material-ui/core";
import * as MU from '@mui/material';
import axios from 'axios';
import './Restaurant-View.css';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Masonry from 'react-masonry-css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Food from '../../components/Food card/Food';
import BackToTop from '../../components/Back to top/BackToTop';
import Footer from '../../components/Footer/Footer';
import { useHistory, useParams } from "react-router-dom";
import HeaderCustomer from '../../components/Header/HeaderCustomer';
import MdPhone from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import DoneIcon from '@mui/icons-material/Done';
import Chat from '../../components/Customer chat/Chat';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { createTheme } from '@material-ui/core';
import AddPagination from '../../components/Pagination/Pagination';
import { makeStyles } from '@mui/styles';
import PulseLoader from "react-spinners/PulseLoader";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import ChatIcon from '@mui/icons-material/Chat';
import { CustomRestaurantCard } from '../../components/Custom Restaurant Card/CustomRestaurantCard';
import { UploadButton } from '../../components/CustomButtons/CustomButtons';
import ShowComments from '../../components/Comment/ShowComments';

const useStyles = makeStyles({
    ul: {
        "& .MuiPaginationItem-root": {
            color: "#ffa600"
        }
    }
});

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
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};


const Search = MU.styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: MU.alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: MU.alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0, 
    marginRight: theme.spacing(8), 
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1), 
        width: 'auto',
    },
}));

const SearchIconWrapper = MU.styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = MU.styled(MU.InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
            width: '20ch',
        },
        },
},
}));

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = MU.styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
    }),
}));

const RestaurantView = (props: Props) => {
    const [expanded, setExpanded] = React.useState(false);
    const [rateValue, setRateValue] = React.useState(0);
    const [color, setColor] = React.useState(false);
    const [restaurant, setRestaurant] = React.useState('');
    const [menu, setMenu] = React.useState([]);
    const [nameRestaurant, setNameRestaurant] = React.useState('');
    const [date_of_res, setDate_Of_Res] = React.useState([])
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [email, setEmail] = React.useState("");
    const {id} = useParams();
    const [list_fav, setList_Fav] = useState(localStorage.getItem('list_of_favorites_res'));
    const customer_id = localStorage.getItem('id');
    const [managerId,setManagerId] = useState('');
    const classes = useStyles();
    const [page, setPage] = useState(1);
    const PER_PAGE = 6;
    const _DATA = AddPagination(menu, PER_PAGE);
    const [phoneCopied, setPhoneCopied] = useState(false);
    const [addressCopied, setAddressCopied] = useState(false);
    const [order_id , setOrder_id]  = useState();
    const [openComments, setOpenComments] = React.useState(false);
    const [comments, setComments] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState();
    const [checkChat, setCheckChat] = useState(false);

    const handleClickChat = (newPlacement) => (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
        setPlacement(newPlacement);
        setCheckChat(true);
    };

    const handleClickOnDownloadExel = () => {
        axios.get(
            `http://188.121.124.63/restaurant/excel/customer/${managerId}/${customer_id}/order-history`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET",
            }}
        )
        .catch((error) => {
            console.log(error.response);
        });
    };

    useEffect(()=>{
        console.log(restaurant);
        console.log("restaurant is :" + restaurant);
        console.log("manager id is: ");
        setManagerId(restaurant.manager_id);
        console.log(restaurant.manager_id);
    },[]);

    useEffect(() => {
        const email = JSON.parse(localStorage.getItem('email'));
        if (email) {
            setEmail(email);
            console.log(email);
        }
    }, []);


    const breakpoints = {
        default: 3,
        1100: 2,
        700:1
    };

    React.useEffect(() => {
        axios.get(
            `http://188.121.124.63/restaurant/restaurant_view/${id}/food/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setMenu(response.data);
            setLoading(false);
        })
        .catch((error) => {
            setLoading(true);
        });

        const fetchData = async () => {
            try {
                axios.get(
                    `http://188.121.124.63/restaurant/restaurant_view/${id}/`,
                    {headers: {
                        'Content-Type' : 'application/json',
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Methods" : "PUT,PATCH",
                        'Authorization' : "Bearer " + token.slice(1,-1)   
                    }}
                )
                .then((response) => {
                    setRestaurant(response.data);
                    setManagerId(response.data.manager_id);
                    setNameRestaurant(response.data.name);
                    setRateValue(response.data.rate);
                    setDate_Of_Res(response.data.date_of_establishment.split('-'));
                    // console.log(response.data.date_of_establishment.split('-'));
                    const is_in_list = list_fav.includes(response.data.name);
                    is_in_list ? (setColor(!color)) : setColor(color);
                })
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, []);

    const handlePagination = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    const handleOpenComments = () => setOpenComments(true);

    const handleCloseComments = () => setOpenComments(false);

    const handleFavorite = () => {
        setColor(!color);
        const userData = {
            name: nameRestaurant,
            email: email
        };  

        axios.post(
            "http://188.121.124.63/user/favorite-restaurant/", 
            userData,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            const new_list = response.data.list_of_favorites_res;
            localStorage.setItem('list_of_favorites_res', JSON.stringify(new_list));
            setList_Fav(response.data.list_of_favorites_res);
        })
        .catch((error) => {
            if (error.response) {
                console.log("server responded");
            } 
            else if (error.request) {
                console.log("network error");
            } 
            else {
                console.log(error);
            }
        });
    };
    
    const handlePhoneChip = (text) => {
        navigator.clipboard.writeText(restaurant.number);
        setPhoneCopied(true);
        setTimeout(() => {
            setPhoneCopied(false);
        }, 1000);
    };
      
    const handleAddressChip = () => {
        navigator.clipboard.writeText(restaurant.address);
        setAddressCopied(true);
        setTimeout(() => {
            setAddressCopied(false);
        }, 1000);
    };

    const handlePhoneCopied = () => {
        setPhoneCopied(false);
    };

    const handleAddressCopied = () => {
        setAddressCopied(false);
    };

    // useEffect(() => {
    //     axios.get(
    //         `http://188.121.124.63/restaurant/restaurant_view/${id}/${customer_id}/order/`,
    //         {headers: {
    //             'Content-Type' : 'application/json',
    //             "Access-Control-Allow-Origin" : "*",
    //             "Access-Control-Allow-Methods" : "PUT,PATCH",
    //             'Authorization' : "Bearer " + token.slice(1,-1)   
    //         }}
    //     )
    //     .then((response) => {
    //         setOrder_id(response.data.id);
    //         localStorage.setItem("order_id", order_id);
    //     })
    // })

    // useEffect(()=>{
    //     axios.get(
    //         `http://188.121.124.63/restaurant/restaurant_id/${id}/comments`,
    //         {headers: {
    //             'Content-Type' : 'application/json',
    //             "Access-Control-Allow-Origin" : "*",
    //             "Access-Control-Allow-Methods" : "GET,PUT,PATCH",
    //             'Authorization' : "Bearer " + token.slice(1,-1)   
    //         }}
    //     )
    //     .then((response) => {
    //         setComments(response.data);
    //     })
    //     .catch((error) => {
    //         console.log(error.response);
    //     });
    // },[])

    const handlePayment = () => {
        history.push('/order-page/' + id);
    };
    
    return (
        <div className='restaurant-view-back'>
            <HeaderCustomer />
            {loading ? (
            <PulseLoader
                type="bars"
                color="black"
                speedMultiplier={1}
                className="spinner"
                />
            ) : (
            <>
                <Grid container spacing={2} 
                    className='restaurant-view'
                >
                    <Grid item md={3}>
                        <CustomRestaurantCard 
                            restaurant={restaurant}
                            color={color} 
                            handleCloseComments={handleCloseComments}
                            handleOpenComments={handleOpenComments}
                            openComments={openComments}
                            handleFavorite={handleFavorite}
                            establishment_date={date_of_res[0]}
                        />
                        <div className='payment'>
                            <UploadButton
                                variant={"contained"}
                                type={"submit"}
                                onClick={handlePayment}
                                title={"Payment"}
                            />
                        </div>
                    </Grid>
                    <Grid item md={9}>
                        {menu && 
                            menu.length > 0 ? (
                                <Masonry
                                    breakpointCols={breakpoints}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column"
                                >
                                {_DATA.currentData().map((food, index) => (
                                    <div key={index} className="my-masonry-grid_column" style={{ width: index % 3 === 0 ? '100%' : '' }}>
                                        <Food food={food} />
                                    </div>
                                ))}
                                </Masonry>
                            ) : (
                                <div 
                                    className="no-menu-message-container"
                                >
                                    <img 
                                        src='/oops!.png' 
                                        alt="No menu available" 
                                        className="food-image-restaurant-view" 
                                    />
                                    <h2 
                                        className="no-menu-message"
                                    >
                                        No menu is available.
                                    </h2>
                                </div>
                            )
                        }
                    </Grid>
                    <BackToTop/>
                </Grid>
                <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 , position: "fixed", left: "119px", bottom: "20px",zIndex:'1000'}}>
                    <SpeedDial
                        ariaLabel="SpeedDial basic example"
                        sx={{ position: 'absolute', bottom: 16, right: 16}}
                        icon={<SimCardDownloadIcon/>}
                        icon={<HeadsetMicIcon/>}
                        FabProps={{
                            sx: {
                                    bgcolor: '#ffa600',
                                    '&:hover': {
                                        bgcolor: '#ffa600',
                                    }
                                }
                            }}
                    >
                        <SpeedDialAction
                            key='exel'
                            icon={<SimCardDownloadIcon/>}
                            tooltipTitle='Download Excel Order History'
                            onClick={handleClickOnDownloadExel}   
                        />
                        <SpeedDialAction
                            key='chat'
                            icon={<ChatIcon/>}
                            tooltipTitle='Chat with Restaurant Manager'
                            onClick={handleClickChat('right')}   
                        />
                    </SpeedDial>
                    {checkChat &&
                        <Chat 
                            reciever={managerId} 
                            sender={customer_id} 
                            restaurant={restaurant}
                            placement={placement}
                            open={open}
                            setOpen={setOpen}
                            anchorEl={anchorEl}
                        />
                    }
                </Box>
                <Box 
                    justifyContent='center' 
                    alignItems='center' 
                    display='flex' 
                    sx={{margin:'20px 0px'}}
                >
                    <Pagination 
                        count={Math.ceil(menu.length / PER_PAGE)} 
                        onChange={handlePagination} 
                        variant="outlined" 
                        classes={{ ul: classes.ul }} 
                    />
                </Box>
                <Footer/>
            </>
            )}
        </div>
    );
}

export default RestaurantView;