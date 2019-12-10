import '@reshuffle/code-transform/macro';
import React, { useEffect, useState } from 'react';
import { getStartup } from '../../../backend/backend';

const HomePage = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const user = await getStartup();

      setUser(...user);
    };
    fetchData();
  }, []);
  return (
    <div>
      <span>{user.companyName}</span>
    </div>
  );
};

export default HomePage;
