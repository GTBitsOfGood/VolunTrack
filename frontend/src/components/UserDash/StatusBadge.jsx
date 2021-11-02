import React from 'react';
import PropTypes from 'prop-types';
import Tag from '../Shared/Tag';
import { getStatusColor, statuses } from './applicantInfoHelpers';
import { withTheme } from 'styled-components';

const StatusBadge = ({ status, selected, theme }) => (
  <Tag
    type={getStatusColor(status) || ''}
    color={selected ? theme.grey9 : ''}
    textColor={selected ? theme.primary : ''}
    text={statuses[status]}
  />
);

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  theme: PropTypes.object
};

export default withTheme(StatusBadge);
