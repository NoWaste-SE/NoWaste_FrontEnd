import React, { useEffect, useState } from 'react';
import { Button, FormControl, Paper, Box, Typography, Grid, createTheme, TextField, IconButton, MenuItem, Switch, Collapse } from '@material-ui/core';
import { Slider, InputBase, ToggleButton, ToggleButtonGroup, Pagination, styled } from '@mui/material/';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { ExpandMore, ExpandLess} from '@mui/icons-material';
import Masonry from 'react-masonry-css';
import BackToTop from '../../components/BackToTop';
import Footer from '../../components/Footer';
import HeaderCustomer from '../../components/HeaderCustomer';
import { ThemeProvider, makeStyles } from '@mui/styles';
import "./HomepageCustomer.css";
import RestaurantCard from '../../components/RestaurantCard';
import StarRateIcon from '@mui/icons-material/StarRate';
import AddPagination from '../../components/Pagination'

const theme = createTheme({
    palette: {
        primary: {
            main: '#dd9d46'
        },
        secondary: {
            main: '#a44704'
        }
    },
    typography: {
        fontFamily: 'Montserrat, sans-serif'
    }
});

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
    },
    {
        value: 5.0,
    }
];

function rateValueText(rateMarks) {
    return `${rateMarks}`;
}
const discountMarks = [
    {
        value: 0,
    },
    {
        value: 100,
    }
];

function discountValueText(discountMarks) {
    return `${discountMarks}`;
};

