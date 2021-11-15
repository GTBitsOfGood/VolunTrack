export const statusToColorMap = {
  has_volunteered: 'warning',
  new: 'default'
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

const defaultMandatedHours = {
  get: function(target, name) {
    return target.hasOwnProperty(name) ? target[name] : 'Not Mandated';
  }
};

export const statuses = new Proxy(
  {
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

export const mandated = new Proxy(
  {
    is_mandated: 'Mandated Hours',
    not_mandated: 'Not Mandated'
  },
  defaultMandatedHours
);

export const getStatusColor = status => statusToColorMap[status] || 'default';
