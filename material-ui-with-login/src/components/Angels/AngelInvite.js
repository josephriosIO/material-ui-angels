import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { consumeInvite } from '../../../backend/backend';
import { Redirect } from 'react-router-dom';
const AngelInvite = () => {
  const { getLoginURL, authenticated } = useAuth();
  const [consumed, setConsumed] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    async function doInviteThings() {
      if (!consumed && !failed) {
        try {
          const url = window.location.href;
          const urlArr = url.split('/');
          let invite = urlArr[4];
          //PRODUCTION ONLY
          invite = invite.substring(0, invite.length - 1);
          console.log(invite);

          const invited = await consumeInvite(invite);

          if (invited) {
            return setConsumed(true);
          }
        } catch (err) {
          console.error(err);
          setFailed(true);
        }
      }
    }
    doInviteThings();
  }, [authenticated]);
  if (consumed) {
    return <Redirect to='/angels' />;
  }

  if (!authenticated || !consumed) {
    return (
      <div className='empty'>
        <div className='empty-icon'>
          <i className='icon icon-people'></i>
        </div>
        <p className='empty-title h5'>You been approved to be an angel!</p>
        <p className='empty-subtitle'>Please login to get angel status.</p>
        <a href={getLoginURL()}>Login</a>
      </div>
    );
  }
  return <Redirect to='/angels' />;
};
export default AngelInvite;
