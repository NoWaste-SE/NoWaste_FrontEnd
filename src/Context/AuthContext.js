import { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext(null);

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const history = useHistory();
    const [refresh_Token, setRefresh_Token] = useState(
        JSON.parse(localStorage.getItem("refresh_token"))
        ? JSON.parse(localStorage.getItem("refresh_token"))
            : null
    
    );

    const [authTokens, setAuthTokens] = useState(() =>
        JSON.parse(localStorage.getItem("token"))
    ? JSON.parse(localStorage.getItem("token"))
        : null
    );
    
    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem("myuser"))
    ? JSON.parse(localStorage.getItem("myuser"))
        : null
    );

    const [loading, setloading] = useState(true);
    console.log("first refresh token", refresh_Token);
    console.log(JSON.parse(localStorage.getItem("refresh_token")));

    const loginUser = async (values) => {
        try{
            const {data} = await axios.post("http://188.121.124.63:8000/user/login/", values, {
                headers: { "Content-Type": "application/json" },
            });
            console.log(data)
            setAuthTokens(data.access_token);
            setUser(data)
            setRefresh_Token(data.refresh_token);
            localStorage.setItem("token", JSON.stringify(data.access_token));
            localStorage.setItem("refresh_token", JSON.stringify(data.refresh_token));
            return data
        } catch (error) {
            console.log(error);
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("token");
        history.push("/login");
    };

    const contextData = {
        user,
        setUser,
        authTokens,
        setAuthTokens,
        loginUser,
        logoutUser,
    };

    const refreshAccessToken = async () => {
        const sendingData = {
            refresh: refresh_Token
        };
        
        console.log("refresh token is:", refresh_Token);
        try {
            const {data} = await axios.post(
                "http://188.121.124.63:8000/api/token/refresh/",sendingData
            );
            const newAccessToken = data.access;

            console.log("Token refresh successful - New access token: " + newAccessToken);
            setAuthTokens(newAccessToken);
            localStorage.setItem("token", JSON.stringify(newAccessToken));
        }
        catch (error)
        {
            console.error("Token refresh failed:", error);
            logoutUser();
        }
        if (loading) {
            setloading(false);
        }
    };

    useEffect(() => {
        if (loading && authTokens) {
        refreshAccessToken();
        console.log("Token refresh request sent");
        }
        const interval = setInterval(() => {
        if (authTokens) {
            refreshAccessToken();
            console.log("Token refresh request sent");
        }
        }, 2 * 60 * 1000);
        return () => clearInterval(interval);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
    );
};
