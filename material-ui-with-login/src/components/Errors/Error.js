import React from 'react';

const Error = props => {
  const { errorMsg, color } = props;
  return errorMsg.length > 0 ? (
    <div className={`alert  btn-${color}`}>{errorMsg}</div>
  ) : null;
};

export default Error;