const HomepageCustomer = () => {
    const [valueR, setValueR] = useState([0, 5]);
    const [valueD, setValueD] = useState([0, 100]);
    const [expandRating, setExpandRating] = useState(false);
    const [expandDiscount, setExpandDiscount] = useState(false);
    const [sort, setSort] = useState('');
    const [search, setSearch] = useState('');                 
    const minDistance = 1;
    const token = localStorage.getItem('token');
    const classes = useStyles();
    const [type, setType] = useState("");
    const [restaurant, setRestaurant] = useState([]); 
    const [fields, setFields] = useState([]); 
    const [page, setPage] = useState(1);
    const PER_PAGE = 6;
    const _DATA = AddPagination(restaurant, PER_PAGE);
    const [mysearch, setMySearch] = useState('');
    const _DATA_FILD = AddPagination(fields, PER_PAGE);

    useEffect(()=>{
        axios.get(
            `http://188.121.124.63/restaurant/restaurant-search/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setRestaurant(response.data);
        })
        .catch((error) => {
            console.log(error.response);
        });
    },[]);

    const handlePaginationRestaurant = (e, p) => {
        setPage(p);
        _DATA.jump(p);
    };

    const handleClickSearch = (e) => {
        setMySearch(e.target.value);
    };
    
    useEffect(() => {
        if (mysearch) {
            axios.get(
                `http://188.121.124.63/restaurant/restaurant-search/?search=${mysearch}`,
                {headers: {
                    'Content-Type' : 'application/json',
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Methods" : "PUT,PATCH",
                    'Authorization' : "Token " + token.slice(1,-1)   
                }}
            )
            .then((response) => {
                setRestaurant(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
        } else {
            axios.get(
                `http://188.121.124.63/restaurant/restaurant-search/`,
                {headers: {
                    'Content-Type' : 'application/json',
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Methods" : "PUT,PATCH",
                    'Authorization' : "Token " + token.slice(1,-1)   
                }}
            )
            .then((response) => {
                setRestaurant(response.data);
            })
            .catch((error) => {
                console.log(error.response);
            });
        }
    }, [mysearch]);

    const handleClickApplyFilter = () => {
        const fromR = valueR[0].toFixed(1);
        const toR = valueR[1].toFixed(1);
        const fromD = valueD[0] * 0.01;
        const toD = valueD[1] * 0.01;
        axios.get(
            `http://188.121.124.63/restaurant/restaurant-search/?type=${type}&discount__gte=${fromD}&discount__lte=${toD}&rate__lte=${toR}&rate__gte=${fromR}`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
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
    };

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
        axios.get(
            `http://188.121.124.63/restaurant/restaurant-search/?discount__gte=${fromD}&discount__lte=${toD}&ordering=-rate&rate__gte=${fromR}&rate__lte=${toR}`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setRestaurant(response.data);
            setFields([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    const handleClickDiscount = () => {
        const fromR = valueR[0].toFixed(1);
        const toR = valueR[1].toFixed(1);
        const fromD = valueD[0] * 0.01;
        const toD = valueD[1] * 0.01;
        axios.get(
            `http://188.121.124.63/restaurant/restaurant-search/?discount__gte=${fromD}&discount__lte=${toD}&ordering=-discount&rate__gte=${fromR}&rate__lte=${toR}`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setRestaurant(response.data);
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
        axios.get(
            `http://188.121.124.63/restaurant/restaurant-search/?discount__gte=${fromD}&discount__lte=${toD}&ordering=-date_of_establishment&rate__gte=${fromR}&rate__lte=${toR}`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setRestaurant(response.data);
            setFields([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    const handleClickLatest = () => {
        const fromR = valueR[0].toFixed(1);
        const toR = valueR[1].toFixed(1);
        const fromD = valueD[0] * 0.01;
        const toD = valueD[1] * 0.01;
        axios.get(
            `http://188.121.124.63/restaurant/restaurant-search/?discount__gte=${fromD}&discount__lte=${toD}&ordering=date_of_establishment&rate__gte=${fromR}&rate__lte=${toR}`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setRestaurant(response.data);
            setFields([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    const handleClickNearest = () => {
        const lat= localStorage.getItem("lat");
        const long = localStorage.getItem("long");
        axios.get(
            `http://188.121.124.63/restaurant/nearest_restaurant?origins=${lat},${long}`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "PUT,PATCH",
                'Authorization' : "Token " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setFields(response.data);
            setRestaurant([]);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

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
            <Grid container spacing={2} 
                className='grid-homepage-customer'
            >
                <Grid item md={3}>
                    <Box 
                        className="filter-hompage-customer"
                    >
                        <Typography 
                            variant='h5' 
                            className='filters-title'
                        > 
                            Filters
                        </Typography>
                        <Grid container spacing={2} 
                            className='grid' 
                            id='margin'
                        >
                            <Grid item>
                                <Typography 
                                    className='filter-type'
                                >
                                    Rating
                                </Typography>
                            </Grid>
                            <Grid item lg={2} md={3}>
                                <IconButton 
                                    onClick={handleExpandRating} 
                                    aria-label='Show more' 
                                    aria-expanded={setExpandRating}
                                >
                                    {expandRating ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Grid>
                            <Grid item lg={12} 
                                className='filter'
                            >
                                {expandRating ? (
                                    <Collapse 
                                        in={expandRating} 
                                        timeout="auto"
                                        unmountOnExit
                                    >
                                        <Grid container spacing={2} 
                                            className='filter-details'
                                        >
                                            <Grid item xs={12} sm={3} container 
                                                className="from"
                                            >
                                                <Typography 
                                                    className='details'
                                                >
                                                    {valueR[0].toFixed(1)}
                                                </Typography>
                                                <StarRateIcon 
                                                    className='star-rate'
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={3} container 
                                                className="to"
                                            >
                                                <Typography 
                                                    className='details'
                                                >
                                                    {valueR[1].toFixed(1)}
                                                </Typography>
                                                <StarRateIcon 
                                                    className='star-rate'
                                                />
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
                        <Grid container spacing={2} 
                            className='grid' 
                            id='margin'
                        >
                            <Grid item>
                                <Typography 
                                    className='filter-type'
                                >
                                    Discount
                                </Typography>
                            </Grid>
                            <Grid item lg={2} md={3}>
                                <IconButton 
                                    onClick={handleExpandDiscount} 
                                    aria-label='Show more' 
                                    aria-expanded={setExpandDiscount}
                                >
                                    {expandDiscount ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Grid>
                            <Grid item lg={12} 
                                className='filter'
                            >
                                {expandDiscount ? (
                                    <Collapse 
                                        in={expandDiscount} 
                                        timeout="auto" 
                                        unmountOnExit 
                                        id='discount'
                                    >
                                        <Grid container spacing={2} 
                                            className='filter-details discount-slider '
                                        >
                                            <Grid item xs={12} sm={6} container 
                                                className="from"
                                            >
                                                <Typography 
                                                    className='details'
                                                >
                                                    {valueD[0]}%
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12} sm={3} container 
                                                className="to"
                                            >
                                                <Typography className='details'>
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
                                        backgroundColor: '#FFA600'
                                    },
                                    textTransform: 'none',
                                    display: 'flex',  
                                    justifyContent: 'center'
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
                                        backgroundColor: '#FFA600'
                                    },
                                    textTransform: 'none',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}
                            >
                                Foreign
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <Button 
                            className='submit' 
                            onClick={handleClickApplyFilter} 
                        >
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
                                    <IconButton 
                                        type="button" 
                                        sx={{ p: '15px' }} 
                                        aria-label="search"
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                    <InputBase
                                        sx={{ ml: 1, flex: 1 }}
                                        placeholder="Search"
                                        inputProps={{ 'aria-label': 'search' }}
                                        onChange={handleClickSearch}        
                                    />
                                    </Paper>
                                </Grid>
                                <Grid item md={2}>
                                    <FormControl 
                                        className='formcontrol-sorting' 
                                    >
                                        <TextField
                                            select
                                            label="Sort"
                                            color="secondary"
                                            variant="outlined"
                                            value={sort}
                                            onChange={handleChange}
                                        >
                                            <MenuItem  
                                                onClick={handleClickNewest} 
                                                value="Item1"
                                            >
                                                Newest
                                            </MenuItem>
                                            <MenuItem 
                                                onClick={handleClickLatest} 
                                                value="Item2"
                                            >
                                                Latest
                                            </MenuItem>
                                            <MenuItem 
                                                onClick={handleClickNearest} 
                                                value="Item5"
                                            >
                                                Nearest
                                            </MenuItem>
                                            <MenuItem 
                                                onClick={handleClickRate} 
                                                value="Item3"
                                            >
                                                Maximum rate
                                            </MenuItem>
                                            <MenuItem 
                                                onClick={handleClickDiscount} 
                                                value="Item4"
                                            >
                                                Maximum discount
                                            </MenuItem>
                                        </TextField>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3}>
                        <Grid item md={12}>
                            <Masonry
                                breakpointCols={breakpoints}
                            >                                
                                {restaurant.length==1 ? 
                                    (
                                        <RestaurantCard 
                                            name={restaurant[0].name} 
                                            rate={restaurant[0].rate} 
                                            discount={restaurant[0].discount} 
                                            id={restaurant[0].id} 
                                            description={restaurant[0].description} 
                                            isSingleResult={true}
                                        />
                                    ) :
                                    (_DATA.currentData() && _DATA.currentData().map((res, index) => (
                                        <div 
                                            key={index} 
                                            style={{ width: index % 3 === 0 ? '100%' : '' }}
                                        >
                                            <RestaurantCard 
                                                name={res.name} 
                                                rate={res.rate} 
                                                discount={res.discount} 
                                                id={res.id} 
                                                number={res.number} 
                                                address={res.address} 
                                                restaurant_image={res.restaurant_image}
                                            />
                                        </div>
                                    )))
                                }
                                {fields.length==1 ? 
                                    (
                                        <RestaurantCard 
                                            name={fields.fields[0].name} 
                                            rate={fields.fields[0].rate} 
                                            discount={fields.fields[0].discount}
                                            id={fields.fields[0].id} 
                                            description={fields.fields[0].description} 
                                            isSingleResult={true}
                                        />
                                    ) :
                                    (_DATA_FILD.currentData() && _DATA_FILD.currentData().map((res, index) => (
                                        <div 
                                            key={index} 
                                            style={{ width: index % 3 === 0 ? '100%' : '' }}
                                        >
                                            <RestaurantCard 
                                                name={res.fields.name} 
                                                rate={res.fields.rate} 
                                                discount={res.fields.discount} 
                                                id={res.pk} number={res.fields.number} 
                                                address={res.fields.address} 
                                                restaurant_image={res.fields.restaurant_image}
                                            />
                                        </div>
                                    )))
                                }
                            </Masonry>
                        </Grid>
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