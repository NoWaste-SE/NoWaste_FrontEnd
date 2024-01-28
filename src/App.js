import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/SignUp/Login";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPass from "./pages/SignUp/ForgotPass";
import Verification from "./pages/SignUp/Verification";
import NewPassword from "./pages/SignUp/NewPassword";
import Landing from "./pages/Landing/Landing";
import { SpinningBubbles } from "react-loading";
import { useEffect, useState } from "react";
import RestaurantView from "./pages/Restaurant view/Restaurant-View";
import EditProfile from "./pages/Edit Profile/EditProfile";
import HomepageCustomer from "./pages/Homepage Customer/HomepageCustomer";
import OrderPage from "./pages/Order/OrderPage";
import EditRestaurant from "./pages/Edit Profile/EditRestaurant";
import HomepageRestaurant from "./pages/Homepage restaurant/HomepageRestaurant";
import EditProfileManager from "./pages/Edit Profile/EditProfileManager";
import Dashboard from "./components/Dashboard/Dashboard";
import DashboardRestaurant from "./components/Dashboard/DashboardRestaurant";
import Map from "./components/Map/Map";
import Chat from "./pages/Restaurant chat/RestaurantChats";
import AboutUs from "./pages/About Us/AboutUs";
import Admin from "./pages/Admin/Admin";
import TokenRefreshComponent from "./components/JWT/TokenRefreshComponent";
import { AuthProvider } from "./Context/AuthContext";
import RouterApp from "./Router";
function App() {
  return (
    <Router>
      <RouterApp />
    </Router>
  );
}

export default App;
