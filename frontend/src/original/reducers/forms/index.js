import { combineForms } from 'react-redux-form';

import event from './event';
import user from './user';

export default combineForms(
  {
    user,
    event
  },
  'forms'
);
