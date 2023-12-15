import { Box, Grid, Typography} from "@material-ui/core"
import './CustomEditFood.css';
import { SubmitButton } from "../CustomButtons/CustomButtons";

const CustomEditFood = (props) => {
    return (
        <Box 
            className="food-box"
        >
            <Grid container spacing={4}>
                <Grid item lg={3} md={3} sm={3} >
                    <div
                        className="food-image-container"
                        onMouseEnter={props.onMouseEnter}
                        onMouseLeave={props.onMouseLeave}
                    >
                        <img
                            src={props.secondImage === props.food.id && props.food.food_pic2!=null ? props.food.food_pic2 : props.food.food_pic}
                            className="food-image"
                        />
                    </div>
                </Grid>
                <Grid item lg={5} md={5} sm={4} className='edit-food-grid'>
                    <Typography 
                        className="food-name"
                    >
                        {props.food.name}
                    </Typography>
                    <Typography 
                        className="food-ingredient"
                    >
                        {props.food.ingredients}
                    </Typography>
                </Grid>
                <Grid item lg={2} md={2} sm={2} className='edit-food-grid'>
                    <Typography 
                        className="food-price-menu"
                    >
                        {props.food.price}$
                    </Typography>
                    <Typography 
                        className="food-remain-number"
                    >
                        {props.food.remainder} remain
                    </Typography>
                </Grid>
                <Grid item lg={2} md={2} sm={3} className='edit-food-grid'>
                    <SubmitButton
                        variant={"contained"}
                        type={"submit"}
                        onClick={props.onClickEdit}
                        title={"Edit"}
                        customWidth={"auto"}
                    />
                </Grid>
            </Grid>
        </Box>
    )
}

export { CustomEditFood };