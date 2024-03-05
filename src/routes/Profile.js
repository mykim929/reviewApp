import { useState, useEffect } from 'react';
import { storageService, authService } from 'fbase';
import { signOut, updateProfile } from 'firebase/auth';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Profile = ({ isLoggedIn }) => {
	const navigate = useNavigate();
	const [attachment, setAttachment] = useState('none');
	const [nickname, setNickname] = useState('');
	const [error, setError] = useState('');
	const onLogOutClick = () => {
		signOut(authService);
		navigate('/');
	};
	const onFileChange = (event) => {
		const {
			target: { files },
		} = event;
		const theFile = files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			const {
				currentTarget: { result },
			} = finishedEvent;
			setAttachment(result);
		};
		if (Boolean(theFile)) {
			reader.readAsDataURL(theFile);
		}
	};
	const onChange = (event) => {
		const {
			target: { name, value },
		} = event;
		if (name === 'nickname') {
			setNickname(value);
		}
	};

	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			let attachmentUrl = '';
			if (attachment !== '' && isLoggedIn.photoURL === '') {
				const attachmentRef = ref(storageService, `${isLoggedIn.uid}/${uuidv4()}`);
				await uploadString(attachmentRef, attachment, 'data_url');
				await getDownloadURL(attachmentRef).then((url) => {
					attachmentUrl = url;
				});
				await updateProfile(isLoggedIn, {
					photoURL: attachmentUrl,
				});
			} else if (nickname !== '' && isLoggedIn.displayName === '') {
				await updateProfile(isLoggedIn, {
					displayName: nickname,
				});
			} else {
				Swal.fire({
					html: `<strong class='fs-3'>아무것도 수정한 것이 없습니다.<br> 다시 수정해주십시요.</strong>`,
					icon: 'error',
					buttonsStyling: false,
					confirmButtonText: '네',
					customClass: {
						confirmButton: 'btn btn-danger',
					},
				});
			}
		} catch (error) {
			setError(error.message);
		}
	};
	const onClearAttachment = () => setAttachment('none');
	useEffect(() => {
		if (isLoggedIn.photoURL) {
			setAttachment(isLoggedIn.photoURL);
		}
		if (isLoggedIn.displayName) {
			setNickname(isLoggedIn.displayName);
		}
	}, []);
	return (
		<div className='d-flex flex-column flex-root'>
			<div className='d-flex flex-center flex-column flex-column-fluid'>
				<div className='w-lg-500px p-10 p-lg-15 mx-auto'>
					<form onSubmit={onSubmit}>
						<div className='fv-row mb-10 fv-plugins-icon-container text-center'>
							<div
								className={`image-input image-input-outline ${
									attachment === 'none' && 'image-input-empty'
								}`}
								data-kt-image-input='true'
								style={{
									backgroundImage: `url('${process.env.PUBLIC_URL}/assets/media/svg/avatars/blank.svg')`,
								}}
							>
								<div
									className='image-input-wrapper w-125px h-125px'
									style={{ backgroundImage: `url(${attachment})` }}
								></div>
								<label
									className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
									data-kt-image-input-action='change'
									data-bs-toggle='tooltip'
									aria-label='Change avatar'
									data-bs-original-title='Change avatar'
									data-kt-initialized='1'
								>
									<i className='ki-duotone ki-pencil fs-7'>
										<span className='path1'></span>
										<span className='path2'></span>
									</i>

									<input
										type='file'
										name='avatar'
										accept='.png, .jpg, .jpeg'
										onChange={onFileChange}
									/>
									<input type='hidden' name='avatar_remove' />
								</label>
								<span
									className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
									data-kt-image-input-action='cancel'
									data-bs-toggle='tooltip'
									aria-label='Cancel avatar'
									data-bs-original-title='Cancel avatar'
									data-kt-initialized='1'
								>
									<i className='ki-duotone ki-cross fs-2'>
										<span className='path1'></span>
										<span className='path2'></span>
									</i>
								</span>
								<span
									className='btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow'
									data-kt-image-input-action='remove'
									data-bs-toggle='tooltip'
									aria-label='Remove avatar'
									data-bs-original-title='Remove avatar'
									data-kt-initialized='1'
									onClick={onClearAttachment}
								>
									<i className='ki-duotone ki-cross fs-2'>
										<span className='path1'></span>
										<span className='path2'></span>
									</i>
								</span>
							</div>
						</div>
						<div class='fv-row mb-10 fv-plugins-icon-container'>
							<label class='form-label fw-bold text-dark fs-6'>User Email</label>
							<input
								class='form-control form-control-lg form-control-solid'
								type='email'
								name='email'
								autoComplete='off'
								disabled
								value={isLoggedIn.email}
							/>
						</div>

						<div className='fv-row mb-10 fv-plugins-icon-container'>
							<label className='form-label fw-bold text-dark fs-6 mb-0'>Nickname</label>
							<input
								className='form-control form-control-lg form-control-solid'
								type='text'
								name='nickname'
								autoComplete='off'
								onChange={(e) => onChange(e)}
								value={nickname}
							/>
							<div className='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
						</div>
						{error && (
							<div className='alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row w-100 p-5 mb-20'>
								<i className='ki-duotone ki-message-text-2 fs-2hx text-danger me-4 mb-5 mb-sm-0'>
									<span className='path1'></span>
									<span className='path2'></span>
									<span className='path3'></span>
								</i>
								<div className='d-flex flex-column pe-0 pe-sm-10'>
									<h4 className='fw-bold'>Error</h4>
									<span>{error}</span>
								</div>
							</div>
						)}
						<button type='submit' class='btn btn-lg btn-success w-100 mb-5'>
							Save
						</button>
						<button
							type='button'
							id='kt_sign_in_submit'
							class='btn btn-lg btn-dark w-100 mb-5'
							onClick={onLogOutClick}
						>
							Log Out
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Profile;
