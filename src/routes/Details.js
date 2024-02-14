import { useRef, useEffect, useState } from 'react';
import { dbService } from 'fbase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const Details = () => {
	const nextID = useRef(1);
	const [newList, setNewList] = useState([]);
	const [editing, setEditing] = useState(-1);
	const { no } = useParams();
	const getReview = async () => {
		const docRef = doc(dbService, 'reviewapp', no);
		const dbReviews = await getDoc(docRef);
		setNewList(dbReviews.data().list);
	};
	const selectEditing = (id, e) => setEditing(id);
	const onCancle = () => {
		setEditing(-1);
		getReview();
	};
	const onDeleteClick = async (id, event) => {
		const ok = window.confirm('삭제하시겠습니까?');
		if (ok) {
			let deleteResult = newList.filter((list) => list.id !== id);
			await updateDoc(doc(dbService, `reviewapp/${no}`), { list: deleteResult });
			getReview();
		}
	};
	const onChangeReview = (id, event) => {
		const {
			target: { value },
		} = event;
		let findIndex = newList.findIndex((item) => item.id === id);
		let copiedItems = [...newList];
		copiedItems[findIndex].review = value;
		setNewList(copiedItems);
	};
	const onChangeTranslate = (id, event) => {
		const {
			target: { value },
		} = event;
		let findIndex = newList.findIndex((item) => item.id === id);
		let copiedItems = [...newList];
		copiedItems[findIndex].translate = value;
		setNewList(copiedItems);
	};
	const onAdd = (id) => {
		nextID.current = Math.max(...newList.map((item) => item.id)) + 1;
		const input = {
			id: nextID.current,
			review: '',
			translate: '',
		};
		const emptyDelete = newList.filter((item) => item.review);
		const findIndex = emptyDelete.findIndex((item) => item.id === id);
		const tempList = emptyDelete.splice(findIndex + 1, 0, input);
		setNewList([...new Set(emptyDelete.concat(tempList))]);
		setEditing(nextID.current);
		console.log(newList);
	};
	const onSubmit = async (event) => {
		event.preventDefault();
		await updateDoc(doc(dbService, `reviewapp/${no}`), { list: newList });
		onCancle();
	};
	useEffect(() => {
		getReview();
	}, []);
	return (
		<>
			{newList.map((list) => (
				<div>
					{list.id === editing ? (
						<form>
							<input
								type='text'
								value={newList[newList.findIndex((item) => item.id === list.id)].review}
								onChange={(e) => onChangeReview(list.id, e)}
							/>
							<input
								type='text'
								value={newList[newList.findIndex((item) => item.id === list.id)].translate}
								onChange={(e) => onChangeTranslate(list.id, e)}
							/>
							<button type='button' onClick={onSubmit}>
								저장
							</button>
							<button type='button' onClick={onCancle}>
								취소
							</button>
						</form>
					) : (
						<>
							<span>{list.review}</span>
							{list.translate ? (
								<span>{list.translate}</span>
							) : (
								<>
									<input type='text' placeholder='해석을 입력하세요' />
								</>
							)}
							<button type='button' onClick={(e) => selectEditing(list.id, e)}>
								편집
							</button>
							<button type='button' onClick={(e) => onDeleteClick(list.id, e)}>
								삭제
							</button>
							<button type='button' onClick={() => onAdd(list.id)}>
								+
							</button>
						</>
					)}
				</div>
			))}
		</>
	);
};

export default Details;
