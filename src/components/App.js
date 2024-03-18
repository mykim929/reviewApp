import { useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';
import { onAuthStateChanged } from 'firebase/auth';

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	useEffect(() => {
		onAuthStateChanged(authService, (user) => {
			setTimeout(() => {
				if (user) {
					setIsLoggedIn(user);
				} else {
					setIsLoggedIn(false);
				}
				window.KTApp.hidePageLoading();
				setInit(true);
			}, 500);
		});
		setTimeout(() => {
			window.KTApp.showPageLoading();
		}, 200);
	}, []);
	return (
		<div className='app-page flex-column flex-column-fluid'>
			{init ? (
				<AppRouter isLoggedIn={isLoggedIn} />
			) : (
				<div class='page-loader flex-column' style={{ backgroundColor: '#F8F2EC' }}>
					<span class='spinner-border text-primary' role='status'></span>
					<span class='text-gray-800 fs-6 fw-semibold mt-5'>Loading...</span>
				</div>
			)}
			{/* <footer>&copy; {new Date().getFullYear()} Review App</footer> */}
		</div>
	);
}

export default App;
