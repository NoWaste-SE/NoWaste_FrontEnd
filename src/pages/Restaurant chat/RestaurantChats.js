import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Avatar, Grid, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import HeaderRestaurant from "../../components/Header/HeaderRestaurant";
import ReactScrollToBottom from "react-scroll-to-bottom";
import './RestaurantChats.css';
import '../../components/Customer chat/Chat.css';
import Divider from '@material-ui/core/Divider';
import axios from "axios";
import { useEffectOnce } from "../../components/Restaurant chat/useEffectOnce";

const theme = createTheme({
    palette: {
        primary: {
          main: '#e74c3c',
        },
        secondary: {
          main: '#ffa600',
        }
    },
    overrides: {
        MuiFormLabel: {
            asterisk: {
                color: '#db3131',
                '&$error': {
                color: '#db3131'
                },
            }
        }
    }
});

const getRandomColor = (userId) => {
    const colors = ['#FFA600', '#E74C3C','#1d9138','#225ca8', '#595959', '#571e94', '#94511e', '#941e38'];
    const index = userId % colors.length;
    return colors[index];
};

const Chat = () => {
    const [input, setInput] = useState("");
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const id = localStorage.getItem("id");
    const [data, setData] = useState('');
    let room_name = currentUserId + "_" + id;
    const [client, setClient] = useState(null);

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleSend();
        }
    };
    const handleSend = () => {
        const trimmedMessage = input.trim();
        if (trimmedMessage !== "") {
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString();
            client.send(
                JSON.stringify({
                    message: input,
                    user_id: parseInt(id),
                    room_name: room_name,
                    reciever_id: currentUserId,
                    date_created: formattedDate
                })
            );
            setInput("");
        }
    };

    useEffectOnce(() => {
        const client_1 = new WebSocket(
            `ws://188.121.124.63:8000/ws/chat/room/${room_name}/`
        );
        client_1.onopen = messageOnOpen;

        client_1.onmessage = messageOnMessage;

        client_1.onclose = messageOnClose;
        setClient(client_1);
    });
    
    const messageOnOpen = (e) => {
        console.log("WebSocket connection opened"+ currentUser);
    };

    const messageOnMessage = (event) => {
        const message = JSON.parse(event.data);
        message.sender_id = message.user_id;
        message.date_created = new Date();
        setMessages((e) => [...e, message]);
    };

    const messageOnClose = () => {
        console.log("WebSocket connection closed");
    };

    useEffect(() => {
        room_name = currentUserId + "_" + id;
        if(client && client.readyState === WebSocket.OPEN){
            client.close();
            const clientCopy = new WebSocket(
                `ws://188.121.124.63:8000/ws/chat/room/${room_name}/`
            );
        
            clientCopy.onopen = messageOnOpen;
        
            clientCopy.onmessage = messageOnMessage;
        
            clientCopy.onclose = messageOnClose;
            setClient(clientCopy);
        } 
        if(client && client.readyState === WebSocket.CLOSED){
            const clientCopy = new WebSocket(
                `ws://188.121.124.63:8000/ws/chat/room/${room_name}/`
            );
        
            clientCopy.onopen = messageOnOpen;
        
            clientCopy.onmessage = messageOnMessage;
        
            clientCopy.onclose = messageOnClose;
            setClient(clientCopy);
        }
    }, [currentUser]);

    useEffect(() => {
        axios.get(
            `http://188.121.124.63:8000/chat/${id}/`,
            {headers :{
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET,PATCH",
            }}
        )
        .then((response) => {
            const usersArray = Object.entries(response.data).map(([username, userId]) => ({
                username,
                userId,
            }));
            setUsers(usersArray);
        })
        .catch((error) => console.log(error));    
    }, []);

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    useEffect(() => {
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
        setMessages(messageArray);
    }, [data]);

    const handleChat = (userId, username) => {
        setCurrentUser(username);
        setCurrentUserId(userId);
        
        axios.get(
            `http://188.121.124.63:8000/chat/room/${userId}/${id}`
        )
        .then((response) => {
            setData(response.data);
        })
        .catch((error) => {
            console.log(error.response);
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <HeaderRestaurant />
            <Grid container spacing={2} 
                backgroundColor="rgb(239, 235, 229)" 
            >
                <Grid item md={3} sm={5}>
                    <Box 
                        height='10vh' 
                        style={{backgroundColor: '#bdbab6',display: 'flex', alignItems: 'center', justifyContent: 'start', paddingleft: '30px'}}
                    >
                        <Typography 
                            variant="h4" 
                            className='restaurant-chats-chats'
                        >
                            Chats
                        </Typography>
                    </Box>
                    <Box 
                        style={{height: '79vh', overflowY: 'scroll', marginTop: '10px'}}
                    >
                        {users.map((user, index) => (
                            <>
                                <Grid container spacing={2} 
                                    style={{justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}} 
                                    onClick={() => handleChat(user.userId, user.username)}
                                >
                                    <Grid item md={3}>
                                        <Avatar 
                                            className="users-avatar" 
                                            style={{ backgroundColor: getRandomColor(user.userId), fontSize: '30px'}}
                                        >
                                            {user.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </Grid>
                                    <Grid item md={8} 
                                        style={{ display: 'flex', alignItems: 'center' , marginLeft: '-10px'}}
                                    >
                                        <Typography 
                                            variant="h5" 
                                            ml="-8%"
                                        >
                                            {user.username}
                                        </Typography>
                                    </Grid> 
                                </Grid>
                                <Divider 
                                    style={{marginTop: '10px', marginBottom: '10px'}}
                                />
                            </>
                        ))}
                    </Box>
                </Grid>
                <Grid item md={9} sm={7}>
                    {currentUser ? ( 
                        <>
                            <Box 
                                className="chat-detail" 
                                style={{ height: '11vh', marginBottom: '-4px'}}
                            >
                                <Grid container spacing={2} 
                                    alignItems="center"
                                >
                                    <Grid item md={1.5} sm={2}>
                                        <Avatar 
                                            className="users-avatar current-chat-avatar" 
                                            style={{ backgroundColor: getRandomColor(currentUserId), marginLeft: '10px', fontSize: '30px'}}
                                        >
                                            {currentUser.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </Grid>
                                    <Grid item md={10.5} sm={10}>
                                        <Typography 
                                            variant="h5"
                                            ml="-8%"
                                        >
                                            {currentUser}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box
                                sx={{
                                    height: "81vh",
                                    display: "flex",
                                    flexDirection: "column",
                                    bgcolor: "grey.200",
                                    overflow: 'hidden',ml: '-1.3%'
                                }}
                            > 
                                <ReactScrollToBottom 
                                    className="restaurant-chat-box" 
                                >
                                    <Box 
                                        sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}
                                    >
                                        {messages.map((message) => (
                                            <Message 
                                                key={message.id} 
                                                message={message} 
                                            />
                                        ))}
                                    </Box>            
                                </ReactScrollToBottom>
                                <Box 
                                    sx={{ p: 2,  backgroundColor: 'rgb(239, 235, 229)'}}
                                >
                                    <Grid container spacing={2}
                                        marginTop='-25px'
                                    >
                                        <Grid item xs={11.5}>
                                            <TextField
                                                size="small"
                                                fullWidth
                                                placeholder="Type a message"
                                                variant="outlined"
                                                value={input}
                                                color="secondary"
                                                multiline
                                                onChange={handleInputChange}
                                                autoComplete="false"
                                                onKeyPress={handleKeyPress}
                                            />
                                        </Grid>
                                        <Grid item xs={0.5} >
                                            <Button
                                                color="secondary"
                                                className="chat-send-icon"
                                                onClick={handleSend}
                                            >
                                                <SendIcon />
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                        </>
                    ) : (
                        <Box
                            className="restaurant-chat-box"
                            id="no-current-chat"
                        />
                    )}
                </Grid>
            </Grid>
        </ThemeProvider>
    );
};

const Message = ({ message }) => {
    const id = localStorage.getItem("id");
    const isCustomer = (message.sender_id != id);
    const align = isCustomer ? "flex-start" : "flex-end";
    const timeAlign = isCustomer ? "left" : "right";
    return (
        <ThemeProvider theme={theme}>
            <Box 
                sx={{ display: "flex", justifyContent: align, mb: 2 }}
            >
                <Box 
                    sx={{ display: "flex", flexDirection: isCustomer ? "row" : "row-reverse", alignItems: "end" }} 
                >
                    <Avatar 
                        sx={{ bgcolor: isCustomer ? "primary.main" : "secondary.main" }}
                    >
                        {isCustomer ? "C" : "U"}
                    </Avatar>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            ml: isCustomer ? 1 : 0,
                            mr: isCustomer ? 0 : 1,
                            backgroundColor: isCustomer ? "primary.light" : "secondary.light",
                            borderRadius: isCustomer ? "20px 20px 20px 5px" : "20px 20px 5px 20px",
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
                                {new Date(message.date_created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default Chat;