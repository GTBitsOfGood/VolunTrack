export const statusToColorMap = {
  accepted: 'success',
  has_volunteered: 'warning',
  new: 'default',
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
    has_volunteered: 'Has Volunteered',
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
