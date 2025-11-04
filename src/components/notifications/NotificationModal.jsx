import { useState, useEffect } from 'react';
import { Modal, Tabs, Label, Textarea, Checkbox, Select, TextInput } from 'flowbite-react';
import BoGButton from '../BoGButton';

const NotificationModal = ({ isOpen, onClose, organizationId }) => {
  const [activeTab, setActiveTab] = useState('individual');
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    recipients: 'everyone',
    scheduledFor: '',
    sendInApp: true,
    sendEmail: false,
    type: 'individual',
    recurrence: {
      frequency: 'daily',
      interval: 1,
      daysOfWeek: [],
      dayOfMonth: 1,
      monthOfYear: 1,
      endDate: '',
      endAfterOccurrences: null,
    },
    isBirthdayNotification: false,
  });
  const [loading, setLoading] = useState(false);
  const [showCustomRecurrence, setShowCustomRecurrence] = useState(false);
  const [recipientMode, setRecipientMode] = useState('everyone'); // 'everyone' or 'specific'
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen && organizationId) {
      fetchUsers();
    }
  }, [isOpen, organizationId]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`/api/users?organizationId=${organizationId}`);
      const data = await response.json();
      if (data.users) {
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRecurrenceChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        [field]: value,
      },
    }));
  };

  const handleDayOfWeekToggle = (day) => {
    setFormData((prev) => {
      const daysOfWeek = prev.recurrence.daysOfWeek || [];
      const newDays = daysOfWeek.includes(day)
        ? daysOfWeek.filter((d) => d !== day)
        : [...daysOfWeek, day];

      return {
        ...prev,
        recurrence: {
          ...prev.recurrence,
          daysOfWeek: newDays,
        },
      };
    });
  };

  const handleRecipientModeChange = (mode) => {
    setRecipientMode(mode);
    if (mode === 'everyone') {
      setSelectedUsers([]);
      setFormData((prev) => ({ ...prev, recipients: 'everyone' }));
    } else {
      setFormData((prev) => ({ ...prev, recipients: [] }));
    }
  };

  const handleAddUser = (user) => {
    if (!selectedUsers.find((u) => u._id === user._id)) {
      const newSelectedUsers = [...selectedUsers, user];
      setSelectedUsers(newSelectedUsers);
      setFormData((prev) => ({
        ...prev,
        recipients: newSelectedUsers.map((u) => u._id),
      }));
    }
    setUserSearchQuery('');
    setShowUserDropdown(false);
  };

  const handleRemoveUser = (userId) => {
    const newSelectedUsers = selectedUsers.filter((u) => u._id !== userId);
    setSelectedUsers(newSelectedUsers);
    setFormData((prev) => ({
      ...prev,
      recipients: newSelectedUsers.length > 0 ? newSelectedUsers.map((u) => u._id) : 'everyone',
    }));
    if (newSelectedUsers.length === 0) {
      setRecipientMode('everyone');
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      !selectedUsers.find((u) => u._id === user._id) &&
      (user.firstName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearchQuery.toLowerCase()))
  );

  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.body) {
      alert('Please fill in all required fields');
      return;
    }

    // For recurring notifications, require scheduledFor
    if (activeTab === 'recurring' && !formData.scheduledFor) {
      alert('Please fill in all required fields');
      return;
    }

    if (recipientMode === 'specific' && selectedUsers.length === 0) {
      alert('Please select at least one recipient');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        type: activeTab === 'individual' ? 'individual' : 'recurring',
      };

      // For individual notifications, set scheduledFor to now
      if (activeTab === 'individual') {
        payload.scheduledFor = new Date().toISOString();
      }

      // Only include recurrence for recurring notifications
      if (activeTab !== 'recurring') {
        delete payload.recurrence;
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onClose(true); // true indicates the list should refresh
      } else {
        const error = await response.json();
        alert('Failed to create notification: ' + error.error);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Failed to create notification');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  const renderRecipientSelector = () => {
    return (
      <div>
        <Label>Send to <span className="text-red-500">*</span></Label>

        {/* Mode selector */}
        <div className="mb-2 flex gap-2">
          <button
            type="button"
            onClick={() => handleRecipientModeChange('everyone')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              recipientMode === 'everyone'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Everyone
          </button>
          <button
            type="button"
            onClick={() => handleRecipientModeChange('specific')}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              recipientMode === 'specific'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Specific Users
          </button>
        </div>

        {/* Specific users selection */}
        {recipientMode === 'specific' && (
          <div className="space-y-2">
            {/* Selected users */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 rounded-lg border border-gray-300 p-2">
                {selectedUsers.map((user) => (
                  <span
                    key={user._id}
                    className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm"
                  >
                    {user.firstName} {user.lastName}
                    <button
                      type="button"
                      onClick={() => handleRemoveUser(user._id)}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search input */}
            <div className="relative">
              <TextInput
                placeholder="Search users by name or email..."
                value={userSearchQuery}
                onChange={(e) => {
                  setUserSearchQuery(e.target.value);
                  setShowUserDropdown(e.target.value.length > 0);
                }}
                onFocus={() => setShowUserDropdown(userSearchQuery.length > 0)}
              />

              {/* User dropdown */}
              {showUserDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-300 bg-white shadow-lg">
                  {filteredUsers.slice(0, 10).map((user) => (
                    <button
                      key={user._id}
                      type="button"
                      onClick={() => handleAddUser(user)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      <div className="font-medium">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedUsers.length === 0 && (
              <p className="text-sm text-gray-500">
                No users selected. Click above to add recipients.
              </p>
            )}
          </div>
        )}

        {recipientMode === 'everyone' && (
          <p className="text-sm text-gray-500">
            Notification will be sent to all members in your organization
          </p>
        )}
      </div>
    );
  };

  const renderRecurrenceOptions = () => {
    if (formData.recurrence.frequency === 'custom') {
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="custom-recurrence">Custom Recurrence</Label>
            <button
              onClick={() => setShowCustomRecurrence(!showCustomRecurrence)}
              className="text-primary-600 hover:underline"
            >
              {showCustomRecurrence ? 'Hide' : 'Configure'} custom recurrence
            </button>
          </div>

          {showCustomRecurrence && (
            <div className="space-y-4 rounded-lg border border-gray-300 p-4">
              <div>
                <Label htmlFor="repeat-every">Repeat every</Label>
                <div className="flex items-center gap-2">
                  <TextInput
                    id="repeat-every"
                    type="number"
                    min="1"
                    value={formData.recurrence.interval || 1}
                    onChange={(e) =>
                      handleRecurrenceChange('interval', parseInt(e.target.value))
                    }
                    className="w-20"
                  />
                  <Select
                    value="week"
                    onChange={(e) => {
                      // This could be extended to support different intervals
                    }}
                  >
                    <option value="day">day(s)</option>
                    <option value="week">week(s)</option>
                    <option value="month">month(s)</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Repeat on</Label>
                <div className="flex gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <button
                      key={index}
                      onClick={() => handleDayOfWeekToggle(index === 6 ? 0 : index + 1)}
                      className={`h-10 w-10 rounded-full ${
                        formData.recurrence.daysOfWeek?.includes(
                          index === 6 ? 0 : index + 1
                        )
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="ends">Ends</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input type="radio" name="ends" id="never" defaultChecked />
                    <Label htmlFor="never">Never</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="ends" id="on-date" />
                    <Label htmlFor="on-date">On</Label>
                    <TextInput
                      type="date"
                      value={formData.recurrence.endDate || ''}
                      onChange={(e) => handleRecurrenceChange('endDate', e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="radio" name="ends" id="after-occurrences" />
                    <Label htmlFor="after-occurrences">After</Label>
                    <TextInput
                      type="number"
                      min="1"
                      value={formData.recurrence.endAfterOccurrences || ''}
                      onChange={(e) =>
                        handleRecurrenceChange(
                          'endAfterOccurrences',
                          parseInt(e.target.value)
                        )
                      }
                      className="w-20"
                    />
                    <span>occurrences</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Modal show={isOpen} onClose={handleCancel} size="4xl">
      <Modal.Header>Create Notification</Modal.Header>
      <Modal.Body>
        <Tabs.Group
          aria-label="Notification type tabs"
          style="underline"
          onActiveTabChange={(tab) => {
            const tabKeys = ['individual', 'recurring'];
            setActiveTab(tabKeys[tab]);
          }}
        >
          <Tabs.Item title="Individual Notification" active={activeTab === 'individual'}>
            <div className="space-y-4">
              <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
                Individual notifications are sent immediately upon creation.
              </div>

              <div>
                <Label htmlFor="title">
                  Title <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="title"
                  placeholder="Notification title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="body">
                  Body <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="body"
                  placeholder="Write notification content here"
                  rows={6}
                  value={formData.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                  required
                />
              </div>

              {renderRecipientSelector()}

              <div>
                <Label>Send through</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="send-in-app"
                      checked={formData.sendInApp}
                      onChange={(e) => handleInputChange('sendInApp', e.target.checked)}
                    />
                    <Label htmlFor="send-in-app">VolunTrack</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="send-email"
                      checked={formData.sendEmail}
                      onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                    />
                    <Label htmlFor="send-email">Email</Label>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Item>

          <Tabs.Item title="Recurring Notification" active={activeTab === 'recurring'}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title-recurring">
                  Title <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="title-recurring"
                  placeholder="Notification title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="body-recurring">
                  Body <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="body-recurring"
                  placeholder="Write notification content here"
                  rows={6}
                  value={formData.body}
                  onChange={(e) => handleInputChange('body', e.target.value)}
                  required
                />
              </div>

              {renderRecipientSelector()}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="recurring-event">Recurring Event</Label>
                  <Select
                    id="recurring-event"
                    value={formData.recurrence.frequency}
                    onChange={(e) => handleRecurrenceChange('frequency', e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly on [Day of Week]</option>
                    <option value="monthly">Monthly on [#]</option>
                    <option value="annually">Annually on [Date]</option>
                    <option value="custom">Custom...</option>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time">
                    Time <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="time"
                    type="time"
                    value={formData.scheduledFor.split('T')[1] || ''}
                    onChange={(e) => {
                      const date = formData.scheduledFor.split('T')[0] || new Date().toISOString().split('T')[0];
                      handleInputChange('scheduledFor', `${date}T${e.target.value}`);
                    }}
                    required
                  />
                </div>
              </div>

              {renderRecurrenceOptions()}

              <div>
                <Label htmlFor="start-date">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <TextInput
                  id="start-date"
                  type="date"
                  value={formData.scheduledFor.split('T')[0] || ''}
                  onChange={(e) => {
                    const time = formData.scheduledFor.split('T')[1] || '00:00';
                    handleInputChange('scheduledFor', `${e.target.value}T${time}`);
                  }}
                  required
                />
              </div>

              <div>
                <Label>Send through</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="send-in-app-recurring"
                      checked={formData.sendInApp}
                      onChange={(e) => handleInputChange('sendInApp', e.target.checked)}
                    />
                    <Label htmlFor="send-in-app-recurring">VolunTrack</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="send-email-recurring"
                      checked={formData.sendEmail}
                      onChange={(e) => handleInputChange('sendEmail', e.target.checked)}
                    />
                    <Label htmlFor="send-email-recurring">Email</Label>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Item>
        </Tabs.Group>
      </Modal.Body>
      <Modal.Footer>
        <div className="flex w-full justify-end gap-2">
          <button
            onClick={handleCancel}
            className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <BoGButton
            text="Create"
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;
