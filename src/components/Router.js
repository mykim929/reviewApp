import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from 'routes/Home';
import Auth from 'routes/Auth';
import Profile from 'routes/Profile';
import Navigation from './Navigation';
import Write from 'routes/Write';
import Details from 'routes/Details';
import Reviews from 'routes/Reviews';

const AppRouter = ({ isLoggedIn }) => {
	return (
		<Router>
			{isLoggedIn && <Navigation />}
			<Routes>
				{isLoggedIn ? (
					<>
						<Route path='/' element={<Home isLoggedIn={isLoggedIn} />} />
						<Route path='/profile' element={<Profile isLoggedIn={isLoggedIn} />} />
						<Route path='/write' element={<Write isLoggedIn={isLoggedIn} />} />
						<Route path='/Details/:no' element={<Details />} />
						<Route path='/Reviews/:no' element={<Reviews />} />
					</>
				) : (
					<Route path='/' element={<Auth isLoggedIn={isLoggedIn} />} />
				)}
			</Routes>
		</Router>
	);
};

export default AppRouter;
