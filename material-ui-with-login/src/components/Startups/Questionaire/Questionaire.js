import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { updateStartupProfile, getStartup } from '../../../../backend/backend';
import Error from '../../Errors/Error';
import { Redirect } from 'react-router-dom';
import { useAuth } from '@reshuffle/react-auth';

const Questionaire = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [formProfile, setProfile] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    location: '',
    missionStatement: '',
    phoneNumber: '',
    companySize: 0,
    funded: false,
  });
  const { profile } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getStartup();
      console.log(user);

      setProfile(...user);

      setForm({
        companyName: user[0].companyName,
        missionStatement: user[0].missionStatement,
        location: user[0].location,
        phoneNumber: user[0].phoneNumber,
        funded: user[0].funded,
        companySize: user[0].companySize,
      });
    };
    fetchData();
  }, []);

  const handleSubmits = async event => {
    event.preventDefault();
    await updateStartupProfile(form);
    setErrorMsg('Saved.');
    setErrorStatus('success');

    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
    setSubmitted(true);
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (!formProfile) {
    console.error('Profile is empty!');
  }

  return (
    <div>
      {submitted ? (
        <Redirect to={`/startups/profile/${profile.displayName}`} />
      ) : null}
      <Error errorMsg={errorMsg} color={errorStatus} />
      <h2>Fill out some info about your startup below!</h2>
      <form onSubmit={handleSubmits}>
        <div>
          <label>What is your companys name?</label>
          <input
            value={form.companyName}
            onChange={e => onChange(e)}
            name='companyName'
          />
        </div>
        <div>
          <label>What is your company located?</label>
          <input
            value={form.location}
            onChange={e => onChange(e)}
            name='location'
          />
        </div>
        <div>
          <label>How many people does your company employee?</label>
          <input
            value={form.companySize}
            onChange={e => onChange(e)}
            name='companySize'
          />
        </div>
        <div>
          <label>Is the company funded?</label>
          <input
            value={form.funded}
            onChange={e => onChange(e)}
            name='funded'
          />
        </div>
        <div>
          <label>What is your companys mission statement?</label>
          <input
            value={form.missionStatement}
            onChange={e => onChange(e)}
            name='missionStatement'
          />
        </div>
        <button type='submit'>submit</button>
      </form>
    </div>
  );
};
export default Questionaire;
