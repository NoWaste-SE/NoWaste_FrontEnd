import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardActionArea from "@mui/material/CardActionArea";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import "./Food.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
};

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})
(({ theme, expand }) => ({
        transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest,
        })
}));


const Food = (props) => {
    const [count, setCount] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [restaurant, setRestaurant] = useState("");
    const [menu, setMenu] = useState([]);
    const { id } = useParams();
    const userid = localStorage.getItem("id");
    const food = props.food;
    const token = localStorage.getItem("token");
    const order_id = localStorage.getItem("order_id");
    const resid = food.restaurant_id;
    const [isHovered, setIsHovered] = useState(false);
    const [remainder, setRemainder] = useState("");

    const handleChange = (e) => {
        setCount(e.target.value);
    };

    useEffect(() => {
      if (food.remainder === 0) setRemainder("there is no food");
      else setRemainder(food.remainder);
    }, []);

    const handleRemoveFromCartClick2 = () => {
        axios.get(
            `http://188.121.124.63:8000/restaurant/restaurant_view/${resid}/${userid}/order/remove_from_order/${food.id}/`,
            {headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PUT,PATCH",
                Authorization: "Bearer " + token.slice(1, -1),
            }}
        )
        .then((response) => {
            setRemainder(response.data.new_remainder);
        })
        .catch((error) => console.log(error.response) );
        
        if (count > 0) {
            setCount(count - 1);
        }
    };

    const handleAddToCartClick2 = () => {
        axios.get(
            `http://188.121.124.63:8000/restaurant/restaurant_view/${resid}/${userid}/order/add_to_order/${food.id}/`,
            { headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PUT,PATCH",
                Authorization: "Bearer " + token.slice(1, -1)
            }}
        )
        .then((response) => {
            console.log("done");
            setRemainder(response.data.new_remainder);
        })
        .catch((error) => console.log(error.response) );

        if (remainder > 0) {
            setCount(parseInt(count) + 1);
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        localStorage.setItem("countOffood", JSON.stringify(count));
    }, [count]);

    useEffect(() => {
        axios.get(
            `http://188.121.124.63:8000/restaurant/restaurant_view/${resid}/`,
            {headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "PUT,PATCH",
                Authorization: "Bearer " + token.slice(1, -1)
            }}
        )
        .then((response) => {
            setRestaurant(response.data);
            setMenu(restaurant.menu);
        })
        .catch((error) => console.log(error));
    }, []);

    const handleChangeFood = () => {
      setIsHovered(!isHovered);
    };

    return (
        <div>
            <Card sx={{ borderRadius: 2 }} className="card-food">
                <CardActionArea>
                    <CardMedia
                        component="img"
                        sx={{ height: 140 }}
                        className={isHovered ? "food-image" : ""}
                        image={isHovered && food.food_pic2 ? food.food_pic2 : food.food_pic}
                        title={food.Type}
                        onMouseEnter={handleChangeFood}
                        onMouseLeave={handleChangeFood}
                    />
                    <CardContent 
                        sx={{ height: 25 }} 
                        className="food-animation"
                    >
                        <Typography 
                            gutterBottom 
                            className="food-name-restaurant-view"
                        >
                            {food.name}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                        >
                            {food.ingredients}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            color="#ffa600"
                        >
                            remaining: {remainder}
                        </Typography>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    <Grid container 
                        spacing={3.5} 
                        className="food-card-grid"
                    >
                        <Grid item>
                            <Typography 
                                className="food-price"
                            >
                                ${parseInt(food.price)}
                            </Typography>
                        </Grid>

                        <Grid item lg={5} md={5} sm={5} 
                            className="count-buttons"
                        >
                            <button
                                className="button__wrapper"
                                onClick={handleRemoveFromCartClick2}
                            >
                                -
                            </button>
                            <h5 
                                className="food-h5" 
                                onChange={handleChange}
                            >
                                {count}
                            </h5>
                            <button
                                className={`button__wrapper ${
                                    remainder === "there is no food" ? "food-disabled" : ""
                                    }`
                                }
                                onClick={handleAddToCartClick2}
                                disabled={remainder === "there is no food"}
                                data-test-id = '+button'
                            >
                                +
                            </button>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        </div>
    );
};
export default Food;