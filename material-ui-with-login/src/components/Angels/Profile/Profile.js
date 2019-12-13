import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { updateUser, createOrGetUser } from '../../../../backend/backend';
import Error from '../../Errors/Error';
import ProfileForm from './ProfileForm';

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

  const handleSubmits = async event => {
    event.preventDefault();
    await updateUser(form);
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
      <ProfileForm form={form} onChange={onChange} onSubmit={handleSubmits} />
    </React.Fragment>
  );
};

export default Profile;
