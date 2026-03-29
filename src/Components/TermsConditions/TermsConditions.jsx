import React from 'react';
import styles from "./termsConditions.module.scss";
import AboutBanner from '@/Common/Components/AboutBanner/AboutBanner';

const TermsConditions = () => {
    const bannerData = [
        {
            id:1,
            route:"/terms",
            routeText:"Terms Conditions"
        }
    ]
  return (
    <>
      <AboutBanner banner={bannerData} heading={"Terms and Conditions – Online Travel Booking Policies"}/>
      <section className={styles?.termsWrapper}>
        <div className='container'>
            <div className={styles?.content}>
                <h2>
                Terms & Conditions
                </h2>
               
                <h5>
                Introduction
                </h5>
               <p>
               Hello and welcome to WorldTourTrip! We appreciate you taking a moment to read through our Terms & Conditions before diving into everything our platform has to offer. These terms are here to make sure you have a clear and honest picture of what WorldTourTrip is, how it operates, and what you can expect from us as a reader. Across this document, any mention of "www.worldtourtrip.com," "we," or "our" is a reference to WorldTourTrip, while "you," "your," and "users" refer to you as someone who visits and reads content on our website. Taking the time to go through this page means you will know exactly where we stand and what we expect in return. Continuing to browse our platform after reading this means you are on board with everything laid out here. If something here does not sit right with you, we would ask that you step away from the platform for now.
               </p>
               <h5>
               What We Offer
               </h5>
               <p>
               WorldTourTrip is a travel blog, and that is genuinely all it is. We put together destination guides, travel tips, cultural pieces, and articles that we hope make the world feel a little more within reach for the people who read them. We are not a travel agency, we are not a ticketing service, and we are not involved in any kind of booking or transaction. There are no accounts to create on our platform, no forms waiting to be filled out, and no data being asked of you at any point. When you visit WorldTourTrip, your only job is to read. That is all we have ever wanted from you.
               </p>
            <h5>
            Accuracy of Information
            </h5>
            <p>
            Each article that goes up on WorldTourTrip is put together carefully, with a real intention to be useful and honest. That said, the world of travel does not stand still. Situations shift, rules get updated, and the reality on the ground at any given destination can look very different from what was written about it months earlier. A few specific situations where our content may not reflect the latest picture include the following:
            </p>
            <ul>
              <li>
              (i) If entry requirements, visa conditions, or travel regulations connected to a particular destination have been updated or revised by the authorities responsible for them.
              </li>
              <li>
              (ii) If a destination has gone through political, environmental, or safety-related changes that could meaningfully affect what a traveller experiences there.
              </li>
              <li>
              (iii) If prices, schedules, or any operational details mentioned inside one of our articles have changed since the piece was first written and published.
              </li>
            </ul>
            <p>
            Before making any real travel plans, we strongly encourage you to check in with official government portals, embassy websites, or a licensed travel professional who can give you the most current picture. WorldTourTrip puts everything out there in good faith, but we cannot take on responsibility for plans made on the basis of our content alone.
            </p>
            <h5>
            Intellectual Property
            </h5>
            <p>
            Every single thing on WorldTourTrip, whether it is a written article, a photograph, an illustration, or the overall design of the site, has been created with genuine care and effort. It belongs to the people who contributed it, and it sits under the protection of copyright law. You are welcome to share a link to anything you find here, or lift a short passage for reference, as long as you credit us properly and point back to where it came from. What we do ask is that you do not take full articles and republish them elsewhere, use anything from our platform to make money without speaking to us beforehand, or run any kind of automated tool across the site to extract or copy our content.
            </p>
            <h5>
            External Links
            </h5>
            <p>
            Here and there, our articles will point you toward other websites, usually because we think they offer something useful or add context to what we have written. We have no involvement in how those sites are run or what their policies look like, so clicking through to one of them is entirely your call. We would encourage you to have a look at the terms and privacy policy of any external site you land on. If something goes wrong as a result of visiting a third-party website you found through us, that falls outside of what we can be responsible for. A link appearing on WorldTourTrip is not the same as us vouching for the site it leads to.
            </p>
            <h5>
            Limitation of Liability
            </h5>
            <p>We put a lot of effort into keeping WorldTourTrip reliable, accurate, and running properly. But we are an informational platform, and we have to be straight with you that our responsibility does have limits. WorldTourTrip, along with everyone who contributes to it, cannot be held accountable for any inconvenience, loss, or damage that results from using our platform, leaning on our content for an important decision, any technical issues or downtime the site may experience, or any gaps or mistakes that appear in our published material. The platform is offered as it is, and while we are always working to make it better, we cannot guarantee it will be perfect every single time you visit.</p>
            <h5>
            Changes to Terms & Conditions
            </h5>
            <p>
            These Terms & Conditions will be looked at and updated from time to time as WorldTourTrip grows and things change around us. When that happens, the revised version will go live on this page straight away. We suggest checking back occasionally so nothing catches you off guard. If something significant changes, we will make a point of flagging it clearly on the website. Any questions about what is written here can be sent to us at info@worldtourtrip.com and we will come back to you as soon as we can.
            </p>
            </div>
        </div>
      </section>
    </>
  )
}

export default TermsConditions
