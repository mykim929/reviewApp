import { authService } from 'fbase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Profile = ({ isLoggedIn }) => {
	const navigate = useNavigate();
	const onLogOutClick = () => {
		signOut(authService);
		navigate('/');
	};
	return (
		<div className='d-flex flex-column flex-root'>
			<div className='d-flex flex-center flex-column flex-column-fluid'>
				<div className='w-lg-500px p-10 p-lg-15 mx-auto'>
					<div class='mb-10 text-center'>
						<h1 class='text-dark mb-3'>My Profile</h1>
					</div>
					<div class='fv-row mb-7 fv-plugins-icon-container'>
						<label class='form-label fw-bold text-dark fs-6'>User Email</label>
						<input
							class='form-control form-control-lg form-control-solid'
							type='email'
							name='email'
							autocomplete='off'
							disabled
							value={isLoggedIn.email}
						/>
					</div>
					<button
						type='button'
						id='kt_sign_in_submit'
						class='btn btn-lg btn-dark w-100 mb-5'
						onClick={onLogOutClick}
					>
						Log Out
					</button>
				</div>
			</div>
		</div>
	);
};

export default Profile;
