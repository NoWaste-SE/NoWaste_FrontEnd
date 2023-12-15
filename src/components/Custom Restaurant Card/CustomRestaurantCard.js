import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardMedia, CardContent, CardActions, Rating, BottomNavigation, BottomNavigationAction, Collapse, Chip, Modal, Stack, Box } from '@mui/material';
import { Grid, Avatar, Typography, Button } from "@material-ui/core";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DoneIcon from '@mui/icons-material/Done';
import MdPhone from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import * as MU from '@mui/material';
import './CustomRestaurantCard.css';
import '../Comment/ShowComments.css';
import ShowComments from '../Comment/ShowComments';
// import '../../pages/Restaurant view/Restaurant-View.css';

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

const CustomRestaurantCard = (props) => {
    const [phoneCopied, setPhoneCopied] = useState(false);
    const [addressCopied, setAddressCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);
    // const [establishment_date, setEstablishment_date] = useState("");
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleAddressChip = () => {
        navigator.clipboard.writeText(props.restaurant.address);
        setAddressCopied(true);
        setTimeout(() => {
            setAddressCopied(false);
        }, 1000);
    };

    const handlePhoneChip = (text) => {
        navigator.clipboard.writeText(props.restaurant.number);
        setPhoneCopied(true);
        setTimeout(() => {
            setPhoneCopied(false);
        }, 1000);
    };

    const handlePhoneCopied = () => {
        setPhoneCopied(false);
    };

    const handleAddressCopied = () => {
        setAddressCopied(false);
    };
    
    return (
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
                                {props.restaurant?.name ? props.restaurant.name.charAt(0) : "UD"}
                            </Avatar>
                        }
                        title={props.restaurant.name}
                        subheader={props.establishment_date}
                    />
                </Grid>
                <Grid item lg={1}>
                    <BottomNavigation>
                        <BottomNavigationAction 
                            value="favorites"
                            icon={ 
                                props.color ? 
                                <FavoriteIcon 
                                    className='favorite-restaurant-view' 
                                    sx={{ color: 'red'}} 
                                    onClick={props.handleFavorite} 
                                /> :
                                <FavoriteBorderIcon 
                                    className='favorite-restaurant-view' 
                                    sx={{ color: 'inherit' }} 
                                    onClick={props.handleFavorite} 
                                />
                            }
                        />
                    </BottomNavigation>
                </Grid>
            </Grid>
            <CardMedia
                component="img"
                src={props.restaurant.restaurant_image}
                alt="RestaurantImage"
            />
            <CardContent>
                <Typography 
                    variant="body2" 
                    className='restaurant-description' 
                >
                    {props.restaurant.description}
                </Typography>
                <Typography 
                    className='see-comment' 
                    onClick={props.handleOpenComments} 
                    style={{ display: 'flex', alignItems: 'center' }}
                >
                    See Comments 
                    <ChevronRightIcon 
                        style={{ marginLeft: '1px' }} 
                    />
                </Typography>
                <Modal
                    open={props.openComments} 
                    onClose={props.handleCloseComments}
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
                        <ShowComments id = {props.id}/>
                        <Button 
                            onClick={props.handleCloseComments} 
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
                    value={props.restaurant.rate} 
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
                            label={phoneCopied ? "Copied!" : props.restaurant.number}
                            clickable
                            className={phoneCopied ? "copied" : ""}
                            onDelete={phoneCopied ? handlePhoneCopied : null}
                            deleteIcon={<DoneIcon />}
                        />
                        <Chip
                            icon={<PlaceIcon />}
                            onClick={handleAddressChip}
                            label={addressCopied ? "Copied!" : props.restaurant.address}
                            clickable
                            className={addressCopied ? "copied" : ""}
                            onDelete={addressCopied ? handleAddressCopied : null}
                            deleteIcon={<DoneIcon />}
                        />
                    </Box>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export { CustomRestaurantCard };