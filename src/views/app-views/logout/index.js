import React, {useEffect} from 'react'
import useMenu from '@hooks/useMenu';

const Logout = () => {

	const {handleSignOut} = useMenu();

	useEffect(() => {
		handleSignOut();
	});

	return (
		<div>
			Logout
		</div>
	)
}

export default Logout
