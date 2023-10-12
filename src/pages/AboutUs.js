import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Grid } from '@mui/material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Stack from '@mui/material/Stack';
import "./AboutUs.css";
import HeaderCustomer from "../components/HeaderCustomer";


const steps = [
    {
        label: 'Create an account',
        description: `Open the website and sign up for a new account if you don't already have one. Typically, you'll need to provide your email address, and create a password.`,
    },
    {
        label: 'Browse Restaurants',
        description:
        `Explore the website's interface to discover the available restaurants. You can usually filter restaurants by type, rate or discount. Browse through restaurants, check discount, and raiting or discription to make an informed decision.`
    },
    {
        label: 'Select Items and Customize',
        description: `Once you've chosen a restaurant, navigate its menu and select the food items you want to order.`,
    },
    {
        label: 'Review Your Order',
        description: `Click Pay boutton to review the selected items, quantities, and any customizations you made. Verify that everything is correct before paying.`,
    },
    {
        label: 'Provide Delivery Details',
        description: `Enter the delivery address if it's different from your account address, and specify the payment type. If you want to pay from your wallet, first make sure that the amount of money in your wallet is sufficient`,
    },
    {
        label: 'Wait for Delivery and Enjoy Your Meal',
        description: `Relax and wait for the delivery to arrive at your specified address.Once your food arrives, check that all the items are correct and enjoy your delicious meal! If there are any issues with the order, contact customer support through the restaurant's phone or chat.`,
    },
    {
        label: 'Comment for restaurant',
        description: `You can comment your opinion about the quality of food so that others can use your experience.`,
    },
];


