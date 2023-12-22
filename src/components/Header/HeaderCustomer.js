import React, { useState, memo, useEffect } from 'react';
import { AppBar, Toolbar, styled, Menu, Modal } from '@mui/material';
import { useHistory } from "react-router-dom";
import { Box, IconButton, MenuItem } from '@material-ui/core';
import PersonIcon from '@mui/icons-material/Person';
import './Header.css';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShoppingCard from "../Shopping card/ShoppingCard"
import axios from "axios";

const HeaderCustomer = memo(() => {
    const [auth, setAuth] = useState(true);
    const role = JSON.parse(localStorage.getItem("role"));
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [openWallet, setOpenWallet] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [showShoppingCard, setShowShoppingCard] = useState(false);
    const [blurBackground, setBlurBackground] = useState(false);
    const val = JSON.parse(localStorage.getItem('email'));
    const [balance, setBalance] = useState(localStorage.getItem('wallet_balance') || 0);

    const handleClickProfile = () => {
        history.push("/edit-profile");
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
        .then((response) => console.log(response.data) )
        .catch((error) => console.log(error.response) );
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

    const handleOpenWallet = () => setOpenWallet(true);

    const handleCloseWallet= () => setOpenWallet(false);
    
    const handleAddAmount = (amount) => {
        setSelectedAmount(amount);
    };

    useEffect(() => {
      console.log(balance);
    }, [balance]);
    
    const handleIncreaseBalance = (e) => {
        e.preventDefault();
        const userData = {
            email: val,
            amount: selectedAmount
        };
        axios.post(
            "http://188.121.124.63/user/charge-wallet/", 
            userData,
            {headers: {
                'Content-Type' : 'application/json',
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Methods" : "POST",
                'Authorization' : "Bearer " + token.slice(1,-1)   
            }}
        )
        .then((response) => {
            const newBalance = response.data.wallet_balance;
            localStorage.setItem('wallet_balance', newBalance);
            setBalance(newBalance);
        })
        .catch((error) => {
            if (error.response) {
                console.log(error);
            }
        });
    };

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        flexGrow: 4,
    }));

    const handleCart = () => {
        history.push('/order-page');
    };

    const handleBackToHome = (e) => {
        history.push("/homepage-customer");
    };

    const handleOpenShoppingCard  = () => {
        setShowShoppingCard(true);
    };

    const handleCloseShoppingCard  = () => {
        setShowShoppingCard(false);
    };
    
    return ( 
        <div
            className={`container ${blurBackground ? 'blur-background' : ''}`}
        >
            <AppBar 
                sx={{position:"sticky", width:'fixed', padding: '0 !important', zIndex: '0', top: '0'}} 
                className="header"
            >
                <Toolbar 
                    className='header-toolbar'
                >
                    <img 
                        className='logo'
                        src="/logo4.png"
                        alt="NoWaste"
                        onClick={() => {
                            window.location.href = '/homepage-customer';
                        }}
                        style={{ cursor: 'pointer' }}                        
                    />
                    {auth && (
                        <div>
                            <IconButton color='inherit'>
                                {/* <Badge badgeContent={1} color='error'> */}
                                    <ShoppingCartIcon onClick={handleOpenShoppingCard}/>
                                    <Modal 
                                        open={showShoppingCard} 
                                        onClose={handleCloseShoppingCard}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box
                                            className="shopping-card-box" 
                                        >
                                            <ShoppingCard />
                                        </Box>
                                        
                                    </Modal>
                                {/* </Badge> */}
                            </IconButton>
                            <IconButton
                                size='large'
                                onClick={handleDashboard}
                                color="inherit"
                                title='Dashboard'
                            >
                                <DashboardIcon 
                                    fontSize="normal"
                                />
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
                                        ml: 0.5,
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
                                            right: 9,
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
                                    onClick={handleOpenWallet} 
                                    className='profile-font'
                                >
                                    <AccountBalanceWalletIcon 
                                        className='profile-icons'
                                    /> 
                                    Wallet
                                    <div 
                                        className='balance'
                                    >
                                        {balance} $
                                    </div>
                                </MenuItem>
                                <Modal
                                    open={openWallet}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                >
                                    <Box 
                                        className='credit-box'
                                    >
                                        <IconButton 
                                            className='close-icon' 
                                            onClick={handleCloseWallet}
                                        >
                                            <CloseIcon 
                                                fontSize='small'
                                            />
                                        </IconButton>
                                        <h2>
                                            Credit
                                        </h2>
                                        <div 
                                            className='blance-header'
                                        >
                                            Balance: {balance} $
                                        </div>
                                        <Stack 
                                            spacing={{ xs: 1, sm: 2 }} 
                                            direction="row" 
                                            useFlexGap 
                                            flexWrap="wrap" 
                                            sx={{ marginTop: '20px', marginLeft: '10px', alignItems:'center' }}
                                        >
                                            <Button 
                                                onClick={() => handleAddAmount(70)} 
                                                className='amount-header'
                                            >
                                                <Item 
                                                    className='item-header'
                                                >
                                                    70$
                                                </Item>
                                            </Button>
                                            <Button 
                                                onClick={() => handleAddAmount(80)} 
                                                className='amount-header'
                                            >
                                                <Item 
                                                    className='item-header'
                                                >
                                                    80$
                                                </Item>
                                            </Button>
                                            <Button 
                                                onClick={() => handleAddAmount(90)} 
                                                className='amount-header'
                                            >
                                                <Item 
                                                    className='item-header'
                                                >
                                                    90$
                                                </Item>
                                            </Button> 
                                        </Stack>
                                        <div 
                                            style={{ display: 'flex', alignItems: 'center', marginTop: '25px', marginLeft: '10px'}}
                                        >
                                            <button 
                                                className='button_wallet' 
                                                onClick={() => setSelectedAmount((prevAmount) => prevAmount - 1)} 
                                                disabled={selectedAmount < 1}
                                            >
                                                -
                                            </button>
                                            <h3 
                                                style={{ margin: '0px', textAlign: 'center', minWidth: '318px' }}
                                            >
                                                {selectedAmount}$
                                            </h3>
                                            <button 
                                                className='button_wallet' 
                                                onClick={() => setSelectedAmount((prevAmount) => prevAmount + 1)}
                                            >
                                                    +
                                            </button>
                                        </div>
                                        <div 
                                            style={{display: 'flex', justifyContent: 'center' , alignItems: 'center'}}
                                        >
                                            <Button 
                                                variant="contained" 
                                                id='payment-submit' 
                                                onClick={handleIncreaseBalance} 
                                                disabled={selectedAmount==0} 
                                                className={selectedAmount === 0 ? '' : 'payment-submit-enabled'}
                                            >
                                                Add to wallet
                                            </Button>
                                        </div>
                                        
                                    </Box>
                                </Modal>
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
        </div>
    );
});
export default HeaderCustomer;
