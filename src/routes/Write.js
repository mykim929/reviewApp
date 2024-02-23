import { useState, useRef, useEffect } from 'react';
import { dbService } from 'fbase';
import { collection, addDoc } from 'firebase/firestore';

const Write = ({ isLoggedIn }) => {
	const nextID = useRef(1);
	const didMount = useRef(false);
	const [title, setTitle] = useState('');
	const [inputItems, setInputItems] = useState([{ id: 0, review: '', translate: '' }]);
	const onSubmit = (event) => {
		event.preventDefault();
		setInputItems(inputItems.filter((item) => item.review));
		didMount.current = true;
	};
	const onChange = (event) => {
		const {
			target: { name, value },
		} = event;
		if (name === 'title') {
			setTitle(value);
		}
	};
	const addInput = (event) => {
		event.preventDefault();
		const input = {
			id: nextID.current,
			review: '',
			translate: '',
		};
		setInputItems([...inputItems, input]);
		nextID.current += 1;
	};
	const deleteInput = (e, id) => {
		if (id) {
			setInputItems(inputItems.filter((item) => item.id !== id));
		}
	};
	const handleChange = (e, index) => {
		const {
			target: { value, name },
		} = e;
		const inputItemsCopy = JSON.parse(JSON.stringify(inputItems));
		if (name === 'review') {
			inputItemsCopy[index].review = value;
			setInputItems(inputItemsCopy);
		} else if (name === 'translate') {
			inputItemsCopy[index].translate = value;
			setInputItems(inputItemsCopy);
		}
	};
	useEffect(() => {
		if (didMount.current) {
			addDoc(collection(dbService, 'reviewapp'), {
				createdAt: Date.now(),
				creatorId: isLoggedIn.uid,
				title: title,
				list: inputItems,
			});
			setTitle('');
			setInputItems([{ id: 0, review: '', translate: '' }]);
			didMount.current = false;
		}
	}, [inputItems]);
	return (
		<form onSubmit={addInput}>
			<div className='form-floating mb-7'>
				<input
					type='text'
					className='form-control form-control-solid'
					id='floatingTitle'
					value={title}
					name='title'
					autoComplete='off'
					onChange={onChange}
					placeholder='제목'
					maxLength={1000}
				/>
				<label htmlFor='floatingTitle'>제목</label>
			</div>
			{inputItems.map((item, index) => (
				<div key={index} className='d-flex flex-stack'>
					<div className='d-flex align-items-center flex-row-fluid flex-wrap mb-2'>
						<div className='d-flex flex-grow-1 me-4'>
							<div className='form-floating col-sm-6 me-2'>
								<input
									type='text'
									name='review'
									className={`form-control form-control-solid list_${index}`}
									autoComplete='off'
									onChange={(e) => handleChange(e, index)}
									value={item.review}
									id={`floatingReview${index}`}
									placeholder='Review'
								/>
								<label htmlFor={`floatingReview${index}`}>Review</label>
							</div>
							<div className='form-floating col-sm-6 me-2'>
								<input
									type='text'
									name='translate'
									className={`form-control form-control-solid list_${index}`}
									autoComplete='off'
									onChange={(e) => handleChange(e, index)}
									value={item.translate}
									id={`floatingTranslate${index}`}
									placeholder='Translate'
								/>
								<label htmlFor={`floatingTranslate${index}`}>Translate</label>
							</div>
						</div>
						<button
							type='submit'
							className='btn btn-sm btn-icon btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary w-30px h-30px me-2'
						>
							<i className='ki-duotone ki-plus'></i>
						</button>
						<button
							type='button'
							className='btn btn-sm btn-icon btn-outline btn-outline-dashed btn-outline-danger btn-active-light-danger w-30px h-30px'
							onClick={(e) => deleteInput(e, item.id)}
						>
							<i className='ki-duotone ki-minus'></i>
						</button>
					</div>
				</div>
			))}
			<button
				type='button'
				value='save'
				onClick={onSubmit}
				className='btn btn-success w-100 w-sm-100px fw-bold mt-10'
			>
				<i className='bi bi-save me-1'></i>
				Save
			</button>
		</form>
	);
};

export default Write;
