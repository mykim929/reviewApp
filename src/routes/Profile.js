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
		<>
			<p>User : {isLoggedIn.email}</p>
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	);
};

export default Profile;
