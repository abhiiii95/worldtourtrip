'use client'; 
import React, { useEffect, useState } from 'react';
import styles from "./newsLetter.module.scss"
import { Icon } from '@iconify/react';
import { subscribeEmail } from '@/services/subscribe.services';

const NewsLetter = () => {
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);

  function isValidEmail(email) {
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return regex.test(email);
  }

  const handleSubscribe = async () => {
    if (!isValidEmail(email)) {
      setInfo({ status: false, message: "Please enter a valid email." });
      return;
    }
    setLoading(true);
    try {
      const data = await subscribeEmail(email);
      setInfo(data);
    } catch (error) {
      setInfo({ status: false, message: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!info?.message) return;
    const timer = setTimeout(() => {
      setInfo({});
      setEmail("");
    }, 5000);
    return () => clearTimeout(timer);
  }, [info]);

  return (
    <section className={styles?.newsLetter}>
      <div className='container'>
        <div className={styles?.wrapper}>
          <div className={styles?.iconText}>
            <Icon icon="hugeicons:chat-notification" width="80" height="80" />
            <div>
              <h2 className={styles?.heading}>
                Travel <span>further</span> with us
              </h2>
              <p className={styles?.subText}>
                Get weekly destinations, tips & hidden gems in your inbox.
              </p>
            </div>
          </div>
          <div className={styles?.inputWrapper}>
            <input
              type='email'
              value={email}
              placeholder='Your Email'
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              disabled={loading}
            />
            <button onClick={handleSubscribe} disabled={loading || info.status === true}>
              {loading ? "Subscribing..." : info.status === true ? "Subscribed" : "Subscribe"}
            </button>
            {info?.message && (
            <p className={`${styles?.message} ${info.status ? styles?.success : styles?.error}`}>
              {info.message}
            </p>
          )}
         
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;