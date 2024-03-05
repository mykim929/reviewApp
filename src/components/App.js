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
			<div id='kt_app_header' className='app-header d-flex flex-column flex-stack'>
				<div className='d-flex align-items-center flex-stack flex-grow-1'>
					<div
						className='app-header-logo d-flex align-items-center flex-stack px-lg-11 mb-2'
						id='kt_app_header_logo'
					>
						<div
							className='btn btn-icon btn-active-color-primary w-35px h-35px ms-3 me-2 d-flex d-lg-none'
							id='kt_app_sidebar_mobile_toggle'
						>
							<i className='ki-duotone ki-abstract-14 fs-2'>
								<span className='path1'></span>
								<span className='path2'></span>
							</i>
						</div>
						<h1>
							<a href='/' className='text-gray-700'>
								Review App
							</a>
						</h1>
						<div
							id='kt_app_sidebar_toggle'
							className='app-sidebar-toggle btn btn-sm btn-icon btn-color-warning me-n2 d-none d-lg-flex'
							data-kt-toggle='true'
							data-kt-toggle-state='active'
							data-kt-toggle-target='body'
							data-kt-toggle-name='app-sidebar-minimize'
						>
							<i className='ki-duotone ki-exit-left fs-2x rotate-180'>
								<span className='path1'></span>
								<span className='path2'></span>
							</i>
						</div>
					</div>
				</div>
				<div className='app-header-separator'></div>
			</div>
			<div className='app-wrapper flex-column flex-row-fluid'>
				<div className='app-main flex-column flex-row-fluid'>
					<div className='d-flex flex-column flex-column-fluid'>
						{init ? <AppRouter isLoggedIn={isLoggedIn} /> : 'initializing ... '}
					</div>
				</div>
			</div>
			{/* <footer>&copy; {new Date().getFullYear()} Review App</footer> */}
		</div>
	);
}

export default App;
