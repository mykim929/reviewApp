import { useEffect, useState } from 'react';
import { dbService } from 'fbase';
import { collection, doc, getDocs, deleteDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
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
	const onDeleteClick = async (id, event) => {
		const ok = window.confirm('삭제하시겠습니까?');
		if (ok) {
			await deleteDoc(doc(dbService, `reviewapp/${id}`));
			setReviews([]);
			getReviews();
		}
	};
	useEffect(() => {
		getReviews();
	}, []);
	return (
		<>
			{reviews.map((review) => (
				<div key={review.id}>
					<h4>
						<Link to={`/Details/${review.id}`}>
							{review.title} : {dayjs(new Date(review.createdAt)).format('YYYY-MM-DD A HH:mm')}
						</Link>
						<button type='button' onClick={(e) => onDeleteClick(review.id, e)}>
							삭제
						</button>
						<Link to={`/Reviews/${review.id}`}>복습</Link>
					</h4>
				</div>
			))}
		</>
	);
};

export default Home;
