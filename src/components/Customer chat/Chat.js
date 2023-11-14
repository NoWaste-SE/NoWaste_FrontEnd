import React, { useEffect, useState } from 'react';
import Fab from '@mui/material/Fab';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import './Chat.css'
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import { Grid ,IconButton } from '@mui/material';
import List from '@mui/material/List';
import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import ReactScrollToBottom from "react-scroll-to-bottom";
import { useEffectOnce } from '../Restaurant chat/useEffectOnce';
import axios from 'axios';
import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        primary: {
          main: '#e74c3c',
        },
        secondary: {
          main: '#ffa600',
        }
    }
});

const Chat = (props) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [data, setData] = useState('');
    const [client, setClient] = useState(null);
    const manager_id = props.reciever;
    const customer_id = props.sender;
    const open = props.open;
    const setOpen = props.setOpen;
    const placement = props.placement;
    const anchorEl = props.anchorEl;
    console.log("manager id is as shw" + manager_id + " " + customer_id);
    let room_name = customer_id + "_" + manager_id;

    useEffect(() => {
        axios.get(
            `http://188.121.124.63/chat/room/${customer_id}/${manager_id}/`
        )
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            console.log(error.response);
        })
    }, [manager_id]);

    useEffect(() => {
        console.log("here to split data");
        const messageArray = data.split("OrderedDict(").slice(1).map((item) => {
            const formattedItem = item.replace(/^\[|\]$/g, "");
            const pairs = formattedItem.split("), ");
            const msg_array = {};
            for(let i=0; i<pairs.length; i++){
                pairs[i] = pairs[i].replace(/['()\[\]]/g, "");
                const [key, value] = pairs[i].split(", ");
                msg_array[key] = value;
            }
            return msg_array;
        });
        messageArray.map((item) => JSON.parse(JSON.stringify(item)));
        console.log(messageArray);
        setMessages(messageArray);
    }, [data]);
    
    // const handleClick = (newPlacement) => (event) => {
    //     setAnchorEl(event.currentTarget);
    //     setOpen((prev) => placement !== newPlacement || !prev);
    //     console.log("open is "+ open);
    //     setPlacement(newPlacement);
    // };

    const handleCloseChat = () => {
        setOpen(false);
    };

    const handleMessage = (event) => {
        setInput(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };

    const handleSend = () => {
        const trimmedMessage = input.trim();
        if (trimmedMessage !== '') {
            const formattedDate = new Date().toISOString();
            console.log(JSON.stringify({
                message : input,
                sender_id : parseInt(customer_id),
                room_name : room_name,
                reciever_id: manager_id,
                date_created: formattedDate
            }));
            client.send(
                JSON.stringify({
                    message : input,
                    sender_id : parseInt(customer_id),
                    room_name : room_name,
                    reciever_id: manager_id,
                    date_created: formattedDate
                })
            );
            setInput('');
        }
    };

    const messageOnOpen = (e) => {
        console.log("WebSocket connection opened");
    };

    const messageOnMessage = (event) => {
        const message = JSON.parse(event.data);
        message.sender = message.sender_id;
        message.date_created = new Date();
        setMessages((e) => [...e, message]);
    };

    const messageOnClose = () => {
        console.log("WebSocket connection is closing");
    };

    useEffectOnce(() => {
        const client_1 = new WebSocket(
            `ws://188.121.124.63:4000/chat/room/${room_name}/`
        );
        client_1.onopen = messageOnOpen;
        client_1.onmessage = messageOnMessage;
        console.log("close in 171");
        client_1.onclose = messageOnClose;
        setClient(client_1);
    });

    useEffect(() => {
        if(client && client.readyState === WebSocket.OPEN){
            client.close();
            const clientCopy = new WebSocket(
                `ws://188.121.124.63:4000/chat/room/${room_name}/`
            );
        
            clientCopy.onopen = messageOnOpen;
        
            clientCopy.onmessage = messageOnMessage;
        
            clientCopy.onclose = messageOnClose;
            setClient(clientCopy);
        } 
        if(client && client.readyState === WebSocket.CLOSED){
            const clientCopy = new WebSocket(
                `ws://188.121.124.63:4000/chat/room/${room_name}/`
            );
        
            clientCopy.onopen = messageOnOpen;
        
            clientCopy.onmessage = messageOnMessage;
        
            clientCopy.onclose = messageOnClose;
            setClient(clientCopy);
        }
    }, [open]);

    return (
        <div>
            <Popper 
                open={open} 
                anchorEl={anchorEl} 
                placement={placement} 
                transition 
                className='chat-poper'
            >
            {({ TransitionProps }) => (
                <Fade 
                    {...TransitionProps} 
                    timeout={350}
                >
                    <List 
                        sx={{ width: '100%' }}
                    >  
                        <Paper 
                            className='chatPage'
                        >
                            <Grid 
                                className="chatContainer"
                            >
                                <Grid 
                                    container
                                    className="chat-header"
                                >
                                    <Grid item md={10}>
                                        <h2 
                                            className='chat-title'
                                        >
                                            Support chat
                                        </h2>
                                    </Grid>
                                    <Grid item md={2}>
                                        <IconButton 
                                            onClick={handleCloseChat}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    </Grid>
                                    
                                    
                                </Grid>
                                <ReactScrollToBottom 
                                    className="chatBox"
                                >
                                        {messages.map((msg, index) => (
                                            <Message 
                                                key={index} 
                                                message={msg} 
                                            />
                                        ))}   
                                </ReactScrollToBottom >
                                <Grid 
                                    className="inputBox"
                                >
                                    <textarea  
                                        onKeyPress={handleKeyPress} 
                                        onChange={handleMessage} 
                                        value={input}
                                        id="chatInput"
                                        rows={1} 
                                        placeholder="Type a message"
                                    />
                                    <Button 
                                        onClick={handleSend}
                                    >
                                        <SendIcon 
                                            className='chat-send'
                                        />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    </List>
                </Fade>
            )}
            </Popper>
        </div>

        
    );
}
const Message = ({ message }) => {
    const id = localStorage.getItem('id');
    const isRestaurant = message.sender != id;
    const align = isRestaurant ? "flex-start" : "flex-end";
    const timeAlign = isRestaurant ? "left" : "right";

    return (
        <ThemeProvider 
            theme={theme}
        >
            <Box 
                sx={{ 
                    display: "flex", 
                    justifyContent: align, 
                    mb: 2 
                }}
            >
                <Box 
                    sx={{ 
                        display: "flex", 
                        flexDirection: isRestaurant ? "row" : "row-reverse", 
                        alignItems: "end" 
                    }} 
                >
                    <Avatar 
                        sx={{ bgcolor: isRestaurant ? "primary.main" : "secondary.main" }}
                    >
                        {isRestaurant ? "R" : "U"}
                    </Avatar>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            ml: isRestaurant ? 1 : 0,
                            mr: isRestaurant ? 0 : 1,
                            backgroundColor: isRestaurant ? "primary.light" : "secondary.light",
                            borderRadius: isRestaurant ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
                        }}
                    >
                        <Typography 
                            variant="body1" 
                            sx={{mt:-0.8}}
                        >
                            {message.message}
                        </Typography>
                        <Box 
                            sx={{mt: -0.4, mb:-1.5}}
                        >
                            <Typography 
                                variant="caption" 
                                sx={{textAlign: timeAlign}} 
                            >
                                {new Date(message.date_created).toLocaleTimeString([],{ hour: '2-digit', minute: '2-digit'})}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
export default Chat;