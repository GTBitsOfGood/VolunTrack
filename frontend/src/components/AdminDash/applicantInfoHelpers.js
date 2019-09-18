export const statusToColorMap = {
  accepted: 'success',
  got_initial_email: 'warning',
  has_volunteered: 'warning',
  new: 'default',
  no_response: 'warning',
  denied: 'danger'
};

const defaultStatus = {
  get: function(target, name) {
    return target.hasOwnProperty(name) ? target[name] : 'New';
  }
};

const defaultRole = {
  get: function(target, name) {
    return target.hasOwnProperty(name) ? target[name] : 'Volunteer';
  }
};

export const statuses = new Proxy(
  {
    accepted: 'Accepted',
    denied: 'Denied',
    got_initial_email: 'Got Initial Email',
    has_volunteered: 'Has Volunteered',
    no_response: 'No Response',
    new: 'New'
  },
  defaultStatus
);

export const roles = new Proxy(
  {
    admin: 'Administrator',
    manager: 'Manager',
    volunteer: 'Volunteer'
  },
  defaultRole
);

export const getStatusColor = status => statusToColorMap[status] || 'default';
