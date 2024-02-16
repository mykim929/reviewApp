import { useEffect, useState, useRef, useCallback } from 'react';
import { dbService } from 'fbase';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

const Reviews = () => {
	const didMount = useRef(false);
	const [list, setList] = useState([]);
	const [newList, setNewList] = useState([]);
	const [resultList, setResultList] = useState([]);
	const [showEnglish, setShowEnglish] = useState(true);
	const [result, setResult] = useState(false);
	const [check, setCheck] = useState([]);
	let resultArr = [];
	let wrongArrList = [];
	let checkArr = [];
	const { no } = useParams();
	const getReview = async () => {
		const docRef = doc(dbService, 'reviewapp', no);
		const dbReviews = await getDoc(docRef);
		setList(dbReviews.data().list);
		didMount.current = true;
	};
	const onCheck = () => setShowEnglish((prev) => !prev);
	const handleChange = (id, e) => {
		const {
			target: { value, name },
		} = e;
		let findIndex = newList.findIndex((item) => item.id === id);
		let copiedItems = [...newList];
		copiedItems[findIndex][name] = value;
		setNewList(copiedItems);
	};
	const checkCallback = useCallback(() => {
		const type = showEnglish ? 'translate' : 'review';
		for (const i in list) {
			checkWrong(i, type);
			delExpression(i, type);
		}
		setResultList(resultArr);
		setResult(true);
		setCheck(checkArr);
	}, [newList]);
	const checkWrong = (index, type, event) => {
		const getList = list[index][type];
		const getNewList = newList[index][type];
		let wrongArr = [];
		for (const i in getList) {
			if (getList[i] === getNewList[i]) {
				wrongArr = [...wrongArr, true];
			} else {
				wrongArr = [...wrongArr, false];
			}
		}
		wrongArrList = [...wrongArrList, wrongArr];
	};
	const delExpression = (index, type) => {
		const wrongList = wrongArrList[index];
		const getNewList = newList[index][type];
		let delArr = [];
		let tempTxt = [...getNewList];
		let changeCondition = true;
		let next = 0;
		const startDel = '<s>';
		const endDel = '</s>';
		for (const i in wrongList) {
			if (!wrongList[i]) {
				delArr = [...delArr, i];
			}
		}
		if (delArr.length > 0) {
			checkArr = [...checkArr, false];
		} else {
			checkArr = [...checkArr, true];
		}
		for (let j = 0; j < delArr.length; j++) {
			function closeTag() {
				tempTxt.splice(parseInt(delArr[j]) + next + 1, 0, endDel);
				changeCondition = true;
				next++;
			}
			if (isNaN(delArr[j + 1])) {
				closeTag();
				changeCondition = false;
			}
			if (changeCondition) {
				tempTxt.splice(parseInt(delArr[j]) + next, 0, startDel);
				changeCondition = false;
				next++;
			}
			if (delArr[j + 1] - delArr[j] > 1) {
				closeTag();
				changeCondition = true;
			}
		}
		tempTxt = tempTxt.join('');
		resultArr = [...resultArr, tempTxt];
	};
	const onSubmit = (event) => {
		event.preventDefault();
		checkCallback();
	};
	const onReset = () => {
		let addList = [];
		for (const item of list) {
			let input = {
				id: item.id,
				review: '',
				translate: '',
			};
			addList = [...addList, input];
		}
		setNewList(addList);
		setResult(false);
	};
	useEffect(() => {
		getReview();
	}, []);
	useEffect(() => {
		if (didMount.current) {
			onReset();
			didMount.current = false;
		}
	}, [list]);
	return (
		<>
			{result ? (
				<></>
			) : (
				<>
					<input type='checkbox' id='translate' onClick={onCheck} />
					<label htmlFor='translate'>번역 복습 하기</label>
				</>
			)}

			<form onSubmit={onSubmit}>
				{list.map((list, index) => (
					<div>
						{result ? (
							<>
								{showEnglish ? (
									<>
										<span>{list.review}</span>
										<span dangerouslySetInnerHTML={{ __html: resultList[index] }}></span>
										<span>{check[index] ? '맞음' : '틀림'}</span>
									</>
								) : (
									<>
										<span dangerouslySetInnerHTML={{ __html: resultList[index] }}></span>
										<span>{list.translate}</span>
										<span>{check[index] ? '맞음' : '틀림'}</span>
									</>
								)}
							</>
						) : (
							<>
								{showEnglish ? (
									<>
										<span>{list.review}</span>
										<input
											type='text'
											name='translate'
											placeholder='해석을 입력하세요'
											onChange={(e) => handleChange(list.id, e)}
										/>
									</>
								) : (
									<>
										<input
											type='text'
											name='review'
											placeholder='영어를 입력하세요'
											onChange={(e) => handleChange(list.id, e)}
										/>
										<span>{list.translate}</span>
									</>
								)}
							</>
						)}
					</div>
				))}
				<input type='submit' value='결과보기' />
				<button type='button' onClick={onReset}>
					다시하기
				</button>
				{result && (
					<span>
						정답율 :
						{((check.filter((value) => value === true).length / check.length) * 100).toFixed(2)}%
					</span>
				)}
			</form>
		</>
	);
};

export default Reviews;
