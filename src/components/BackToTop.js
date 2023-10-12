import React from "react";
import { useEffect, useState } from "react";
import './BackToTop.css';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTop = () => {
    const [backToTopButton, setBackToTopButton] = useState(false);
    
    useEffect(() => {
        window.addEventListener("scroll", () => {
            if(window.scrollY > 100) {
                setBackToTopButton(true);
            }
            else {
                setBackToTopButton(false);
            }
        })
    }, [])

    const scrollUp = () => {
        window.scrollTo({
            top:0,
            behavior: "smooth"
        })
    }
    
    return ( 
        <div>
            {backToTopButton && (
                <button
                    className="back-to-top"
                    onClick={scrollUp} 
                    style={{position: "fixed", bottom: "20px", right: "20px", height: "40px", width: "40px"}}
                >
                    <KeyboardArrowUpIcon/>
                </button>
            )}
        </div>
    );
}

export default BackToTop;