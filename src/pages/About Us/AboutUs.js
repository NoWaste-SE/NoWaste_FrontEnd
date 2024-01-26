import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Footer from '../../components/Footer/Footer';
import "./AboutUs.css";
import HeaderCustomer from "../../components/Header/HeaderCustomer";
import { Grid } from "@material-ui/core";

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
            <Typography 
                variant='h4' 
                className='about-us-title'
            >
                About Nowaste
            </Typography>
            <Grid container spacing={2} className='about-us-description'>
                <Grid item lg={10} md={9}>
                    <Typography>
                        NoWaste is a food distribution app that connects customers with restaurants to offer high-quality restaurant food at affordable prices while reducing food waste.
                        <br />
                        By leveraging the app, customers have access to surplus food from restaurants that would otherwise go to waste, allowing them to enjoy delicious meals at a lower cost.
                        The primary goal of NoWaste is to foster a sustainable food ecosystem by providing a platform for restaurants to communicate their excess food availability and for customers to place orders.
                        Through this app, restaurants can effectively manage their inventory, ensuring that no food goes to waste and optimizing their operations.
                        The dedicated team of developers behind NoWaste is committed to curbing food waste and promoting sustainability in the food industry.
                        <br></br>
                        Their continuous efforts involve implementing innovative solutions and collaborating with restaurants to streamline the process of food preparation and distribution.
                        By facilitating efficient communication and coordination, NoWaste aims to minimize food wastage on a significant scale, benefiting both the environment and the economy.
                        With the user-friendly interface and seamless user experience, NoWaste makes it convenient for customers to order surplus food while contributing to the larger mission of reducing food waste globally.
                        Join the NoWaste community today and become part of the movement towards a more sustainable and responsible approach to food consumption.
                    </Typography>
                </Grid>
                <Grid item lg={2} md={3}>
                    <img 
                        src="/about-us-1.jpg" 
                        alt="ImageOfAboutUs" 
                        className='image'
                    />
                </Grid>
            </Grid>
            <Typography 
                variant='h4' 
                className='about-us-title'
            >
                NoWaste Process
            </Typography>
            <Box
                className='about-us-steps'
            >
                <Stepper 
                    activeStep={activeStep} 
                    orientation="vertical" 
                >
                    {steps.map((step, index) => (
                        <Step key={step.label}>
                            <StepLabel
                                StepIconProps={{
                                    classes: {
                                        root: 'custom-step-icon',
                                        active: 'custom-step-icon',
                                    }
                                }}    
                                optional={
                                    index === steps.length -1 ? (
                                        <Typography variant="caption">
                                            Last step
                                        </Typography>
                                    ) : null
                                }
                            >
                                {step.label}
                            </StepLabel>
                            <StepContent>
                                <Typography>
                                    {step.description}
                                </Typography>
                                <Box sx={{ mb: 2 }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                        className="about-us-button"
                                    >
                                        {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className="about-us-button"
                                        disabled={index === 0}
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Back
                                    </Button>
                                </Box>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} sx={{ p: 3 }}>
                        <Button 
                            onClick={handleReset} 
                            sx={{ mt: 1, mr: 1 }} 
                            variant="contained" 
                            className="about-us-button"
                        >
                            Reset
                        </Button>
                    </Paper>
                )}
            </Box>
            <Typography 
                variant='h4' 
                className='about-us-title'
            >
                About Team
            </Typography>
            <Grid container className='about-us-grid'>
            <Grid item md={4} sm={4} xs={6} className='about-us-member'>    
                    <img 
                        src='/AboutUs/negin.jpg' 
                        alt='Negin Haghighi'
                        className='about-us-img'
                    />
                    <a 
                        href='https://github.com/haghighy' 
                        className='link-aboutus-aboutus'
                    >
                        Negin Haghighi (Back-end)
                    </a>
                </Grid>
                <Grid item md={4} sm={4} xs={6} className='about-us-member'>       
                    <img 
                        src='/AboutUs/golbarg.jpg' 
                        alt='Golbarg Sepehara'
                        className='about-us-img'
                    />
                    <a 
                        href='https://github.com/golbara/' 
                        className='link-aboutus'
                    >
                        Golbarg Sepehara (Back-end)
                    </a>
                </Grid>
                <Grid item md={4} sm={4} xs={6} className='about-us-member'>    
                    <img 
                        src='/AboutUs/melika.jpg' 
                        alt='Melika Mohamadi Fakhar'
                        className='about-us-img'
                    />
                    <a 
                        href='https://github.com/melikamohamadifakhar' 
                        className='link-aboutus'
                    >
                        Melika Mohamadi Fakhar (Back-end)
                    </a>
                </Grid>
                <Grid item md={4} sm={4} xs={2} >
                    <img 
                        className='about-us-img'
                        src='/AboutUs/haniye.jpg' 
                        alt="Haniye As'adi"
                    />
                    <a 
                        href='https://github.com/HaniyeAsadi' 
                        className='link-aboutus'
                    >
                        Haniye As'adi (Front-end)
                    </a>
                </Grid>
                <Grid item md={4} sm={4} xs={6}>
                    <img 
                        src='/AboutUs/helia.png' 
                        alt='Helia Vafaei'
                        className='about-us-img'
                    />
                    <a 
                        href='https://github.com/helia-vafaei' 
                        className='link-aboutus'
                    >
                        Helia Vafaei (Front-end)
                    </a>
                </Grid>
                <Grid item md={4} sm={4} xs={6}>
                    <img 
                        src='/AboutUs/setareh.jpg' 
                        alt='Setareh Babajani'
                        className='about-us-img'
                    />
                    <a 
                        href='https://github.com/setarehbabajani' 
                        className='link-aboutus'
                    >
                        Setareh Babajani (Front-end)
                    </a>
                </Grid>
                <Grid item md={4} sm={4} xs={6}>   
                    <img 
                        src='/AboutUs/niayesh.jpg' 
                        alt='Niayesh Khani'
                        className='about-us-img'
                    />
                    <a 
                        href='https://github.com/niayesh-khani' 
                        className='link-aboutus'
                    >
                        Niayesh Khani (Front-end)
                    </a>
                </Grid>
                
            </Grid>
            <Footer/>
        </div> 
    );
}

export default AboutUs;