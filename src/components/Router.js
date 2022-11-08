import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Profile from "routes/Profile";
import Navigation from "./Navigation";
import Write from "routes/Write";
import Details from "routes/Details";

const AppRouter = ({ isLoggedIn }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation />}
            <Routes>
                {isLoggedIn ? (
                    <>
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/write" element={<Write />} />
                        <Route path="/Details/:no" element={<Details />} />
                    </>
                ):(
                    <Route path="/" element={<Auth />} />
                )}
            </Routes>
        </Router>
    );
}

export default AppRouter;