import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';

const Navigation = () => {
	useEffect(() => {
		window.KTComponents.init();
	}, []);
	return (
		<div
			id='kt_app_sidebar'
			className='app-sidebar flex-column'
			data-kt-drawer='true'
			data-kt-drawer-name='app-sidebar'
			data-kt-drawer-activate='{default: true, lg: false}'
			data-kt-drawer-overlay='true'
			data-kt-drawer-width='250px'
			data-kt-drawer-direction='start'
			data-kt-drawer-toggle='#kt_app_sidebar_mobile_toggle'
		>
			<div
				id='kt_app_sidebar_main'
				className='d-flex flex-column justify-content-between h-100 hover-scroll-overlay-y my-2 d-flex flex-column'
				data-kt-scroll='true'
				data-kt-scroll-activate='true'
				data-kt-scroll-height='auto'
				data-kt-scroll-dependencies='#kt_app_header'
				data-kt-scroll-wrappers='#kt_app_main'
				data-kt-scroll-offset='5px'
			>
				<div
					id='#kt_app_sidebar_menu'
					data-kt-menu='true'
					data-kt-menu-expand='false'
					className='flex-column-fluid menu menu-sub-indention menu-column menu-rounded menu-active-bg mb-7'
				>
					<nav data-kt-menu-trigger='click' className='menu-item here show menu-accordion'>
						<NavLink to='/' className='menu-link'>
							<span className='menu-icon'>
								<i className='ki-duotone ki-element-11 fs-1'>
									<span className='path1'></span>
									<span className='path2'></span>
									<span className='path3'></span>
									<span className='path4'></span>
								</i>
							</span>
							<span className='menu-title'>Home</span>
						</NavLink>
						<NavLink to='/profile' className='menu-link'>
							<span className='menu-icon'>
								<i className='ki-duotone ki-some-files fs-1'>
									<span className='path1'></span>
									<span className='path2'></span>
								</i>
							</span>
							<span className='menu-title'>My Profile</span>
						</NavLink>
						<NavLink to='/write' className='menu-link'>
							<span className='menu-icon'>
								<i className='ki-duotone ki-chart-line-star fs-1'>
									<span className='path1'></span>
									<span className='path2'></span>
									<span className='path3'></span>
								</i>
							</span>
							<span className='menu-title'>new Review</span>
						</NavLink>
					</nav>
				</div>
			</div>
		</div>
	);
};
export default Navigation;
