import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { updateUser, createOrGetUser } from '../../../../backend/backend';
import Error from '../../Errors/Error';
import ProfileForm from './ProfileForm';
import Snackbar from '@material-ui/core/Snackbar';


const Profile = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    name: '',
    location: '',
    bio: '',
    phoneNumber: '',
  });
  const [open, setOpen] = React.useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const user = await createOrGetUser();

      setProfile(user);

      setForm({
        name: user.name,
        bio: user.bio,
        location: user.location,
        phoneNumber: user.phoneNumber,
      });
    };
    fetchData();
  }, []);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const handleSubmits = async event => {
    event.preventDefault();
    await updateUser(form);
    setErrorMsg('Updated Profile.');
    setErrorStatus('success');
    handleClick()
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (!profile) {
    console.error('Profile is empty!');
  }

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Error
          onClose={handleClose}
          variant={errorStatus}
          message={errorMsg}
        />
      </Snackbar>
      <ProfileForm form={form} onChange={onChange} onSubmit={handleSubmits} />
    </React.Fragment>
  );
};

export default Profile;
