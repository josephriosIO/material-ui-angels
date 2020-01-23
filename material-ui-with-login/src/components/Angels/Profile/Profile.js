import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { updateUser, createOrGetUser } from '../../../../backend/backend';
import Error from '../../Errors/Error';
import ProfileForm from './ProfileForm';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';


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
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const user = await axios('/api/users/createOrGetUser');
      console.log(user.data)

      setProfile(user.data);

      setForm({
        name: user.data.name,
        bio: user.data.bio,
        location: user.data.location,
        phoneNumber: user.data.phoneNumber,
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
    try {

      const test = await axios.put(`/api/users/updateuser/${profile.id}`, { form });
      console.log(test);

      setErrorMsg('Updated Profile.');
      setErrorStatus('success');
      handleClick()
    } catch (err) {
      console.log(err);
      setErrorMsg('Error Updating Profile.');
      setErrorStatus('danger');
      handleClick()
    }

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
