'use client';

import { useEffect, useState } from 'react';

export default function LastUpdated() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span>Last updated: {time}</span>;
}
