import React, { useEffect, useState } from 'react';
import styles from './index.module.scss'


function LoadingMap(props) {

  const { isLoading, timeout, children } = props;

  const [show, setShow] = useState(false)

  // For a good user experience
  // Showing the loading map animation for the timeout duration regardless of the main loading state
  useEffect(() => {
    const _timeout = timeout || 1200
    setTimeout(() => {
      setShow(true)
    }, _timeout);
  }, [timeout])

  return (
    show && isLoading ?
      children :
      <>
        <div className={styles.pin}></div>
        <div className={styles.pulse}></div>
      </>
  );
}


export default LoadingMap;
