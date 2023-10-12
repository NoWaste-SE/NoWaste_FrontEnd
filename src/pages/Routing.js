import React from "react";
import {useHistory } from "react-router-dom";
import Login from "./Login";
import HomepageCustomer from "./HomepageCustomer";

export default function Routing(){
    const history = useHistory();
    // console.log(JSON.parse(localStorage.getItem("token")));
    const token = localStorage.getItem("token")
    console.log(token);
    if(token === '' || token === 'undefined' || token == null)
    {
        history.push("/login");
        return(<Login />);
    }
    else
    {
        history.push("/homepage-customer");
        return(<HomepageCustomer />);
    }
};