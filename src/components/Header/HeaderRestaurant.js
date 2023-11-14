import React, { useState, memo} from 'react';
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AppBar, Toolbar, Menu, IconButton, MenuItem } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import './Header.css';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailIcon from '@mui/icons-material/Email';

const HeaderRestaurant = memo(() => {
    const [auth, setAuth] = useState(true);
    const role = JSON.parse(localStorage.getItem("role"));
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const val = JSON.parse(localStorage.getItem('email'));    

    const handleClickProfile = () => {
        history.push("/edit-manager");
    };

    const handleClickLogOut = () => {
        localStorage.removeItem("token");
        axios.get(
            `http://188.121.124.63/user/logout/`,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "GET",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error.response);
        });
        history.push("/");
    };

    const handleMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleDashboard = () => {
        setAnchorEl(null);
        if (role === "customer")
            history.push("/dashboard");
        else
            history.push("/dashboard-restaurant");
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };    

    const handleClickOnChat = (e) => {
        history.push('/chats');
    };

    return ( 
        <>
            <AppBar 
                sx={{position:"sticky", width:'fixed', padding: '0'}} 
                className="header"
            >
                <Toolbar className='header-toolbar'>
                    <img 
                        className='logo'
                        src="/logo4.png"
                        alt="NoWaste"
                        onClick={() => {
                            window.location.href = '/homepage-restaurant';
                        }}
                        style={{ cursor: 'pointer' }}                        
                    />
                    {auth && (
                        <div >
                            <IconButton
                                size='large'
                                onClick={handleClickOnChat}
                                color="inherit"
                                title='Chats'
                            >
                                <EmailIcon fontSize="normal"/>
                            </IconButton>
                            <IconButton
                                size='large'
                                onClick={handleDashboard}
                                color="inherit"
                                title='Dashboard'
                            >
                                <DashboardIcon fontSize="normal"/>
                            </IconButton>
                            <IconButton
                                size='large'
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                                className='last-icon-header'
                            >
                                <PersonIcon 
                                    fontSize="normal"
                                />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        width : 190,
                                        borderRadius : 3,
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1,
                                        '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1
                                        },
                                        '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 12,
                                        width: 11,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform: 'translateY(-50%) rotate(45deg)',
                                        zIndex: 0
                                        }
                                    }
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem 
                                    onClick={handleClickProfile} 
                                    className='profile-font'
                                >
                                    <AccountBoxIcon 
                                        className='profile-icons'
                                    /> 
                                    Profile
                                </MenuItem>
                                <MenuItem 
                                    onClick={handleClickLogOut} 
                                    className='profile-font logout-item'
                                >
                                    <LogoutIcon 
                                        className='profile-icons'
                                    /> 
                                    Logout
                                </MenuItem>
                            </Menu>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </>
    );
});

export default HeaderRestaurant;