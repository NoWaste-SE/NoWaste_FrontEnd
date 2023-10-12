import { AppBar, Toolbar, styled, Menu, alpha, InputBase, IconButton, Badge, MenuItem, Modal } from '@mui/material';
import * as React from 'react';
import {useHistory } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AccountCircle } from '@material-ui/icons';
import PersonIcon from '@mui/icons-material/Person';
import { useState } from 'react';
import '../components/Header.css';
import Avatar from '@mui/material/Avatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Logout from '@mui/icons-material/Logout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import axios from "axios";


const Header = React.memo(() => {
    const [auth, setAuth] = React.useState(true);
    const role = JSON.parse(localStorage.getItem("role"));
    const history = useHistory();
    const token = localStorage.getItem('token');

    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0, 
        marginRight: theme.spacing(8), 
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1), 
            width: 'auto',
        },
    }));
    
    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));
    
    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
            },
    },
    }));

    const handleClickProfile = () => {
        history.push("/edit-profile");
    }
    const handleClickLogOut = () => {
        localStorage.removeItem("token");
        history.push("/landing");
    }
    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget);
        };

    const handleDashboard = () => {
        setAnchorEl(null);
        if (role === "customer")
            history.push("/dashboard");
        else
            history.push("/dashboard-restaurant");
    }
    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [openWallet, setOpenWallet] = React.useState(false);
    const handleOpenWallet = () => setOpenWallet(true);
    const handleCloseWallet= () => setOpenWallet(false);
    

    const [selectedAmount, setSelectedAmount] = useState(0);

    const handleAddAmount = (amount) => {
        setSelectedAmount(amount);
    };

    // const handleIncreaseBalance = () => {
    //     if (selectedAmount !== 0) {
    //     setBalance((prevBalance) => prevBalance + selectedAmount);
    //     setSelectedAmount(0);
    //     document.getElementById('payment-submit').classList.add('payment-submit-enabled');
    //     }
    // };

    const val = JSON.parse(localStorage.getItem('email'));

    const [balance, setBalance] = useState(localStorage.getItem('wallet_balance') || 0);

    useEffect(() => {
      console.log(balance);
    }, [balance]);
    
    const handleIncreaseBalance = (e) => {
      e.preventDefault();
      const userData = {
        email: val,
        amount: selectedAmount
      };
      console.log(userData);
      console.log(val)
      axios.post("http://188.121.124.63/user/charge-wallet/", userData,
        {headers: {
            'Content-Type' : 'application/json',
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Methods" : "POST,PATCH",
            'Authorization' : "Token " + token.slice(1,-1)   
        }})

        .then((response) => {
          console.log(response);
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
    const handleCart = () => {
        history.push('/order-page');
      };
    
    return ( 
        <>
        <AppBar 
        sx={{position:"sticky", width:'fixed', padding: '0 !important'}} 
        className="header-restaurant-view">
            <Toolbar className='toolbar-restaurant-view'>
                <img 
                    className='logo'
                    src="/logo4.png"
                    alt="NoWaste"
                />
                <Search >
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        // onChange={handleChange}
                    />
                </Search>
                {auth && (
                <div >
                    
                    <IconButton color='inherit'>
                        <Badge badgeContent={1} color='error'>
                            <ShoppingCartIcon onClick={handleCart}/>
                        </Badge>
                    </IconButton>
                    <IconButton
                        size='large'
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                        className='last-icon-restaurant-view'
                    >
                        <PersonIcon fontSize="normal"/>
                    </IconButton>
                    
                    <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={open}
                        onClose={handleClose}
                        // onClick={handleClose}
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
                            mr: 1,
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
                            zIndex: 0,
                            },
                        },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem onClick={handleClickProfile} className='profile-font'>
                        <AccountBoxIcon className='profile-icons'/> Profile
                        </MenuItem>
                        <MenuItem onClick={handleOpenWallet} className='profile-font'>
                        <AccountBalanceWalletIcon className='profile-icons'/> Wallet
                        <div className='balance'>{balance} $</div>
                        </MenuItem>
                        <Modal
                            // className='credit-box'
                            open={openWallet}
                            // onClose={handleCloseWallet}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box className='credit-box'>
                                <IconButton className='close-icon' onClick={handleCloseWallet}>
                                    <CloseIcon fontSize='small'/>
                                </IconButton>
                                <h2>Credit</h2>
                                {/* <h5>Current Balance : 10$</h5> */}
                                <div className='blance-header'>Balance : {balance} $</div>
                                <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" sx={{ marginTop: '20px', marginLeft: '5px', alignItems:'center' }}>
                                    {/* <Item>10$</Item>
                                    <Item>20$</Item>
                                    <Item>30$</Item> */}
                                    {/* <Item>
                                        <button onClick={() => handleAddAmount(10)} className='add-amount-header'>10$</button>
                                    </Item>
                                    <Item>
                                        <button onClick={() => handleAddAmount(20)} className='add-amount-header'>20$</button>
                                    </Item>
                                    <Item>
                                        <button onClick={() => handleAddAmount(30)} className='add-amount-header'>30$</button>
                                    </Item> */}
                                    <Button onClick={() => handleAddAmount(70)} className='amount-header'><Item className='item-header'>70$</Item></Button>
                                    <Button onClick={() => handleAddAmount(80)} className='amount-header'><Item className='item-header'>80$</Item></Button>
                                    <Button onClick={() => handleAddAmount(90)} className='amount-header'><Item className='item-header'>90$</Item></Button> 
                                    
                                
                                </Stack>
                                <div style={{ display: 'flex', alignItems: 'center', marginTop: '25px', marginLeft: '7px'}}>
                                <button className='button_wallet' onClick={() => setSelectedAmount((prevAmount) => prevAmount - 1)} disabled={selectedAmount < 1}>-</button>
                                <h3 style={{ margin: '0px', textAlign: 'center', minWidth: '260px' }}>{selectedAmount}$</h3>
                                <button className='button_wallet' onClick={() => setSelectedAmount((prevAmount) => prevAmount + 1)}>+</button>
                                </div>
                                <div style={{display: 'flex', justifyContent: 'center' , alignItems: 'center'}}>
                                    <Button variant="contained" id='payment-submit' onClick={handleIncreaseBalance} disabled={selectedAmount==0} className={selectedAmount === 0 ? '' : 'payment-submit-enabled'}>
                                        Add to wallet
                                    </Button>
                                </div>
                                
                            </Box>
                        </Modal>
                        <MenuItem onClick={handleDashboard} className='profile-font'>
                        <DashboardIcon className='profile-icons'/> Dashboard
                        </MenuItem>
                        <MenuItem onClick={handleClickLogOut} className='profile-font logout-item'>
                            <LogoutIcon className='profile-icons'/> 
                            Logout
                        </MenuItem>
                    </Menu>
                </div>
                )}
            </Toolbar>
        </AppBar>
        </>
    );
}
)
export default Header;