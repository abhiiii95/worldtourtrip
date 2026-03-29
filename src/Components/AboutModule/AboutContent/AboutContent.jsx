import React from 'react';
import styles from "./aboutContent.module.scss"

const AboutContent = () => {
  return (
    <section className={styles?.aboutContent}>
      <div className={"container"}>
        <p className={styles?.aboutContentP}>
        WorldTourTrip started because we grew tired of travel content that felt copied and pasted from somewhere else. The kind that lists ten things to do in a city without ever telling you what it actually feels like to be there. We wanted to change that, so we did. Behind this platform is a group of people who have genuinely been out there. Some of us travelled light for years, figuring things out as we went. Others are the type who research a trip for months before they ever pack a bag. Different styles, same obsession. We all believe that a well-written piece about a place can do something remarkable; it can make you feel like you have already arrived before your journey even begins. We are not here to sell you anything. WorldTourTrip is not a booking engine, not a comparison site, and not a platform with a hidden agenda. No pop-ups are asking you to register, no paywalls sit between you and our content, and no forms are fishing for your details. You come here, you read something that moves you, and you carry that with you. That is the whole point.</p>
      </div>
    </section>
  )
}

export default AboutContent
