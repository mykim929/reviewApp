import { useEffect, useState } from 'react';
import { dbService } from 'fbase';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const Home = () => {
	const [reviews, setReviews] = useState([]);
	const getReviews = async () => {
		const docRef = collection(dbService, 'reviewapp');
		const dbReviews = await getDocs(docRef);
		dbReviews.forEach((doc) => {
			const reviewObject = { ...doc.data(), id: doc.id };
			setReviews((prev) => [reviewObject, ...prev]);
		});
	};
	const onDeleteClick = (id, event) => {
		Swal.fire({
			html: `<strong class='fs-3'>삭제하시겠습니까?</strong>`,
			icon: 'error',
			buttonsStyling: false,
			showCancelButton: true,
			confirmButtonText: '네',
			cancelButtonText: '아니요',
			customClass: {
				confirmButton: 'btn btn-primary',
				cancelButton: 'btn btn-danger',
			},
		}).then((result) => {
			if (result.isConfirmed) {
				deleteDoc(doc(dbService, `reviewapp/${id}`));
				setReviews([]);
				getReviews();
			}
		});
	};
	useEffect(() => {
		getReviews();
	}, []);
	return (
		<div className='card mb-5 mb-xxl-8'>
			<div className='card-body pt-6'>
				{reviews.map((review, index, reviews) => (
					<div key={review.id}>
						<div className='d-flex flex-stack'>
							<div className='d-flex align-items-center flex-row-fluid flex-wrap'>
								<div className='flex-grow-1 me-2'>
									<Link
										to={`/Details/${review.id}`}
										className='text-gray-800 text-hover-primary fs-6 fw-bold'
									>
										{review.title}
									</Link>
									<span class='text-muted fw-semibold d-block fs-7'>
										{dayjs(new Date(review.createdAt)).format('YYYY-MM-DD A HH:mm')}
									</span>
								</div>
								<button
									type='button'
									className='btn btn-sm btn-light-danger me-2'
									onClick={(e) => onDeleteClick(review.id, e)}
								>
									<i class='ki-duotone ki-trash'>
										<span class='path1'></span>
										<span class='path2'></span>
										<span class='path3'></span>
										<span class='path4'></span>
										<span class='path5'></span>
									</i>
									Delete
								</button>
								<Link to={`/Reviews/${review.id}`} className='btn btn-sm btn-light-success'>
									<i class='ki-duotone ki-pencil'>
										<span class='path1'></span>
										<span class='path2'></span>
									</i>
									Reveiw
								</Link>
							</div>
						</div>
						{reviews.length - 1 > index && <div className='separator separator-dashed my-4'></div>}
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
