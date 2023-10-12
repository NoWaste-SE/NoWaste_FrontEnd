import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "./ShowComments.css";
import { createTheme } from '@material-ui/core';
import { Avatar, Grid, ThemeProvider } from '@mui/material';
import { deepOrange, deepPurple,grey } from '@mui/material/colors';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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

export default function ShowComments() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [comments, setComments] = useState([]); 
    const {id} = useParams(); 
    const token = localStorage.getItem('token');

    // console.log("restaurantId "+ id);
    // const userId = localStorage.getItem("id");
    // const [text, setText] = useState('');
    
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
                console.log("comment1");
                console.log(response.data);
            })
            .catch((error) => {
            console.log(error.response);
            console.log("comment2");
            });
    },[])

    return (
        <ThemeProvider theme={theme}>
            <div>
                <Button 
                    onClick={handleOpen} 
                    variant="contained"
                    // className="field-show-comments submit-show-comments"
                    // className='cooment-field'
                    id='comment-submit'
                >
                    Comments
                </Button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    
                    <Box sx={style} className="comment-box">
                        <h2 className='title-show-comments'>Users Comments</h2>

                        <div className="comment-details-div">
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
                                    <h2 className="no-comment-message">No comment is available.</h2>
                                    </div>
                                )}
                        </div>
                        <Button 
                            onClick={handleClose} 
                            variant="contained"
                            className='close-comment'
                        >
                            Close
                        </Button>
                        {/* <textarea onChange={handleAddtext}></textarea>
                        <Button onClick={handleAdd}>submit</Button> */}
                    </Box>
                    
                </Modal>
            </div>
        </ThemeProvider>
    );
}