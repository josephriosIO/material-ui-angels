import React from 'react';

const Questionaire = () => {
  return (
    <div>
      <h2>Fill out some info about your startup below!</h2>
      <form>
        <div>
          <label>What is your companys name?</label>
          <input />
        </div>
        <div>
          <label>What is your company located?</label>
          <input />
        </div>
        <div>
          <label>How many people does your company employee?</label>
          <input />
        </div>
        <div>
          <label>Is the company funded?</label>
          <input />
        </div>
        <div>
          <label>What is your companys mission statement?</label>
          <input />
        </div>
        <button>submit</button>
      </form>
    </div>
  );
};
export default Questionaire;
