import * as React from 'react';
import * as MU from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Restaurant-View.css';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import { styled } from '@mui/material/styles';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { ExpandMore, ExpandLess} from '@mui/icons-material';
import { AccountCircle, Search } from '@material-ui/icons';
import Masonry from 'react-masonry-css';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Food from '../components/Food';
import BackToTop from '../components/BackToTop';
import Footer from '../components/Footer';
import NavigationIcon from '@material-ui/icons/Navigation';
import { Button, InputLabel, FormControl, Paper } from '@material-ui/core';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useHistory } from "react-router-dom";
import HeaderCustomer from '../components/HeaderCustomer';
import Slider from '@mui/material/Slider';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { react } from '@babel/types';
import { Collapse, Grid, MenuItem, TextField, createTheme } from '@mui/material';
import { ThemeProvider, makeStyles } from '@mui/styles';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import "./HomepageCustomer.css";
import RestaurantCard from '../components/RestaurantCard';
import { Container, Row } from 'react-bootstrap';
import StarRateIcon from '@mui/icons-material/StarRate';
import {InputBase} from '@mui/material';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import AddPagination from '../components/Pagination';
import Pagination from '@mui/material/Pagination';

const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46',
        },
        secondary: {
            main: '#a44704',
        }
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif',
    },
})

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
        padding: 0,
        margin: 2,
        transitionDuration: '300ms',
        '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
            backgroundColor:'#dd9d46',
            opacity: 1,
            border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.5,
        },
        },
        '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#dd9d46',
        border: '6px solid #dd9d46',
        },
        '&.Mui-disabled .MuiSwitch-thumb': {
        color:
            theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
        },
        '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
        },
    },
    '& .MuiSwitch-thumb': {
        boxSizing: 'border-box',
        width: 22,
        height: 22,
    },
    '& .MuiSwitch-track': {
        borderRadius: 26 / 2,
        backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
        opacity: 1,
        transition: theme.transitions.create(['background-color'], {
        duration: 500,
        }),
    },
    }));

