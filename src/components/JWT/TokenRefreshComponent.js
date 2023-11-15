import { useEffect } from 'react';
import axios from 'axios';

function TokenRefreshComponent() {
    const refresh_token = JSON.parse(localStorage.getItem("refresh_token"));
    const sendingData = {
        refresh: refresh_token
    };
    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://188.121.124.63/api/token/refresh/', sendingData);
            console.log(response.data);
            const newAccessToken = response.data.access;
            
            console.log("Token refresh successful - New access token: " + newAccessToken);

            localStorage.setItem('token', JSON.stringify(newAccessToken));
        } catch (error) {
            console.error('Token refresh failed:', error);
        }
    };

    useEffect(() => {
        const tokenRefreshInterval = setInterval(() => {
            refreshAccessToken();
            console.log("Token refresh request sent"); 
        }, 2 * 60 * 1000);

        // Clean up the interval when the component unmounts
        return () => {
            clearInterval(tokenRefreshInterval);
        };
    }, []);

    return null;
}

export default TokenRefreshComponent;
