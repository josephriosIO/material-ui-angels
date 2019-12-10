import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CreateIcon from '@material-ui/icons/Create';

const ProfileForm = props => {
  const { form, handleSubmits, onChange, editable, setEditable } = props;
  return (
    <form onSubmit={handleSubmits}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <div style={{ width: '85%', display: 'flex' }}>
            <TextField
              onChange={e => onChange(e)}
              value={form.name}
              placeholder='Placeholder'
              id='standard-normal'
              name='name'
              label='Name'
              fullWidth
              disabled={editable}
            />
            <CreateIcon
              style={{ cursor: 'pointer' }}
              onClick={() => setEditable(!editable)}
            />
          </div>
        </Grid>

        <Grid item xs={12}>
          <div style={{ width: '85%', display: 'flex' }}>
            <TextField
              onChange={e => onChange(e)}
              value={form.location}
              id='location'
              name='location'
              label='Location'
              fullWidth
              disabled={editable}
            />
            <CreateIcon
              style={{ cursor: 'pointer' }}
              onClick={() => setEditable(!editable)}
            />
          </div>
        </Grid>

        <Grid item xs={12}>
          <div style={{ width: '85%', display: 'flex' }}>
            <TextField
              value={form.phoneNumber}
              onChange={e => onChange(e)}
              id='number'
              name='phoneNumber'
              label='Phone Number'
              fullWidth
              disabled={editable}
            />
            <CreateIcon
              style={{ cursor: 'pointer' }}
              onClick={() => setEditable(!editable)}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <div style={{ width: '85%', display: 'flex' }}>
            <TextField
              value={form.bio}
              onChange={e => onChange(e)}
              id='bio'
              name='bio'
              label='Bio'
              fullWidth
              multiline
              rows='6'
              disabled={editable}
            />
            <CreateIcon
              style={{ cursor: 'pointer' }}
              onClick={() => setEditable(!editable)}
            />
          </div>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
        <Button type='submit' variant='contained' color='primary'>
          Save
        </Button>
      </Grid>
    </form>
  );
};

export default ProfileForm;
