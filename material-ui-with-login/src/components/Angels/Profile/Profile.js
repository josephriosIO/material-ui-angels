import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { getUser, updateProfile } from '../../../../backend/backend';
import Error from '../../Errors/Error';
import CreateIcon from '@material-ui/icons/Create';
import ProfileForm from './ProfileForm';

const Profile = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [editable, setEditable] = useState(true);
  const [errorStatus, setErrorStatus] = useState('');
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    name: '',
    location: '',
    bio: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();

      setProfile(...user);

      setForm({
        name: user[0].name,
        bio: user[0].bio,
        location: user[0].location,
        phoneNumber: user[0].phoneNumber,
      });
    };
    fetchData();
  }, []);

  const handleSubmits = async event => {
    event.preventDefault();
    await updateProfile(form);
    setErrorMsg('Saved.');
    setErrorStatus('success');
    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (!profile) {
    console.error('Profile is empty!');
  }

  return (
    <React.Fragment>
      <Error errorMsg={errorMsg} color={errorStatus} />
      <Typography variant='h6' gutterBottom>
        Update Profile
      </Typography>
      <ProfileForm
        editable={editable}
        setEditable={setEditable}
        form={form}
        onChange={onChange}
        onSubmit={handleSubmits}
      />
    </React.Fragment>
  );
};

export default Profile;