const useStyles = makeStyles({
    markLabel: {
        fontSize: '0.6rem !important',
        width: '0 !important',
        height: '0 !important',
        alignContent: 'center',
        alignItems: 'center',
        transform: "translateX(-25px) !important"
    },
    markLabelActive: {
        fontSize: '0.5rem',
        width: '0 !important',
        height: '0 !important',
    },
    ul: {
        "& .MuiPaginationItem-root": {
            color: "#ffa600"
        }
    }
});
const rateMarks = [
    {
        value: 0.0,
        // label: "Minimum rate",
    },
    {
        value: 5.0,
        // label: "Maximum rate",
    }
];
function rateValueText(rateMarks) {
    return `${rateMarks}`;
}
const discountMarks = [
    {
        value: 0,
        // label: "Minimum discount"
    },
    {
        value: 100,
        // label: "Maximum discount"
    }
];
function discountValueText(discountMarks) {
    return `${discountMarks}`;
}

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
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
const HomepageCustomer = () => {
    const [valueR, setValueR] = React.useState([0, 5]);
    const [valueD, setValueD] = React.useState([0, 100]);
    const [expandRating, setExpandRating] = React.useState(false);
    const [expandDiscount, setExpandDiscount] = React.useState(false);
    const [sort, setSort] = React.useState('');
    const [search, setSearch] = useState('');                 
    const minDistance = 1;
    const token = localStorage.getItem('token');
    const classes = useStyles();
    const [type, setType] = useState("");

    const [restaurant, setRestaurant] = useState([]); 
    const [fields, setFields] = useState([]); 
    const [page, setPage] = useState(1);
    const PER_PAGE = 6;
    
    useEffect(()=>{
        axios.get(`http://188.121.124.63/restaurant/restaurant-search/`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
            .then((response) => {
            setRestaurant(response.data);
            })
            .catch((error) => {
            console.log(error.response);
            });
    },[])
    const _DATA = AddPagination(restaurant, PER_PAGE);
    const handlePaginationRestaurant = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    const handleClickSearch = (e) => {
        setMySearch(e.target.value);
    };
    
    const [mysearch, setMySearch] = useState('');                 
    useEffect(() => {
        if (mysearch) {
            axios.get(`http://188.121.124.63/restaurant/restaurant-search/?search=${mysearch}`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }})
                .then((response) => {
                    console.log(response.data);
                    setRestaurant(response.data);
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }
        else {
            axios.get(`http://188.121.124.63/restaurant/restaurant-search/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }})
                .then((response) => {
                    console.log(response.data);
                    setRestaurant(response.data);
                })
                .catch((error) => {
                    console.log(error.response);
                });
        }
    }, [mysearch]);
    
    // const handleKeyPress = (e) => {
    //     if (e.key === 'Enter') {
    //         // handleClickSearch();
    //         e.preventDefault();
    //         setMySearch(e.target.value);
    //         }
    //     };


    const handleClickApplyFilter = () => {
        const fromR = valueR[0].toFixed(1);
        const toR = valueR[1].toFixed(1);
        const fromD = valueD[0] * 0.01;
        const toD = valueD[1] * 0.01;
        axios.get(`http://188.121.124.63/restaurant/restaurant-search/?type=${type}&discount__gte=${fromD}&discount__lte=${toD}&rate__lte=${toR}&rate__gte=${fromR}`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            console.log(response.data);
            setRestaurant(response.data);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };         
    

    const handleChange = (event) => {
        setSort(event.target.value);
    };

    const handleChangeRate = (event, newValue) => {
        if (newValue[0] > newValue[1]) {
            setValueR([newValue[1], newValue[1]]);
        } else {
            if (newValue[0] > newValue[1]) {
            setValueR([newValue[1], newValue[1]]);
            } else {
                setValueR(newValue);
            }
        }
    };
    const handleChangeDiscount = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }
        if (activeThumb === 0) {
            setValueD([Math.min(newValue[0], valueD[1] - minDistance), valueD[1]]);
        } else {
            if (!Array.isArray(newValue)) {
            return;
            } if (activeThumb === 0) {
                setValueD([Math.min(newValue[0], valueD[1] - minDistance), valueD[1]]);
            } else {
                setValueD([valueD[0], Math.max([valueD[0], Math.max(newValue[1], valueD[0] + minDistance)][1], valueD[0] + minDistance)]);
            }
        }
    };
    const handleExpandRating = () => {
        setExpandRating((prevExpand) => !prevExpand);
    };;
    const handleExpandDiscount = () => {
        setExpandDiscount((prevExpand) => !prevExpand);
    };
    const breakpoints = {
        default: 3,
        1100: 2,
        700:1
    };

    const handleClickRate = () => {   
        const fromR = valueR[0].toFixed(1);
        const toR = valueR[1].toFixed(1);
        const fromD = valueD[0] * 0.01;
        const toD = valueD[1] * 0.01;
        axios.get(`http://188.121.124.63/restaurant/restaurant-search/?discount__gte=${fromD}&discount__lte=${toD}&ordering=-rate&rate__gte=${fromR}&rate__lte=${toR}`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            console.log(response.data);
            setRestaurant(response.data);
            setFields([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    const handleClickDiscount = () => {      //
        const fromR = valueR[0].toFixed(1);
        const toR = valueR[1].toFixed(1);
        const fromD = valueD[0] * 0.01;
        const toD = valueD[1] * 0.01;
        axios.get(`http://188.121.124.63/restaurant/restaurant-search/?discount__gte=${fromD}&discount__lte=${toD}&ordering=-discount&rate__gte=${fromR}&rate__lte=${toR}`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            setRestaurant(response.data);
            console.log(response.data);
            setFields([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    const handleClickNewest = () => {      //
        const fromR = valueR[0].toFixed(1);
        const toR = valueR[1].toFixed(1);
        const fromD = valueD[0] * 0.01;
        const toD = valueD[1] * 0.01;
        axios.get(`http://188.121.124.63/restaurant/restaurant-search/?discount__gte=${fromD}&discount__lte=${toD}&ordering=-date_of_establishment&rate__gte=${fromR}&rate__lte=${toR}`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            console.log(response.data);
            setRestaurant(response.data);
            setFields([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    const handleClickLatest = () => {      //
        const fromR = valueR[0].toFixed(1);
        const toR = valueR[1].toFixed(1);
        const fromD = valueD[0] * 0.01;
        const toD = valueD[1] * 0.01;
        axios.get(`http://188.121.124.63/restaurant/restaurant-search/?discount__gte=${fromD}&discount__lte=${toD}&ordering=date_of_establishment&rate__gte=${fromR}&rate__lte=${toR}`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            console.log(response.data);
            setRestaurant(response.data);
            setFields([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    const handleClickNearest = () => {      //
        const lat= localStorage.getItem("lat");
        const long = localStorage.getItem("long");
        axios.get(`http://188.121.124.63/restaurant/nearest_restaurant?origins=${lat},${long}`,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "PUT,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})
        .then((response) => {
            console.log(response.data);
            setFields(response.data);
            setRestaurant([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };
    const _DATA_FILD = AddPagination(fields, PER_PAGE);
    const handlePaginationFields = (e, p) => {
        setPage(p);
        _DATA_FILD.jump(p);
    };


    const handleSelectType = (event, newValue) => {
        setType(newValue);
    };
    
    return ( 
        <ThemeProvider theme={theme}>
            <HeaderCustomer />
            <Grid container spacing={2} sx={{ paddingBottom:"1%" }} className='grid-homepage-customer'>
                <Grid item md={3}>
                    <Box className="filter-hompage-customer">
                        <Typography variant='h5' className='filters-title'> 
                            Filters
                        </Typography>
                        <Grid container spacing={2} className='grid' id='grid-margin'>
                            <Grid item>
                                <Typography className='filter-type'>
                                    Rating
                                </Typography>
                            </Grid>
                            <Grid item lg={2} md={3}>
                                <IconButton onClick={handleExpandRating} aria-label='Show more' aria-expanded={setExpandRating}>
                                    {expandRating ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Grid>
                            <Grid item lg={12} style={{ marginTop: '-10px', marginLeft: '5px'}}>
                                {expandRating ? (
                                    <Collapse in={expandRating} timeout="auto" unmountOnExit>
                                        <Grid container spacing={2} className='grid-details'>
                                            <Grid item xs={12} sm={3} container alignItems='center'>
                                                {/* <Typography id='details'>
                                                    From
                                                </Typography> */}
                                                <Typography id='details'>
                                                    {valueR[0].toFixed(1)}
                                                </Typography>
                                                <StarRateIcon style={{ color: '#faaf00', marginLeft: '-100px', marginTop: '15px'}} />
                                            </Grid>
                                            <Grid item xs={12} sm={3} container alignItems='center' className='homepage-customer-to'>
                                                {/* <Typography id='details' >
                                                    To
                                                </Typography> */}
                                                <Typography id='details'>
                                                    {valueR[1].toFixed(1)}
                                                </Typography>
                                                <StarRateIcon style={{ color: '#faaf00', marginLeft: '-20px', marginTop: '15px'}} />
                                            </Grid>
                                        </Grid>
                                        <Slider
                                            getAriaLabel={rateValueText}
                                            marks={rateMarks}
                                            value={valueR}
                                            onChange={handleChangeRate}
                                            max={5}
                                            step={0.1}
                                            className="range-homepage-customer"
                                            classes={{
                                                markLabel: classes.markLabel,
                                                markLabelActive: classes.markLabelActive,
                                            }}
                                        />
                                    </Collapse>
                                ) : null}
                            </Grid> 
                        </Grid>
                        <hr className='hr-tag' />
                        <Grid container spacing={2} className='grid' id='grid-margin'>
                            <Grid item>
                                <Typography className='filter-type'>
                                Discount
                                </Typography>
                            </Grid>
                            <Grid item lg={2} md={3}>
                                <IconButton onClick={handleExpandDiscount} aria-label='Show more' aria-expanded={setExpandDiscount}>
                                    {expandDiscount ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Grid>
                            <Grid item lg={12} style={{ marginTop: '-10px', marginLeft: '5px'}}>
                                {expandDiscount ? (
                                    <Collapse in={expandDiscount} timeout="auto" unmountOnExit style={{marginTop: '20px'}}>
                                        <Grid container spacing={2} className='grid-details' style={{marginBottom: '10px', marginTop: '-15px !important'}}>
                                            <Grid item xs={12} sm={6} container alignItems='center'>
                                                {/* <Typography id='details'>
                                                    From
                                                </Typography> */}
                                                <Typography id='details'>
                                                    {valueD[0]}%
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={3} container alignItems='center' className='homepage-customer-to'>
                                                {/* <Typography id='details'>
                                                    To
                                                </Typography> */}
                                                <Typography id='details'>
                                                    {valueD[1]}%
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Slider
                                            getAriaLabel={discountValueText}
                                            marks={discountMarks}
                                            value={valueD}
                                            onChange={handleChangeDiscount}
                                            max={100}
                                            step={1}
                                            className="range-homepage-customer"
                                            classes={{
                                                markLabel: classes.markLabel,
                                                markLabelActive: classes.markLabelActive,
                                            }}
                                        />
                                    </Collapse>
                                ) : null}
                            </Grid> 
                        </Grid>
                        <hr className='hr-tag'/>
                        <ToggleButtonGroup
                            value={type}
                            exclusive
                            onChange={handleSelectType}
                            aria-label="Platform"
                            style={{ marginTop: '10px'}}
                            >
                            <ToggleButton
                                value="Iranian"
                                className='filter-type'
                                sx={{
                                fontSize: '16px',
                                color: 'black',
                                backgroundColor: '#e6e4df',
                                '&.Mui-selected': {
                                    color: 'white',
                                    backgroundColor: '#FFA600',
                                },
                                textTransform: 'none',
                                display: 'flex',  // Add this line
                                justifyContent: 'center',  // Add this line
                                }}
                            >
                                Iranian
                            </ToggleButton>
                            <ToggleButton
                                value="Foreign"
                                className='filter-type'
                                sx={{
                                fontSize: '16px',
                                color: 'black',
                                backgroundColor: '#e6e4df',
                                '&.Mui-selected': {
                                    color: 'white',
                                    backgroundColor: '#FFA600',
                                },
                                textTransform: 'none',
                                display: 'flex',  // Add this line
                                justifyContent: 'center',  // Add this line
                                }}
                            >
                                Foreign
                            </ToggleButton>
                            </ToggleButtonGroup>
                        <Button className='submit' onClick={handleClickApplyFilter} >      
                            Apply
                        </Button>          
                    </Box>
                </Grid>
                <Grid item lg={9} md={9}>
                    <Grid container spacing={2}>
                        <Grid item md={12}>
                            <Grid container spacing={2}>
                                <Grid item md={10}>
                                    <Paper
                                        component="form"
                                        className='search-homepage-customer'
                                        sx={{ p: '2px 4px'}}
                                    >
                                    <IconButton type="button" sx={{ p: '15px' }} aria-label="search">
                                        <SearchIcon />
                                    </IconButton>
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search"
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={handleClickSearch}        
                                        // onKeyPress={handleKeyPress}
                                    />
                                    </Paper>
                                </Grid>
                                <Grid item md={2}>
                                    <FormControl className='formcontrol-sorting'style={{width: "100%"}}>
                                        <TextField
                                            select
                                            label="Sort"
                                            color="secondary"
                                            variant="outlined"
                                            value={sort}
                                            // InputLabelProps={{ shrink: true }}
                                            // style= {{textAlign: 'left', width:'100%'}}
                                            style={{width: '100%', backgroundColor: "rgba(117, 115, 111, 0.05)"}}
                                            onChange={handleChange}
                                        >
                                            <MenuItem onClick={handleClickNewest} value="Item1">Newest</MenuItem>
                                            <MenuItem onClick={handleClickLatest} value="Item2">Latest</MenuItem>
                                            <MenuItem onClick={handleClickNearest} value="Item5">Nearest</MenuItem>
                                            <MenuItem onClick={handleClickRate} value="Item3">Maximum rate</MenuItem>
                                            <MenuItem onClick={handleClickDiscount} value="Item4">Maximum discount</MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <MU.Grid item md={12}>
                            <Masonry
                                breakpointCols={breakpoints}
                                // className="homepage-my-masonry-grid"
                            >
                                
                                {restaurant.length==1 ? (<RestaurantCard name={restaurant[0].name} rate={restaurant[0].rate} discount={restaurant[0].discount} id={restaurant[0].id} description={restaurant[0].description} isSingleResult={true}/>) :
                                (_DATA.currentData() && _DATA.currentData().map((res, index) => (
                                    <div key={index} style={{ width: index % 3 === 0 ? '100%' : '' }}>
                                        <RestaurantCard name={res.name} rate={res.rate} discount={res.discount} id={res.id} number={res.number} address={res.address} restaurant_image={res.restaurant_image}/>
                                    </div>
                                )))}
                                
                                {fields.length==1 ? (<RestaurantCard name={fields.fields[0].name} rate={fields.fields[0].rate} discount={fields.fields[0].discount} id={fields.fields[0].id} description={fields.fields[0].description} isSingleResult={true}/>) :
                                (_DATA_FILD.currentData() && _DATA_FILD.currentData().map((res, index) => (
                                    <div key={index} style={{ width: index % 3 === 0 ? '100%' : '' }}>
                                        <RestaurantCard name={res.fields.name} rate={res.fields.rate} discount={res.fields.discount} id={res.pk} number={res.fields.number} address={res.fields.address} restaurant_image={res.fields.restaurant_image}/>
                                    </div>
                                )))}
                            </Masonry>
                        </MU.Grid>
                    </Grid>
                </Grid>
            <BackToTop/>
            </Grid>
            
            <Box justifyContent='center' alignItems='center' display='flex' sx={{margin:'20px 0px'}}>
                { restaurant.length!=0 ? <Pagination count={Math.ceil(restaurant.length / PER_PAGE)} onChange={handlePaginationRestaurant} variant="outlined" classes={{ ul: classes.ul }} /> :
                <Pagination count={Math.ceil(fields.length / PER_PAGE)} onChange={handlePaginationFields} variant="outlined" classes={{ ul: classes.ul }} />}
            </Box>
        <Footer/>
        </ThemeProvider>
    );
}

export default HomepageCustomer;