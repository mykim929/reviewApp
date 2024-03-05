import { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		onAuthStateChanged(authService, (user) => {
			if (user) {
				setIsLoggedIn(user);
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);
	return (
		<div className='app-page flex-column flex-column-fluid'>
			{init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'initializing ... '}
			{/* <footer>&copy; {new Date().getFullYear()} Review App</footer> */}
		</div>
	);
}

export default App;
