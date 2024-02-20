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
		const startDel = '<s class="text-danger">';
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
				<div className='form-check form-switch form-check-custom form-check-solid'>
					<input className='form-check-input' type='checkbox' id='translate' onClick={onCheck} />
					<label className='form-check-label' htmlFor='translate'>
						번역 복습 하기
					</label>
				</div>
			)}

			<form onSubmit={onSubmit}>
				<div className='table-responsive'>
					<table className='table table-hover table-rounded table-striped gy-5 gs-1'>
						<thead>
							<tr className='fw-bold fs-6 text-gray-800 border-bottom-2 border-gray-200'>
								<th>review</th>
								<th>answer</th>
								<>
									{result ? (
										<>
											<th>translate</th>
											<th>result</th>
										</>
									) : (
										<></>
									)}
								</>
							</tr>
						</thead>
						<tbody>
							{list.map((list, index) => (
								<>
									{result ? (
										<>
											{showEnglish ? (
												<tr>
													<td>{list.review}</td>
													{resultList[index] === '<s class="text-danger"></s>' ? (
														<td> - </td>
													) : (
														<td
															className='text-center'
															dangerouslySetInnerHTML={{ __html: resultList[index] }}
														></td>
													)}
													<td>{list.translate}</td>
													<td>
														{check[index] ? (
															<>
																<i className='ki-duotone ki-check-circle text-success fs-1'>
																	<span className='path1'></span>
																	<span className='path2'></span>
																</i>
															</>
														) : (
															<>
																<i className='ki-duotone ki-cross-circle text-danger fs-1'>
																	<span className='path1'></span>
																	<span className='path2'></span>
																</i>
															</>
														)}
													</td>
												</tr>
											) : (
												<tr>
													{resultList[index] === '<s class="text-danger"></s>' ? (
														<td className='text-center'> - </td>
													) : (
														<td dangerouslySetInnerHTML={{ __html: resultList[index] }}></td>
													)}
													<td>{list.translate}</td>
													<td>{list.review}</td>
													<td>
														{check[index] ? (
															<>
																<i className='ki-duotone ki-check-circle text-success fs-1'>
																	<span className='path1'></span>
																	<span className='path2'></span>
																</i>
															</>
														) : (
															<>
																<i className='ki-duotone ki-cross-circle text-danger fs-1'>
																	<span className='path1'></span>
																	<span className='path2'></span>
																</i>
															</>
														)}
													</td>
												</tr>
											)}
										</>
									) : (
										<>
											{showEnglish ? (
												<tr>
													<td>{list.review}</td>
													<td>
														<input
															type='text'
															className='form-control h-30px'
															name='translate'
															placeholder='해석을 입력하세요'
															onChange={(e) => handleChange(list.id, e)}
														/>
													</td>
												</tr>
											) : (
												<tr>
													<td>
														<input
															type='text'
															className='form-control h-30px'
															name='review'
															placeholder='영어를 입력하세요'
															onChange={(e) => handleChange(list.id, e)}
														/>
													</td>
													<td>{list.translate}</td>
												</tr>
											)}
										</>
									)}
								</>
							))}
						</tbody>
					</table>
				</div>
				<button type='submit' className='btn btn-success w-100 w-sm-150px fw-bold mt-4 me-2'>
					<i className='ki-duotone ki-tablet-ok fs-2'>
						<span className='path1'></span>
						<span className='path2'></span>
						<span className='path3'></span>
					</i>
					결과보기
				</button>
				<button
					type='button'
					className='btn btn-secondary w-100 w-sm-150px fw-bold mt-4 '
					onClick={onReset}
				>
					<i className='ki-duotone ki-arrows-circle fs-2'>
						<span className='path1'></span>
						<span className='path2'></span>
					</i>
					다시하기
				</button>
				{result && (
					<div className='d-flex align-items-center flex-column mt-3 w-100'>
						<div className='d-flex justify-content-between w-100 mt-auto mb-2'>
							<span className='fw-bolder fs-6 text-dark'>정답율</span>
							<span className='fw-bold fs-6 text-gray-400'>
								{((check.filter((value) => value === true).length / check.length) * 100).toFixed(2)}
								%
							</span>
						</div>
						<div className='h-8px mx-3 w-100 bg-light-success rounded'>
							<div
								className='bg-success rounded h-8px'
								role='progressbar'
								style={{
									width:
										((check.filter((value) => value === true).length / check.length) * 100).toFixed(
											2
										) + '%',
								}}
								aria-valuenow='50'
								aria-valuemin='0'
								aria-valuemax='100'
							></div>
						</div>
					</div>
				)}
			</form>
		</>
	);
};

export default Reviews;
