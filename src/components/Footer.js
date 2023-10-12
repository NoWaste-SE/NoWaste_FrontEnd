import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './Footer.scss';


const Footer = () => {
    return (
        
        <MDBFooter bgColor='light' className='wrapper text-center text-lg-start text-muted' style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', marginTop: '20px'}}>
        <br></br>
        {/* <section className='d-flex justify-content-center justify-content-lg-between p-2 border-bottom' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
            
            <div className='me-5 d-none d-lg-block'>
            <span>Get connected with us on social networks:</span>
            </div>

            <div>
            <a href='https://twitter.com/NoWaste39' className='me-4 text-reset'>
                <MDBIcon fab icon="twitter" />
            </a>
            <a href='https://instagram.com/no_waste39?igshid=ZDdkNTZiNTM=' className='me-4 text-reset'>
                <MDBIcon fab icon="instagram" />
            </a>
            </div>
        </section> */}

        <section className='' >
            <MDBContainer className='text-center text-md-start mt-5'>
            <MDBRow className='mt-3'>
                <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>
                    <MDBIcon icon="gem" className="me-3" />
                    NoWaste
                </h6>
                <p>
                    NoWaste is a food distribution app that sells extra high quality restaurant food at a lower price.
                </p>
                </MDBCol>

                <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
                    <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
                    <p>
                        <a href='http://localhost:3000/AboutUs' className='text-reset'>
                            About us
                        </a>
                    </p>
                </MDBCol>

                <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                    <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
                    <p>
                        <MDBIcon icon="home" className="me-2" />
                        IUST, Tehran, Iran
                    </p>
                    <p>
                        <MDBIcon icon="envelope" className="me-2" />
                            gen39.nowaste@gmail.com
                    </p>
                </MDBCol>

                <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
                    <h6 className='text-uppercase fw-bold mb-4'>Follow us</h6>
                    <p>
                        {/* <MDBIcon fab icon="twitter" className="me-2" /> */}
                        <a href='https://twitter.com/NoWaste39' className='me-2 text-reset'>
                            <MDBIcon fab icon="twitter" />
                        </a>
                        twitter.com/NoWaste39
                    </p>
                    <p>
                        {/* <MDBIcon fab icon="instagram" className="me-2" /> */}
                        <a href='https://instagram.com/no_waste39?igshid=ZDdkNTZiNTM=' className='me-2 text-reset'>
                            <MDBIcon fab icon="instagram" style={{fontSize: '120%' }}  />
                        </a>
                        instagram.com/no_waste39
                    </p>
                </MDBCol>
            </MDBRow>
            </MDBContainer>
        </section>

        <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
            © 2023 Copyright: &nbsp;
            <a className='text-reset fw-bold' href='http://localhost:3000/'>
            NoWaste.ir
            </a>
        </div>
        </MDBFooter>
    );
}
export default Footer;