const AboutUs = () => {
    const [activeStep, setActiveStep] = React.useState(0);
    
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);

    };
    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const handleReset = () => {
        setActiveStep(0);

    };
    return ( 
        <div >
            <HeaderCustomer />
            <h2 className='about-us-title'>About Nowaste</h2>
            {/* <Grid container spacing={2}>
                <Grid item lg={6} md={6} sm={6} className='about-us-about'>
                    NoWaste is a food distribution app that connects customers with restaurants to offer high-quality restaurant food at affordable prices while reducing food waste.
                    <br></br>
                    By leveraging the app, customers have access to surplus food from restaurants that would otherwise go to waste, allowing them to enjoy delicious meals at a lower cost.
                    The primary goal of NoWaste is to foster a sustainable food ecosystem by providing a platform for restaurants to communicate their excess food availability and for customers to place orders.
                    Through this app, restaurants can effectively manage their inventory, ensuring that no food goes to waste and optimizing their operations.
                    The dedicated team of developers behind NoWaste is committed to curbing food waste and promoting sustainability in the food industry.
                    <br></br>
                    Their continuous efforts involve implementing innovative solutions and collaborating with restaurants to streamline the process of food preparation and distribution.
                    By facilitating efficient communication and coordination, NoWaste aims to minimize food wastage on a significant scale, benefiting both the environment and the economy.
                    With the user-friendly interface and seamless user experience, NoWaste makes it convenient for customers to order surplus food while contributing to the larger mission of reducing food waste globally.
                    Join the NoWaste community today and become part of the movement towards a more sustainable and responsible approach to food consumption.
                </Grid>    
                <Grid item lg={6} md={6} sm={6}>
                    <img src="/about-us-1.jpg" alt="ImageOfAboutUs" className='about-us-image'/>
                </Grid>
            </Grid> */}
            <Stack direction="row" spacing={2}>
                <div className='about-us-stack'>
                    <p>
                        NoWaste is a food distribution app that connects customers with restaurants to offer high-quality restaurant food at affordable prices while reducing food waste.
                        <br></br>
                        By leveraging the app, customers have access to surplus food from restaurants that would otherwise go to waste, allowing them to enjoy delicious meals at a lower cost.
                        The primary goal of NoWaste is to foster a sustainable food ecosystem by providing a platform for restaurants to communicate their excess food availability and for customers to place orders.
                        Through this app, restaurants can effectively manage their inventory, ensuring that no food goes to waste and optimizing their operations.
                        The dedicated team of developers behind NoWaste is committed to curbing food waste and promoting sustainability in the food industry.
                        <br></br>
                        Their continuous efforts involve implementing innovative solutions and collaborating with restaurants to streamline the process of food preparation and distribution.
                        By facilitating efficient communication and coordination, NoWaste aims to minimize food wastage on a significant scale, benefiting both the environment and the economy.
                        With the user-friendly interface and seamless user experience, NoWaste makes it convenient for customers to order surplus food while contributing to the larger mission of reducing food waste globally.
                        Join the NoWaste community today and become part of the movement towards a more sustainable and responsible approach to food consumption.
                    </p>
                    <img src="/about-us-1.jpg" alt="ImageOfAboutUs" className='about-us-image-title'/>
                </div>
            </Stack>
            <h2 className='about-us-title'>NoWaste process</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ maxWidth: 400 }} >
                    <Stepper activeStep={activeStep} orientation="vertical" >
                        {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                            StepIconProps={{
                                classes: {
                                    root: 'custom-step-icon',
                                    active: 'custom-step-icon-active',
                                },
                            }}    
                            optional={
                                index === 6 ? (
                                <Typography variant="caption">Last step</Typography>
                                ) : null
                            }
                            >
                            {step.label}
                            </StepLabel>
                            <StepContent>
                            <Typography>{step.description}</Typography>
                            <Box sx={{ mb: 2 }}>
                                <div>
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 1, mr: 1 }}
                                    className="about-us-continue-button"
                                >
                                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                </Button>
                                <Button
                                    variant="contained"
                                    className="about-us-continue-button"
                                    disabled={index === 0}
                                    onClick={handleBack}
                                    sx={{ mt: 1, mr: 1 }}
                                >
                                    Back
                                </Button>
                                </div>
                            </Box>
                            </StepContent>
                        </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length && (
                        <Paper square elevation={0} sx={{ p: 3 }}>
                        {/* <Typography>All steps completed - you&apos;re finished</Typography> */}
                        <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }} variant="contained" className="about-us-continue-button">
                            Reset
                        </Button>
                        </Paper>
                    )}
                    </Box>
                </div>
                <h2 className='about-us-title'>About team</h2>
                <Stack direction="row" spacing={3} >
                    <div className='about-us-team-top'>
                        <div className='about-us-image-container'>
                        <img src='/haniye.jpg' className='about-us-haniye' alt='Hanieh asady'></img>
                        <a href='https://github.com/HaniyeAsadi' className='about-us-link'>Haniye As'adi (Front-end)</a>
                        </div>
                        <div className='about-us-image-container'>
                        <img src='/helia.png' className='about-us-helia' alt='Helia Vafaei'></img>
                        <a href='https://github.com/helia-vafaei' className='about-us-link'>Helia Vafaei (Front-end)</a>
                        </div>
                        <div className='about-us-image-container'>
                        <img src='/setareh.jpg' className='about-us-setareh' alt='Setareh Babajani'></img>
                        <a href='https://github.com/setarehbabajani' className='about-us-link'>Setareh Babajani (Front-end)</a>
                        </div>
                    </div>
                </Stack>

                <Stack direction="row" spacing={3} >
                    <div className='about-us-team-bottom'>
                        <div className='about-us-image-container'>
                        <img src='/niayesh.jpg' className='about-us-niayesh' alt='Niayesh Khani'></img>
                        <a href='https://github.com/niayesh-khani' className='about-us-link'>Niayesh Khani (Front-end)</a>
                        </div>
                        <div className='about-us-image-container'>
                        <img src='/negin.jpg' className='about-us-negin' alt='Negin Haghighi'></img>
                        <a href='https://github.com/haghighy' className='about-us-link-negin'>Negin Haghighi (Back-end)</a>
                        </div>
                        <div className='about-us-image-container'>
                        <img src='/golbarg.jpg' className='about-us-golbarg' alt='Golbarg Sepehara'></img>
                        <a href='https://github.com/golbara/' className='about-us-link-golbarg'>Golbarg Sepehara (Back-end)</a>
                        </div>
                    </div>
                </Stack>
            <Footer/>
        </div>
        
    );
}

export default AboutUs;