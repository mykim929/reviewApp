import { useEffect, useState } from 'react';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import { Link, matchRoutes, useLocation } from 'react-router-dom';
import { dbService } from 'fbase';
import { collection, getDocs } from 'firebase/firestore';

const Toolbar = ({ isLoggedIn }) => {
	const [reviews, setReviews] = useState([]);
	const [currentReview, setCurrentReview] = useState([]);
	const getReviews = async () => {
		const docRef = collection(dbService, 'reviewapp');
		const dbReviews = await getDocs(docRef);
		let tempList = [];
		dbReviews.forEach((doc) => {
			if (doc.data().creatorId === isLoggedIn.uid) {
				const reviewObject = { ...doc.data(), id: doc.id };
				tempList.push(reviewObject);
			}
		});
		setReviews(tempList);
	};
	const DynamicUserBreadcrumb = ({ match }) => {
		if (reviews.length > 0) {
			const custom = reviews.filter((list) => list.id === match.params.no);
			setCurrentReview(custom[0].title);
			return custom[0].title;
		}
	};
	const routes = [
		{ path: '/', breadcrumb: 'Home' },
		{ path: '/profile', breadcrumb: 'My Profile' },
		{ path: '/write', breadcrumb: 'Write' },
		{ path: '/reviews', breadcrumb: null },
		{ path: '/reviews/:no', breadcrumb: DynamicUserBreadcrumb },
		{ path: '/details', breadcrumb: null },
		{ path: '/details/:no', breadcrumb: DynamicUserBreadcrumb },
	];
	const breadcrumbs = useBreadcrumbs(routes);
	const useCurrentPath = () => {
		const location = useLocation();
		const [{ route }] = matchRoutes(routes, location);

		return route.path;
	};
	const currentPath = useCurrentPath();
	useEffect(() => {
		getReviews();
		console.log(breadcrumbs);
	}, []);
	return (
		<div id='kt_app_toolbar' className='app-toolbar  pt-5'>
			<div
				id='kt_app_toolbar_container'
				className='app-container  container-fluid d-flex align-items-stretch '
			>
				<div className='app-toolbar-wrapper d-flex flex-stack flex-wrap gap-4 w-100'>
					<div className='page-title d-flex flex-column gap-1 me-3 mb-2'>
						<ul className='breadcrumb breadcrumb-separatorless fw-semibold mb-6'>
							{breadcrumbs.map(({ breadcrumb, match }) => (
								<>
									{breadcrumb.props.children === 'Home' ? (
										<li className='breadcrumb-item text-gray-700 fw-bold lh-1'>
											<Link to={breadcrumb.key} className='text-gray-500 text-hover-primary'>
												<i className='ki-duotone ki-home fs-3 text-gray-400 me-n1'></i>
											</Link>
										</li>
									) : (
										<>
											<li className='breadcrumb-item'>
												<i className='ki-duotone ki-right fs-4 text-gray-700 mx-n1'></i>
											</li>
											<li className='breadcrumb-item text-gray-700 fw-bold lh-1'>
												{currentPath === match.route.path ? (
													<span className='text-gray-700' to={breadcrumb.key}>
														{breadcrumb}
													</span>
												) : (
													<Link className='text-gray-500 text-hover-primary' to={breadcrumb.key}>
														{breadcrumb}
													</Link>
												)}
											</li>
										</>
									)}
								</>
							))}
						</ul>
						<h1 className='page-heading d-flex flex-column justify-content-center text-dark fw-bolder fs-1 lh-0'>
							{breadcrumbs[breadcrumbs.length - 1].match.route.breadcrumb instanceof Function
								? currentReview
								: breadcrumbs[breadcrumbs.length - 1].match.route.breadcrumb}
						</h1>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Toolbar;
