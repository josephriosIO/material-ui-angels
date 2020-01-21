import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	banner: {
		color: '#856404',
		backgroundColor: '#fff3cd',
		borderColor: '#ffeeba',
		position: 'relative',
		padding: '12px 20px',
		marginBottom: '16px',
		border: '1px solid transparent',
		borderRadius: '5px',
	},
	p_tag: {
		display: 'flex',
		justifyContent: 'center',
	},
	a_tag: {
		color: '#533f03',
		padding: '0 5px',
		fontWeight: 700,
	}
});

const EnvKeyBanner = () => {
	const classes = useStyles();
	return (
		<div className={classes.banner}>
			<p className={classes.p_tag}>This template requires a .env file with a key called ADMIN_USER_EMAIL.</p>
			<p className={classes.p_tag}>Press Remix and download the code, then read the
            <a className={classes.a_tag} href='https://github.com/reshufflehq/material-ui-angels'>README file</a> for more instructions.</p>
		</div>
	);
}

export default EnvKeyBanner;