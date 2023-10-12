import * as React from 'react';
import * as MU from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Restaurant-View.css';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccountCircle } from '@material-ui/icons';
import Masonry from 'react-masonry-css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Food from '../components/Food';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import NavigationIcon from '@material-ui/icons/Navigation';
import { Button } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useHistory } from "react-router-dom";
import HeaderCustomer from '../components/HeaderCustomer';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ShowComments from '../components/ShowComments';
import { useEffect } from 'react';
import { react } from '@babel/types';
import PhoneIcon from '@mui/icons-material/Phone';
import MdPhone from '@mui/icons-material/Phone';
import Chip from '@mui/material/Chip';
import Icon from '@mui/material/Icon';
import PlaceIcon from '@mui/icons-material/Place';
import { FaRegClipboard } from 'react-icons/fa';
import DoneIcon from '@mui/icons-material/Done';
import { add } from 'date-fns';
import Chat from '../components/Chat';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import { createTheme } from '@material-ui/core';
import { Avatar, Grid, ThemeProvider } from '@mui/material';
import { deepOrange, deepPurple,grey } from '@mui/material/colors';


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


const RestaurantView = (props: Props) => 
{
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

    useEffect ( ()=>{
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
    }

    React.useEffect(() => {
        axios.get("http://188.121.124.63/restaurant/restaurant_view/" + id + '/food/',
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            console.log("food",response);
            setMenu(response.data);
        })
        const fetchData = async () => {
          try {
            axios.get("http://188.121.124.63/restaurant/restaurant_view/" + id + '/',
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }})
            .then((response) => {
                console.log("res and managers are: ")
            console.log(response.data);
            console.log(response.data.manager_id);
            setRestaurant(response.data);
            setManagerId(response.data.manager_id);
            setNameRestaurant(response.data.name);
            setRateValue(response.data.rate);
            setDate_Of_Res(response.data.date_of_establishment.split('-'));
            console.log("Dateeeeeeee",date_of_res);
            const is_in_list = list_fav.includes(response.data.name);
            is_in_list ? (setColor(!color)) : setColor(color);
          })
            }catch (error) {
            console.log(error);
          }
        };
        fetchData();
      }, []);

        const handleColor = () => {
        setColor(!color);
        const userData = {
            name: nameRestaurant,
            email: email
            };
            console.log("userData" , userData);
            axios.post("http://188.121.124.63/user/favorite-restaurant/", userData,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }})
            .then((response) => {
                console.log(response);
                const new_list = response.data.list_of_favorites_res;
                localStorage.setItem('list_of_favorites_res', JSON.stringify(new_list));
                setList_Fav(response.data.list_of_favorites_res);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    console.log("server responded");
                } 
                else if (error.request) {
                    console.log("network error");
                } 
                else {
                    console.log(error);
                }
            },);
    };
    
    const [phoneCopied, setPhoneCopied] = useState(false);
    const [addressCopied, setAddressCopied] = useState(false);

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
        
    const [textCopied, setTextCopied] = useState(false);
    
    const [order_id , setOrder_id]  = useState();

    useEffect(() => {
        axios.get("http://188.121.124.63/restaurant/restaurant_view/"+ id + "/5/order/",
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            setOrder_id(response.data.id);
            // console.log("order id",order_id);
            localStorage.setItem("order_id", order_id);
            // console.log("local",localStorage.getItem("order_id"));
        })
    })

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [comments, setComments] = useState([]); 
    // const {id} = useParams(); 
    // console.log("restaurantId "+ id);

    // const userId = localStorage.getItem("id");
    // const [text, setText] = useState('');
    // const token = localStorage.getItem('token');
    // const handleAddtext = (e) => {
    //     setText(e.target.value);
    // }
    // const handleAdd = (e) => {
    //     e.preventDefault();
    //     const userData = {
    //         text:text
    //     }
    //     axios.post(`http://188.121.124.63/restaurant/comment/user_id/${userId}/restaurant_id/${id}`, userData, {headers:{"Content-Type" : "application/json"}})
    //     .then((response) => {
    //         console.log(response);
    //         window.location.reload(false);
    //     })
    //     .catch((error) => {
    //         if (error.response) {
    //             console.log(error.response);
    //         } 
    //     });    
    // }
    useEffect(()=>{
        axios.get(`http://188.121.124.63/restaurant/restaurant_id/${id}/comments`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "GET,PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
            .then((response) => {
                setComments(response.data);
                console.log("commient1");
                console.log(response.data);
            })
            .catch((error) => {
            console.log(error.response);
            console.log("commient2");
            });
    },[])

    const handlePayment = () => {
        history.push('/order-page/' + id);
    };
    
    return (
    <div className='myback'>
        <HeaderCustomer />
        <MU.Grid container spacing={2} sx={{
            paddingTop:"2%",
        }}>
            <MU.Grid item md={3}>
                <MU.Card sx={{ borderStyle: 'none'}} className='card-restaurant-view'>
                    <MU.Grid container spacing={2} className='restaurant-card-grid'>
                        <MU.Grid item>
                            <MU.CardHeader className="restaurant-header"
                                    avatar={
                                        <MU.Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                        {restaurant?.name ? restaurant.name.charAt(0) : "UD"}
                                        </MU.Avatar>
                                    }
                                    title= {restaurant.name}
                                    subheader={date_of_res[0]}
                                    >
                            </MU.CardHeader>
                        </MU.Grid>
                        <MU.Grid item lg={1} >
                            <MU.BottomNavigation>
                                <MU.BottomNavigationAction 
                                    value="favorites"
                                    icon={
                                    color ? 
                                    <FavoriteIcon className='favorite-restaurant-view' sx={{ color: 'red'}} onClick={handleColor} /> :
                                    <FavoriteBorderIcon className='favorite-restaurant-view' sx={{ color: 'inherit' }} onClick={handleColor} />
                                    }
                                />
                            </MU.BottomNavigation>
                        </MU.Grid>
                    </MU.Grid>

                    <MU.CardMedia
                        component="img"
                        // src={"/downt.jpg"}
                        src={restaurant.restaurant_image}
                        alt="RestaurantImage"
                    />
                    <MU.CardContent>
                    <MU.Typography variant="body2" className='Body2-restaurant-view' color="text.secondary">
                        {restaurant.description}
                    </MU.Typography>
                    <Typography className='see-comment' onClick={handleOpen} style={{ display: 'flex', alignItems: 'center' }}>
                        See Comments 
                        <ChevronRightIcon style={{ marginLeft: '1px' }} />
                    </Typography>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        
                        <Box sx={style} className="comment-box">
                            <h2 className='title-show-comments'>Comments</h2>

                            {/* <div className="comment-details-div">
                                {comments && comments.length > 0 ? (
                                    <div>
                                        {comments.map((res,index)=>(
                                        <div>
                                            <Stack direction="row" spacing={2} >
                                                <Avatar sx={{ bgcolor: grey[900] }} className='comment-avatar'>{res.writer_username[0]}</Avatar>
                                                <Stack direction="column" spacing={2} >
                                                    <Typography variant="h6" className='comment-stack'>
                                                        {res.writer_username}
                                                    </Typography>
                                                    <h8 className='comment-date'>{res.created_at_date}</h8>
                                                </Stack>
                                            </Stack>
                                            <Typography className='comment-text' id="modal-modal-description" sx={{ mt: 2 }}>
                                                {res.text}
                                            </Typography>
                                            <hr className='comment-hr'></hr>
                                        </div>
                                        ))}
                                    </div>
                                    ) :
                                    (
                                        <div className="no-comment-message-container">
                                        <h3 className="no-comment-message">No comment is available.</h3>
                                        </div>
                                    )}
                            </div> */}
                            <div className="comment-details-div">
                                <Stack direction="row" spacing={2} >
                                    <Avatar sx={{ bgcolor: grey[900] }} className='comment-avatar'>H</Avatar>
                                    <Stack direction="column" spacing={2} >
                                        <Typography variant="h6" className='comment-stack'>
                                            Helia Vafaei
                                        </Typography>
                                        <h8 className='comment-date'>2023-07-06</h8>
                                    </Stack>
                                </Stack>
                                <Typography className='comment-text' id="modal-modal-description" sx={{ mt: 2 }}>
                                    Very nice !
                                </Typography>
                                <hr className='comment-hr'></hr>
                                <Stack direction="row" spacing={2} >
                                    <Avatar sx={{ bgcolor: grey[900] }} className='comment-avatar'>S</Avatar>
                                    <Stack direction="column" spacing={2} >
                                        <Typography variant="h6" className='comment-stack'>
                                            Setareh Babajani
                                        </Typography>
                                        <h8 className='comment-date'>2023-06-29</h8>
                                    </Stack>
                                </Stack>
                                <Typography className='comment-text' id="modal-modal-description" sx={{ mt: 2 }}>
                                    I recommend it.
                                </Typography>
                                <hr className='comment-hr'></hr>
                                <Stack direction="row" spacing={2} >
                                    <Avatar sx={{ bgcolor: grey[900] }} className='comment-avatar'>N</Avatar>
                                    <Stack direction="column" spacing={2} >
                                        <Typography variant="h6" className='comment-stack'>
                                            Hanie asadi
                                        </Typography>
                                        <h8 className='comment-date'>2023-06-26</h8>
                                    </Stack>
                                </Stack>
                                <Typography className='comment-text' id="modal-modal-description" sx={{ mt: 2 }}>
                                    The best restaurant ever.
                                </Typography>
                                <hr className='comment-hr'></hr>
                            </div>
                            <Button 
                                onClick={handleClose} 
                                variant="contained"
                                className='close-comment'
                            >
                                Close
                            </Button>
                        </Box>
                        
                    </Modal>

                        </MU.CardContent>
                        <MU.CardActions disableSpacing>
                            <MU.Rating name="read-only" value={rateValue} precision={0.5} readOnly />
                            <ExpandMore
                                expand={expanded}
                                onClick={handleExpandClick}
                                aria-expanded={expanded}
                                aria-label="show more"
                            >
                            <ExpandMoreIcon />
                            </ExpandMore>
                        </MU.CardActions>
                    <MU.Collapse in={expanded} timeout="auto" unmountOnExit>
                        <MU.CardContent>
                            <Box className='info' paragraph>
                                <Chip
                                    icon={<MdPhone/>}
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
                        </MU.CardContent>
                    </MU.Collapse>
                </MU.Card>
                <Button 
                    onClick={handlePayment} 
                    variant="contained"
                    id='comment-submit'
                >
                    Payment
                </Button>

                {/* <ShowComments /> */}


            </MU.Grid>
            
            <MU.Grid item md={9}>
                {menu && menu.length > 0 ? (
                <Masonry
                    breakpointCols={breakpoints}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
            >
                {menu.map((food, index) => (
                        <div key={index} className="my-masonry-grid_column" style={{ width: index % 3 === 0 ? '100%' : '' }}>
                            <Food food={food} />
                        </div>
                    ))}
            </Masonry>
            ) : (
                // <p className="no-menu-message">No menu available.</p>
                <div className="no-menu-message-container">
                <img src='/oops!.png' alt="No menu available" className="food-image-restaurant-view" />
                <h2 className="no-menu-message">No menu is available.</h2>
                </div>
            )}
            </MU.Grid>
            <BackToTop/>
        </MU.Grid>
        <Chat reciever={managerId} sender={customer_id} restaurant={restaurant}/>
        <Footer/>

    </div>
    );
}

export default RestaurantView;

