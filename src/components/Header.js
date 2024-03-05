import { useEffect } from 'react';
import { authService } from 'fbase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn }) => {
	const navigate = useNavigate();
	const onLogOutClick = () => {
		signOut(authService);
		navigate('/');
	};
	useEffect(() => {
		window.KTThemeMode.init();
	}, []);
	return (
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
						<a href='/reviewApp' className='text-gray-700'>
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
				{isLoggedIn && (
					<>
						<div class='d-flex align-items-center flex-grow-1 justify-content-end me-2'>
							<div class='symbol symbol-40px symbol-lg-50px me-5'>
								{isLoggedIn.photoURL === null ? (
									<img
										src={`${process.env.PUBLIC_URL}/assets/media/svg/avatars/blank.svg`}
										alt='user'
									/>
								) : (
									<img src={isLoggedIn.photoURL} alt='user' />
								)}
							</div>
							<div class='d-flex flex-column'>
								{isLoggedIn.displayName !== null && (
									<div class='fw-bold d-flex align-items-center fs-5'>{isLoggedIn.displayName}</div>
								)}
								<div class='fw-bold text-muted fs-7'>{isLoggedIn.email}</div>
							</div>
						</div>
						<div class='d-flex align-items-center me-5'>
							<button
								class='btn btn-icon btn-icon-primary ms-1'
								data-kt-menu-trigger="{default:'click', lg: 'hover'}"
								data-kt-menu-attach='parent'
								data-kt-menu-placement='bottom-end'
							>
								<i class='ki-duotone ki-night-day theme-light-show fs-1'>
									<span class='path1'></span>
									<span class='path2'></span>
									<span class='path3'></span>
									<span class='path4'></span>
									<span class='path5'></span>
									<span class='path6'></span>
									<span class='path7'></span>
									<span class='path8'></span>
									<span class='path9'></span>
									<span class='path10'></span>
								</i>
								<i class='ki-duotone ki-moon theme-dark-show fs-1'>
									<span class='path1'></span>
									<span class='path2'></span>
								</i>
							</button>
							<div
								class='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-title-gray-700 menu-icon-gray-500 menu-active-bg menu-state-color fw-semibold py-4 fs-base w-150px'
								data-kt-menu='true'
								data-kt-element='theme-mode-menu'
							>
								<div class='menu-item px-3 my-0'>
									<a
										href='{()=>false}'
										class='menu-link px-3 py-2 active'
										data-kt-element='mode'
										data-kt-value='light'
									>
										<span class='menu-icon' data-kt-element='icon'>
											<i class='ki-duotone ki-night-day fs-2'>
												<span class='path1'></span>
												<span class='path2'></span>
												<span class='path3'></span>
												<span class='path4'></span>
												<span class='path5'></span>
												<span class='path6'></span>
												<span class='path7'></span>
												<span class='path8'></span>
												<span class='path9'></span>
												<span class='path10'></span>
											</i>
										</span>
										<span class='menu-title'>Light</span>
									</a>
								</div>
								<div class='menu-item px-3 my-0'>
									<a
										href='{()=>false}'
										class='menu-link px-3 py-2'
										data-kt-element='mode'
										data-kt-value='dark'
									>
										<span class='menu-icon' data-kt-element='icon'>
											<i class='ki-duotone ki-moon fs-2'>
												<span class='path1'></span>
												<span class='path2'></span>
											</i>
										</span>
										<span class='menu-title'>Dark</span>
									</a>
								</div>
							</div>
						</div>
						<div class='d-flex me-5 me-lg-20'>
							<button class='btn btn-sm btn-dark me-lg-5' onClick={onLogOutClick}>
								Log out
							</button>
						</div>
					</>
				)}
			</div>
			<div className='app-header-separator'></div>
		</div>
	);
};
export default Header;
