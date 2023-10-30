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
import Footer from '../../components/Footer';
import { useHistory, useParams } from "react-router-dom";
import HeaderCustomer from '../../components/Header/HeaderCustomer';
import ShowComments from '../../components/ShowComments';
import MdPhone from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import DoneIcon from '@mui/icons-material/Done';
import Chat from '../../components/Chat';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { createTheme } from '@material-ui/core';
import AddPagination from '../../components/Pagination';
import { makeStyles } from '@mui/styles';

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

    useEffect(()=>{
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

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

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
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setMenu(response.data);
        });
        const fetchData = async () => {
            try {
                axios.get(
                    `http://188.121.124.63/restaurant/restaurant_view/${id}/`,
                    {headers: {
                        'Content-Type' : 'application/json',
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Methods" : "PUT,PATCH",
                        'Authorization' : "Token " + token.slice(1,-1)   
                    }}
                )
                .then((response) => {
                    setRestaurant(response.data);
                    setManagerId(response.data.manager_id);
                    setNameRestaurant(response.data.name);
                    setRateValue(response.data.rate);
                    setDate_Of_Res(response.data.date_of_establishment.split('-'));
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
                'Authorization' : "Token " + token.slice(1,-1)   
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

    useEffect(() => {
        axios.get(
            `http://188.121.124.63/restaurant/restaurant_view/${id}/${customer_id}/order/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setOrder_id(response.data.id);
            localStorage.setItem("order_id", order_id);
        })
    })

    useEffect(()=>{
        axios.get(
            `http://188.121.124.63/restaurant/restaurant_id/${id}/comments`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setComments(response.data);
        })
        .catch((error) => {
            console.log(error.response);
        });
    },[])

    const handlePayment = () => {
        history.push('/order-page/' + id);
    };
    
    return (
        <div className='restaurant-view-back'>
            <HeaderCustomer />
            <Grid container spacing={2} 
                className='restaurant-view'
            >
                <Grid item md={3}>
                    <Card 
                        sx={{ borderStyle: 'none'}} 
                        className='card-restaurant-view'
                    >
                        <Grid container spacing={2} 
                            className='restaurant-card-grid'
                        >
                            <Grid item>
                                <CardHeader 
                                    className="restaurant-header"
                                    avatar={
                                        <Avatar 
                                            style={{backgroundColor: "#f21b1b"}}
                                            aria-label="recipe"
                                        >
                                            {restaurant?.name ? restaurant.name.charAt(0) : "UD"}
                                        </Avatar>
                                    }
                                    title= {restaurant.name}
                                    subheader={date_of_res[0]}
                                />
                            </Grid>
                            <Grid item lg={1}>
                                <BottomNavigation>
                                    <BottomNavigationAction 
                                        value="favorites"
                                        icon={ 
                                            color ? 
                                            <FavoriteIcon 
                                                className='favorite-restaurant-view' 
                                                sx={{ color: 'red'}} 
                                                onClick={handleFavorite} 
                                            /> :
                                            <FavoriteBorderIcon 
                                                className='favorite-restaurant-view' 
                                                sx={{ color: 'inherit' }} 
                                                onClick={handleFavorite} 
                                            />
                                        }
                                    />
                                </BottomNavigation>
                            </Grid>
                        </Grid>
                        <CardMedia
                            component="img"
                            src={restaurant.restaurant_image}
                            alt="RestaurantImage"
                        />
                        <CardContent>
                            <Typography 
                                variant="body2" 
                                className='restaurant-description' 
                            >
                                {restaurant.description}
                            </Typography>
                            <Typography 
                                className='see-comment' 
                                onClick={handleOpenComments} 
                                style={{ display: 'flex', alignItems: 'center' }}
                            >
                                See Comments 
                                <ChevronRightIcon 
                                    style={{ marginLeft: '1px' }} 
                                />
                            </Typography>
                            <Modal
                                open={openComments} 
                                onClose={handleCloseComments}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box 
                                    sx={style} 
                                    className="comment-box"
                                >
                                    <h2 
                                        className='title-show-comments'
                                    >
                                        Comments
                                    </h2>
                                    <div 
                                        className="comment-details-div"
                                    >
                                        <Stack 
                                            direction="row" 
                                            spacing={2} 
                                        >
                                            <Avatar 
                                                style={{backgroundColor: "#c7c7c7"}}
                                                className='comment-avatar'
                                            >
                                                H
                                            </Avatar>
                                            <Stack 
                                                direction="column" 
                                                spacing={2} 
                                            >
                                                <Typography 
                                                    variant="h6" 
                                                    className='comment-stack'
                                                >
                                                    Helia Vafaei
                                                </Typography>
                                                <h8 
                                                    className='comment-date'
                                                >
                                                    2023-07-06
                                                </h8>
                                            </Stack>
                                        </Stack>
                                        <Typography 
                                            className='comment-text' 
                                            id="modal-modal-description" 
                                        >
                                            Very nice !
                                        </Typography>
                                        <hr 
                                            className='comment-hr' 
                                        />
                                        <Stack 
                                            direction="row" 
                                            spacing={2} 
                                        >
                                            <Avatar 
                                                style={{backgroundColor: "#c7c7c7"}}
                                                className='comment-avatar'
                                            >
                                                H
                                            </Avatar>
                                            <Stack 
                                                direction="column" 
                                                spacing={2} 
                                            >
                                                <Typography 
                                                    variant="h6" 
                                                    className='comment-stack'
                                                >
                                                    Setareh Babajani
                                                </Typography>
                                                <h8 
                                                    className='comment-date'
                                                >
                                                    2023-09-10
                                                </h8>
                                            </Stack>
                                        </Stack>
                                        <Typography 
                                            className='comment-text' 
                                            id="modal-modal-description" 
                                        >
                                            I recommend it...
                                        </Typography>
                                        <hr className='comment-hr'></hr>
                                        <Stack 
                                            direction="row" 
                                            spacing={2} 
                                        >
                                            <Avatar 
                                                style={{backgroundColor: "#c7c7c7"}}
                                                className='comment-avatar'
                                            >
                                                H
                                            </Avatar>
                                            <Stack 
                                                direction="column" 
                                                spacing={2} 
                                            >
                                                <Typography 
                                                    variant="h6" 
                                                    className='comment-stack'
                                                >
                                                    Hanieh Asadi
                                                </Typography>
                                                <h8 
                                                    className='comment-date'
                                                >
                                                    2023-08-01
                                                </h8>
                                            </Stack>
                                        </Stack>
                                        <Typography 
                                            className='comment-text' 
                                            id="modal-modal-description" 
                                        >
                                            The best restaurant ever.
                                        </Typography>
                                        <hr 
                                            className='comment-hr' 
                                        />
                                    </div>
                                    <Button 
                                        onClick={handleCloseComments} 
                                        variant="contained"
                                        className='close-comment'
                                    >
                                        Close
                                    </Button>
                                </Box>
                            </Modal>
                        </CardContent>
                        <CardActions 
                            disableSpacing
                        >
                            <Rating 
                                name="restaurant rate" 
                                value={rateValue} 
                                precision={0.5} 
                                readOnly 
                            />
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                                <ExpandMoreIcon />
                            </ExpandMore>
                        </CardActions>
                        <Collapse 
                            in={expanded} 
                            timeout="auto" 
                            unmountOnExit
                        >
                            <CardContent>
                                <Box 
                                    className='info' 
                                    paragraph
                                >
                                    <Chip
                                        icon={<MdPhone />}
                                        sx={{mb:1}}
                                        onClick={handlePhoneChip}       
                                        label={phoneCopied ? "Copied!" : restaurant.number}
                                        clickable
                                        className={phoneCopied ? "copied" : ""}
                                        onDelete={phoneCopied ? handlePhoneCopied : null}
                                        deleteIcon={<DoneIcon />}
                                    />
                                    <Chip
                                        icon={<PlaceIcon />}
                                        onClick={handleAddressChip}
                                        label={addressCopied ? "Copied!" : restaurant.address}
                                        clickable
                                        className={addressCopied ? "copied" : ""}
                                        onDelete={addressCopied ? handleAddressCopied : null}
                                        deleteIcon={<DoneIcon />}
                                    />
                                </Box>
                            </CardContent>
                        </Collapse>
                    </Card>
                    <Button 
                        onClick={handlePayment} 
                        variant="contained"
                        id='comment-submit'
                    >
                        Payment
                    </Button>
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
            <Chat 
                reciever={managerId} 
                sender={customer_id} 
                restaurant={restaurant}
            />
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
        </div>
    );
}

export default RestaurantView;