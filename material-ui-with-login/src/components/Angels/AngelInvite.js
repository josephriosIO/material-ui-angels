import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { consumeInvite } from '../../../backend/backend';
import { Redirect } from 'react-router-dom';
const AngelInvite = (props) => {
  const { getLoginURL, authenticated } = useAuth();
  const [consumed, setConsumed] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    async function doInviteThings() {
      if (!consumed && !failed) {
        try {
          const urlPath = props.location.pathname;
          const invite = urlPath.slice(8);
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
    // eslint-disable-next-line
  }, [authenticated]);

  if (consumed) {
    return <Redirect to='/angels' />;
  }

  if (!authenticated || !consumed) {
    return (
        <div className='empty' style={{ display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        flexDirection: 'column', 
                                        height: '100vh' }}
         >
          <div>
            <div className='empty-icon'>
              <i className='icon icon-people'></i>
            </div>
            <p className='empty-title h5'>You been approved to be an angel by an admin!</p>
            <p className='empty-subtitle'>Please login to get angel status instantly.</p>
            <a href={getLoginURL()}>Login</a>
          </div>
      </div>
    );
  }
  return <Redirect to='/angels' />;
};
export default AngelInvite;
