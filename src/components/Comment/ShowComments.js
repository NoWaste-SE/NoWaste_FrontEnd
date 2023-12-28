import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import "./ShowComments.css";
import { createTheme } from '@material-ui/core';
import { Avatar, Grid, ThemeProvider } from '@mui/material';
import { deepOrange, deepPurple,grey } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import axios from 'axios';
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

const ShowComments = (props) => {
    const [comments, setComments] = useState([]); 
    const {id} = props
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        axios.get(
            `http://188.121.124.63:8000/restaurant/restaurant_id/${id}/comments`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PUT,PATCH",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            setComments(response.data);
            setLoading(false);
        })
        .catch((error) => {
            console.log(error.response);
            setLoading(true);
        });
    },[]);

    return (
        <ThemeProvider theme={theme}>
            <div 
                className="comment-details-div"
            >
                {loading ? (
                    <PulseLoader
                        type="bars"
                        color="black"
                        speedMultiplier={1}
                        className="spinner-shopping-card"
                    />
                ) : (
                    comments ? 
                        (comments.map((res,index)=>(
                            <div>
                                <Stack 
                                    direction="row" spacing={2} 
                                >
                                    <Avatar 
                                        sx={{ bgcolor: grey[900] }}
                                        className='comment-avatar'
                                    >
                                        {res.writer_username[0]}
                                    </Avatar>
                                    <Stack 
                                        direction="column" spacing={2} 
                                    >
                                        <Typography 
                                            variant="h6" 
                                            className='comment-stack'
                                        >
                                            {res.writer_username}
                                        </Typography>
                                        <h8 
                                            className='comment-date'
                                        >
                                            {res.created_at_date}
                                        </h8>
                                    </Stack>
                                </Stack>
                                <Typography 
                                    className='comment-text' 
                                    id="modal-modal-description" 
                                    sx={{ mt: 2 }}
                                >
                                    {res.text}
                                </Typography>
                                <hr 
                                    className='comment-hr'
                                />
                            </div>
                        )))
                        :(
                        <div 
                            className="no-comment-message-container"
                        >
                            <h2 
                                className="no-comment-message"
                            >
                                No comment is available.
                            </h2>
                        </div>
                        ))}
            </div>
        </ThemeProvider>
    );
}
export default ShowComments;