import AboutBanner from '@/Common/Components/AboutBanner/AboutBanner'
import React from 'react';
import styles from "./privacy.module.scss";

const Privacy = () => {
    const bannerData = [
        {
            id:1,
            routeText:"Privacy",
            route:""
        }
    ]
  return (
    <>
      <AboutBanner banner={bannerData} heading={"Privacy Policy"}/>
      <section className={styles?.privacyWrapper}>
        <div className='container'>
            <div className={styles?.content}>
                <h2>
                Privacy Policy
                </h2>
                <h5>
                Introduction
                </h5>
                <p>
                Welcome to WorldTourTrip! We are glad you are here, and we are even more glad you are taking the time to read through our Privacy Policy. This page exists to give you a straightforward and honest account of how we think about your privacy while you are on our platform. Throughout this document, "www.worldtourtrip.com," "we," and "our" refer to WorldTourTrip, and "you," "your," and "users" refer to you as a visitor to our website. By the time you finish reading this, you should have a clear sense of where we stand. Continuing to use our platform after reading this means you are comfortable with what is here. If anything gives you pause, we would ask that you hold off on using the platform.
                </p>
                <h5>
                How We Do Not Use Your Information
                </h5>
                <p>
                Since nothing comes in from our readers, nothing gets used either. We do not send promotional emails, we do not push notifications your way, we do not place targeted ads in front of you based on your browsing, we do not pass anything along to third-party partners, we do not build user profiles, and we do not reach out to our readers for any kind of marketing. Your time on WorldTourTrip is yours completely, from when you arrive to when you leave.
                </p>
                <h5>
                Cookies
                </h5>
                <p>
                There is a possibility that when you visit WorldTourTrip, standard browser cookies are running in a limited and anonymous way behind the scenes. This helps us get a general sense of how the website is being used and makes sure things run smoothly for everyone who visits. None of these cookies holds anything that could identify you personally. They are simply there to give us a broad picture of how the platform is performing. If you would prefer not to have cookies saved on your device, your browser settings give you the option to block or limit them at any time. Some parts of the website might behave a little differently if you go that route, but your browser's help section will walk you through exactly how to manage it.
                </p>
                <h5>
                External Links
                </h5>
                <p>
                Some of our articles include links to other websites, put there so readers who want to explore a topic further have somewhere to go. We have no control over how those sites are run or what their privacy practices look like, so we recommend reading through their policies before you interact with them in any meaningful way. We are not responsible for anything that happens in relation to data or privacy when you visit a third-party site linked from our platform. A link appearing on WorldTourTrip is not an endorsement of that site or of the way it handles information.
                </p>
                <h5>
Your Rights as a Reader
                </h5>
                <p>
                WorldTourTrip holds no personal data about anyone who visits, but your rights as an individual still matter, and we think it is worth spelling them out. Drawing from widely recognised data protection principles, here is what you are entitled to:
                </p>
                <ul>
                  <li>
                  Right to Access: You have the right to know what information is held about you. Since WorldTourTrip collects nothing, there is nothing on file.
                  </li>
                  <li>
                  Right to Rectification: You have the right to have incorrect personal details put right. Since we hold no personal data, this right is automatically honoured.
                  </li>
                  <li>
                  Right to Restriction of Processing: You have the right to limit how your data is used. Since we process nothing, this right is fully respected without any effort on your part.
                  </li>
                  <li>
                  Right to Object: You have the right to push back on how your personal data is handled. Since WorldTourTrip handles none, this right is completely upheld.
                  </li>
                  <li>
                  Right to Data Portability: You have the right to receive your data in a usable format. Since we hold nothing about you, there is nothing to pass along.
                  </li>
                </ul>
                <h5>
                Changes to Privacy Policy
                </h5>
                <p>
                This Privacy Policy may be updated from time to time as things change. Any updates will take effect on this page the moment they go live. We recommend checking back occasionally so you are always across the latest version. If anything significant changes, we will make sure it is clearly signposted on the website. For any questions about what is written here, you are welcome to get in touch with us at info@worldtourtrip.com, and we will get back to you promptly.
                </p>
            </div>
        </div>
      </section>
    </>
  )
}

export default Privacy
