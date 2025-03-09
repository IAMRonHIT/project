import React, { useEffect, useState } from 'react';
import styles from './TestConnection.module.css';

export function TestConnection() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/test-logging')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(err => setError(err.message));
  }, []);

  return (
    <div>
      <h2>Testing Backend Connection</h2>
      {message && <p className={styles.successMessage}>Success: {message}</p>}
      {error && <p className={styles.errorMessage}>Error: {error}</p>}
    </div>
  );
}
