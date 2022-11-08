import { useEffect, useState } from "react";
import { dbService } from "fbase";
import { doc, getDoc } from "firebase/firestore";
import { useParams } from "react-router-dom";

const Details = () => {
    const [data, setData] = useState({});
    const [list, setList] = useState([]);
    const { no } = useParams();
    const getReview = async () => {
        const docRef = doc(dbService, "reviewapp", no);
        const dbReviews = await getDoc(docRef);
        setList(dbReviews.data().list);
    };
    useEffect(() => {
        getReview();
    }, []);
    return (
        <>
            {list.map((list) => (
                <div>
                    <span>{list.review}</span>
                    <span>{list.translate}</span>
                </div>
            ))}
        </>
    );
}

export default Details;