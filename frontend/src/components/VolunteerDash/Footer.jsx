import React, { Component } from 'react';
import styles from '../../styles/VolunteerDash.module.css';

class Footer extends Component {
  render() {
    return (
      <div>
        <div className={styles.footerBackground}>
          <div className={styles.footer}>
            <p>
              While we greatly need and appreciate all of the volunteer assistance we receive, we do
              not have a full-time volunteer manager on staff. Thank you in advance for
              understanding that your application may take a few weeks to get processed.
            </p>
          </div>
        </div>
        <div className={styles.informationWrapper}>
          <div className={styles.information}>
            <h5>Schedule</h5>
            <p>
              To schedule a volunteer shift for{' '}
              <a href="http://signup.com/go/A8nqmi">
                Atlanta Homeless Shelter and special event opportunities click here
              </a>
              .
            </p>
            <p>
              <a href="http://signup.com/go/OHsNfaH">
                Click here for Orlando Homeless Shelter opportunities.
              </a>
            </p>
            <h5>More Opportunities to Help</h5>
            <p>
              Occasionally we have more volunteer opportunities available posted on{' '}
              <a href="http://www.volunteermatch.org/search/org260116.jsp">Volunteer Match</a> .
            </p>
            <h5>Volunteer Manual & Points to Keep in Mind When Volunteering</h5>
            <p>
              Please{' '}
              <a href="https://docs.google.com/document/d/14QEpMwgJzjyBX27dfNsbKoxV_VEjF8IwbQGEIadMMOo/edit?usp=sharing">
                click here
              </a>{' '}
              for our manual so you know what to expect and what to do if a situation arises on your
              volunteer shift.
            </p>
            <ol>
              <li>
                We are there for the children. Please minimize chatter between volunteers and make
                this hour all about the children.
              </li>
              <li>Be their friend but always remember you are their superior.</li>
              <li>Use the language we expect them to use: please and thank you for everything.</li>
            </ol>
            <h5>Child Protection Clause</h5>
            <p>
              In the interest of child protection and abuse prevention, drawchange™ has adopted the
              attached policy concerning interactions with children minors, under the supervision
              and direction of drawchange™ staff and volunteers. It is important that staff and
              volunteers understand the Purpose of this document and implement the Prevention
              Guidelines and Response Procedures of this policy.{' '}
            </p>
            <p>
              <a href="https://drive.google.com/open?id=0Bx8FjKanoOHLYmE4cHIzQXZDazQ">Click here</a>{' '}
              here to view and download our child protection clause.{' '}
            </p>
            <h5>Atlanta’s Thursday Evening’s Homeless Shelter</h5>
            <p>
              If you are interested in attending the shelter on Thursday evenings, they require
              their own background check. Please click the link to download the form and follow the
              below instructions. There is a limited amount of financial assistance for background
              check screening. Please <a href="mailto:volunteer@drawchange.org">email us</a> if
              necessary!
            </p>
            <p>
              To volunteer on Thursday evenings, it is required to fill out their own background
              check. Please understand they only have the children’s best interest at heart. This
              process takes up to 3 business days so please get on this today.*
            </p>
            <p>Three step process:</p>
            <ol>
              <li>
                Send an email to{' '}
                <a href="mailto:CThomas@nicholashouse.org?subject=Background check to volunteer with drawchange on Thursday evenings">
                  Chase Thomas at CThomas@nicholashouse.org
                </a>{' '}
                and cc volunteer@drawchange.org with your first and last name and your desire to
                fill out a background check to volunteer with drawchange on Thursdays.
              </li>
              <li>
                You will then receive an email from TheAdvocates@VerifiedVolunteers.com with the
                background check information.{' '}
              </li>
              <li>
                Check in with us (above two email addresses) if you don’t hear anything within five
                business days!
              </li>
            </ol>
            <p>
              * If you already have a background check with{' '}
              <a href="http://www.verifiedvolunteers.com/">Verified Volunteers</a> done in the last
              12 months, click SHARE once you log into the system and you’re all set!
            </p>
            <div className={styles.informationCloser}>
              <p>
                <strong>Thank you for saying yes to helping the children!</strong>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.policyWrapper}>
          <div className={styles.policy}>
            <p>
              <a href="http://www.drawchange.org/privacypolicy" target="_self">
                © 2018 drawchange Inc&nbsp;|&nbsp; All rights reserved&nbsp;Terms of Use&nbsp;
                |&nbsp; &nbsp;Privacy Policy
              </a>
            </p>
          </div>
        </div>
        <div className={styles.donate}>
          <div className={styles.donateInner}>
            <p>Help Us Continue Our Life-Altering Programming</p>
          </div>
          <div className={styles.donateButtonWrapper}>
            <a
              className={styles.donateButton}
              rel="noopener noreferrer"
              target="_blank"
              href="https://secure.donationpay.org/drawchange/"
              color="success"
            >
              Donate
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
