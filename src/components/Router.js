import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from 'routes/Home';
import Auth from 'routes/Auth';
import Profile from 'routes/Profile';
import Write from 'routes/Write';
import Details from 'routes/Details';
import Reviews from 'routes/Reviews';
import Navigation from './Navigation';
import Toolbar from './Toolbar';
import Header from './Header';

const AppRouter = ({ isLoggedIn }) => {
	return (
		<Router>
			<Header isLoggedIn={isLoggedIn} />
			<div className='app-wrapper flex-column flex-row-fluid'>
				<div className='app-main flex-column flex-row-fluid'>
					<div className='d-flex flex-column flex-column-fluid'>
						<Toolbar isLoggedIn={isLoggedIn} />
						<div className='app-content flex-column-fluid'>
							<div className='app-container container-fluid'>
								{isLoggedIn && <Navigation />}
								<Routes>
									{isLoggedIn ? (
										<>
											<Route path='/' element={<Home isLoggedIn={isLoggedIn} />} />
											<Route path='/profile' element={<Profile isLoggedIn={isLoggedIn} />} />
											<Route path='/write' element={<Write isLoggedIn={isLoggedIn} />} />
											<Route path='/details/:no' element={<Details />} />
											<Route path='/reviews/:no' element={<Reviews />} />
										</>
									) : (
										<Route path='/' element={<Auth isLoggedIn={isLoggedIn} />} />
									)}
								</Routes>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Router>
	);
};

export default AppRouter;
