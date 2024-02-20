import { useState } from 'react';
import { authService } from 'fbase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Auth = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [newAccount, setNewAccount] = useState(true);
	const [error, setError] = useState('');
	const onChange = async (event) => {
		const {
			target: { name, value },
		} = event;
		if (name === 'email') {
			setEmail(value);
		} else if (name === 'password') {
			setPassword(value);
		}
	};
	const onSubmit = async (event) => {
		event.preventDefault();
		try {
			let data;
			if (newAccount) {
				data = await createUserWithEmailAndPassword(authService, email, password);
			} else {
				data = await signInWithEmailAndPassword(authService, email, password);
			}
			console.log(data);
		} catch (error) {
			setError(error.message);
		}
	};
	const toggleAccount = () => setNewAccount((prev) => !prev);
	return (
		<div className='d-flex flex-column flex-root'>
			<div className='d-flex flex-center flex-column flex-column-fluid'>
				<div className='w-lg-500px p-10 p-lg-15 mx-auto'>
					<div class='mb-10 text-center'>
						{newAccount ? (
							<>
								<h1 class='text-dark mb-3'>Sign In to Review App</h1>
								<div class='text-gray-400 fw-semibold fs-4'>
									Already have an account
									<button
										type='button'
										class='btn btn-link btn-color-success btn-active-color-success fw-bold ms-5'
										onClick={toggleAccount}
									>
										Sign in here
									</button>
								</div>
							</>
						) : (
							<>
								<h1 class='text-dark mb-3'>Create an Account</h1>
								<div class='text-gray-400 fw-semibold fs-4'>
									New here?
									<button
										type='button'
										class='btn btn-link btn-color-success btn-active-color-success fw-bold ms-5'
										onClick={toggleAccount}
									>
										Create an Account
									</button>
								</div>
							</>
						)}
					</div>
					<form onSubmit={onSubmit}>
						<div class='fv-row mb-10 fv-plugins-icon-container'>
							<label class='form-label fs-6 fw-bold text-dark'>Email</label>
							<input
								class='form-control form-control-lg form-control-solid'
								type='email'
								name='email'
								autocomplete='off'
								value={email}
								onChange={onChange}
								required
							/>
							<div class='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
						</div>
						<div class='fv-row mb-10 fv-plugins-icon-container'>
							<div class='d-flex flex-stack mb-2'>
								<label class='form-label fw-bold text-dark fs-6 mb-0'>Password</label>
							</div>
							<input
								class='form-control form-control-lg form-control-solid'
								type='password'
								name='password'
								autocomplete='off'
								value={password}
								onChange={onChange}
								required
							/>
							<div class='fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback'></div>
						</div>
						{error && (
							<div class='alert alert-dismissible bg-light-danger d-flex flex-column flex-sm-row w-100 p-5 mb-20'>
								<i class='ki-duotone ki-message-text-2 fs-2hx text-danger me-4 mb-5 mb-sm-0'>
									<span class='path1'></span>
									<span class='path2'></span>
									<span class='path3'></span>
								</i>
								<div class='d-flex flex-column pe-0 pe-sm-10'>
									<h4 class='fw-bold'>Error</h4>
									<span>{error}</span>
								</div>
							</div>
						)}
						<div className='text-center'>
							<button type='submit' className='btn btn-lg btn-primary fw-bold w-100 mb-5'>
								{newAccount ? 'Create Account' : 'Log In'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Auth;
