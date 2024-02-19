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
		<div class='table-responsive'>
			<table class='table table-hover table-rounded table-striped gy-5 gs-1'>
				<thead>
					<tr class='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'>
						<th>review</th>
						<th>translate</th>
						<th className='w-100px'></th>
					</tr>
				</thead>
				<tbody>
					{newList.map((list) => (
						<tr>
							{list.id === editing ? (
								<>
									<td>
										<input
											type='text'
											className='form-control h-30px'
											value={newList[newList.findIndex((item) => item.id === list.id)].review}
											onChange={(e) => onChangeReview(list.id, e)}
										/>
									</td>
									<td>
										<input
											type='text'
											className='form-control h-30px'
											value={newList[newList.findIndex((item) => item.id === list.id)].translate}
											onChange={(e) => onChangeTranslate(list.id, e)}
										/>
									</td>
									<td>
										<button
											type='button'
											className='btn btn-sm btn-icon btn-outline btn-outline-success btn-active-light-success w-25px h-25px me-1'
											onClick={onSubmit}
										>
											<i className='ki-duotone ki-tablet-text-down fs-3'>
												<span class='path1'></span>
												<span class='path2'></span>
												<span class='path3'></span>
												<span class='path4'></span>
											</i>
										</button>
										<button
											type='button'
											className='btn btn-sm btn-icon btn-outline btn-outline-danger btn-active-light-danger w-25px h-25px'
											onClick={onCancle}
										>
											<i class='ki-duotone ki-cross fs-3'>
												<span class='path1'></span>
												<span class='path2'></span>
											</i>
										</button>
									</td>
								</>
							) : (
								<>
									<td>{list.review}</td>

									{list.translate ? (
										<td>{list.translate}</td>
									) : (
										<td>
											<input type='text' placeholder='해석을 입력하세요' />
										</td>
									)}
									<td>
										<button
											type='button'
											className='btn btn-sm btn-icon btn-outline btn-outline-primary btn-active-light-primary w-25px h-25px me-1'
											onClick={(e) => selectEditing(list.id, e)}
										>
											<i class='ki-duotone ki-pencil'>
												<span class='path1'></span>
												<span class='path2'></span>
											</i>
										</button>
										<button
											type='button'
											className='btn btn-sm btn-icon btn-outline btn-outline-success btn-active-light-success w-25px h-25px me-1'
											onClick={() => onAdd(list.id)}
										>
											<i className='ki-duotone ki-plus'></i>
										</button>
										<button
											type='button'
											className='btn btn-sm btn-icon btn-outline btn-outline-danger btn-active-light-danger w-25px h-25px me-1'
											onClick={(e) => onDeleteClick(list.id, e)}
										>
											<i class='ki-duotone ki-trash'>
												<span class='path1'></span>
												<span class='path2'></span>
												<span class='path3'></span>
												<span class='path4'></span>
												<span class='path5'></span>
											</i>
										</button>
									</td>
								</>
							)}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Details;
