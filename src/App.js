import { BrowserRouter as Router, Route } from "react-router-dom";
import Login from "./pages/SignUp/Login";
import SignUp from "./pages/SignUp/SignUp";
import ForgotPass from "./pages/SignUp/ForgotPass";
import Verification from "./pages/SignUp/Verification";
import NewPassword from "./pages/SignUp/NewPassword";
import Landing from "./pages/Landing/Landing";
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
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Route path="/sign-up">
          <SignUp />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/forgot-password">
          <ForgotPass />
        </Route>
        <Route path="/new-password">
          <NewPassword />
        </Route>
        <Route path="/verification">
          <Verification />
        </Route>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route path="/restaurant-view/:id">
          <RestaurantView />
        </Route>
        <Route path="/edit-profile">
          <EditProfile />
        </Route>
        <Route path="/edit-manager">
          <EditProfileManager />
        </Route>
        <Route path="/homepage-customer">
          <HomepageCustomer />
        </Route>
        <Route path="/order-page/:IdOfRestaurant">
          <OrderPage />
        </Route>
        <Route path="/edit-restaurant/:idM/restaurants/:idR">
          <EditRestaurant />
        </Route>
        <Route path="/homepage-restaurant">
          <HomepageRestaurant />
        </Route>
        <Route path="/map">
          <Map />
        </Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/dashboard-restaurant">
          <DashboardRestaurant />
        </Route>
        <Route path="/about-us">
          <AboutUs />
        </Route>
        <Route path="/chats">
          <Chat />
        </Route>
        <Route path="/admin">
          <Admin />
        </Route>
      </AuthProvider>    
    </Router>
  );
}

export default App;
