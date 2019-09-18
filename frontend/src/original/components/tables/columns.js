const full_name = {
  id: 'full_name',
  Header: 'Full Name',
  accessor: d => `${d.bio.first_name}  ${d.bio.last_name}`
};
const age = {
  id: 'age',
  Header: 'Age',
  maxWidth: 50,
  accessor: d => {
    const currentYear = new Date().getYear();
    const userYear = new Date(d.bio.date_of_birth).getYear();
    return currentYear - userYear;
  }
};

const criminal_history = {
  id: 'criminal_history',
  Header: 'Criminal History',
  maxWidth: 140,
  minWidth: 100,
  accessor: d => {
    const { felony, sexual_violent, drugs, driving } = d.criminal;
    if (felony || sexual_violent || drugs || driving) {
      return 'Yes';
    }
    return 'None';
  }
};

const referral = {
  id: 'referral',
  Header: 'Referral',
  maxWidth: 100,
  accessor: d => {
    let referral = '';
    if (d.referral.friend) referral += 'Friend ';
    if (d.referral.newsletter) referral += 'Newsletter ';
    if (d.referral.event) referral += 'Event ';
    if (d.referral.volunteer_match) referral += 'Volunteer Match ';
    if (d.referral.internet) referral += 'Internet ';
    if (d.referral.social_media) referral += 'Social Media ';
    return referral;
  }
};
const email = { Header: 'Email', accessor: 'bio.email' };

const phone_number = { Header: 'Phone Number', accessor: 'bio.phone_number', maxWidth: 175 };

const PENDING_VOLUNTEERS_FULL = [full_name, age, phone_number, email, criminal_history, referral];
const PENDING_VOLUNTEERS_SHORT = [full_name, phone_number, email];
const DENIED_VOLUNTEERS_SHORT = [full_name, phone_number, email];

export { PENDING_VOLUNTEERS_FULL, PENDING_VOLUNTEERS_SHORT, DENIED_VOLUNTEERS_SHORT };
