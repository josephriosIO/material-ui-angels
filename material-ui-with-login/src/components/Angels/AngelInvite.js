import '@reshuffle/code-transform/macro';
import React, { useState } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { consumeInvite } from '../../../backend/backend';
import { Redirect } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import Error from '../Errors/Error';

const AngelInvite = (props) => {
  const { getLoginURL, authenticated } = useAuth();
  const [consumed, setConsumed] = useState(false);
  const [failed, setFailed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  if (authenticated && count < 1) {
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
          setErrorMsg('invite has been used or is invalid. Please ask admin for new invite link.');
          setErrorStatus('error');
          handleClick()
          setCount(count + 1);
        }
      }
    }
    doInviteThings();
  }

  
  if (consumed) {
    return <Redirect to='/angels' />;
  }
  
  if (!consumed) {
    return (
      <>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Error onClose={handleClose}
                 variant={errorStatus}
                 message={errorMsg}
          />
        </Snackbar>
        <div className='empty' 
             style={{ display: 'flex', 
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
      </>
    );
  }
  
  
  return <Redirect to='/angels' />;
};
export default AngelInvite;
