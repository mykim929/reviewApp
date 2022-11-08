import { useEffect, useState } from "react";
import { dbService } from "fbase";
import { collection, getDocs } from "firebase/firestore";
import dayjs from 'dayjs';
import { Link } from "react-router-dom";

const Home = () => {
    const [reviews, setReviews] = useState([]);
    const getReviews = async () => {
        const docRef = collection(dbService, "reviewapp");
        const dbReviews = await getDocs(docRef);
        dbReviews.forEach((doc) => {
            const reviewObject = {...doc.data(), id: doc.id};
            setReviews((prev) => [reviewObject, ...prev])
        });
    };
    useEffect(() => {
        getReviews();
    }, []);
    return (
        <>
            {reviews.map((review) => (
                <div key={review.id}>
                    <h4><Link to={`/Details/${review.id}`}>{review.title} : {dayjs(new Date(review.createdAt)).format('YYYY-MM-DD A HH:mm')}</Link></h4>
                </div>
            ))}
        </>
    );
}

export default Home;