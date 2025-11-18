import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, ToggleSwitch, Spinner } from 'flowbite-react';
import "react-quill/dist/quill.snow.css";
import BoGButton from '../../components/BoGButton';
import NotificationModal from '../../components/notifications/NotificationModal';
import { getOrganization, updateOrganization } from '../../queries/organizations';

const NotificationSettings = () => {
  let ReactQuill;
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);
  
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('scheduled');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [birthdayNotificationsEnabled, setBirthdayNotificationsEnabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [birthdaySettings, setBirthdaySettings] = useState({
    title: '',
    body: '',
    time: '09:00',
    sendInApp: true,
    sendEmail: false,
    sendText: false,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 4,
    total: 0,
    pages: 1,
  });

  useEffect(() => {
    fetchOrganizationSettings();
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [activeTab, pagination.page]);

  const fetchOrganizationSettings = async () => {
    try {
      const response = await getOrganization(session.user.organizationId);
      const org = response.data.organization;
      if (org) {
        setBirthdayNotificationsEnabled(org.birthdayNotificationsEnabled || false);
        if (org.birthdayNotificationSettings) {
          setBirthdaySettings({
            title: org.birthdayNotificationSettings.title || '',
            body: org.birthdayNotificationSettings.body || '',
            time: org.birthdayNotificationSettings.time || '09:00',
            sendInApp: org.birthdayNotificationSettings.sendInApp !== false,
            sendEmail: org.birthdayNotificationSettings.sendEmail || false,
            sendText: org.birthdayNotificationSettings.sendText || false,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching organization settings:', error);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/notifications?organizationId=${session.user.organizationId}&tab=${activeTab}&page=${pagination.page}&limit=${pagination.limit}`
      );
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setPagination(prev => ({ ...prev, ...data.pagination }));
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBirthdayToggle = async (enabled) => {
    try {
      await updateOrganization(session.user.organizationId, {
        birthdayNotificationsEnabled: enabled,
      });
      setBirthdayNotificationsEnabled(enabled);
    } catch (error) {
      console.error('Error updating birthday notifications:', error);
    }
  };

  const handleSaveBirthdaySettings = async () => {
    // Validation
    if (!birthdaySettings.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!birthdaySettings.body.trim()) {
      alert('Please enter a body');
      return;
    }
    if (!birthdaySettings.sendInApp && !birthdaySettings.sendEmail && !birthdaySettings.sendText) {
      alert('Please select at least one send through option');
      return;
    }

    try {
      await updateOrganization(session.user.organizationId, {
        birthdayNotificationSettings: birthdaySettings,
      });
      alert('Birthday notification settings saved!');
    } catch (error) {
      console.error('Error saving birthday settings:', error);
      alert('Failed to save birthday settings');
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleModalClose = (shouldRefresh) => {
    setShowModal(false);
    if (shouldRefresh) fetchNotifications();
  };

  const formatNotificationDate = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const notificationDay = new Date(
      notificationDate.getFullYear(), 
      notificationDate.getMonth(), 
      notificationDate.getDate()
    );
    
    const timeString = notificationDate.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase();
    
    if (notificationDay.getTime() === today.getTime()) {
      return `Today, ${timeString}`;
    } else if (notificationDay.getTime() === yesterday.getTime()) {
      return `Yesterday, ${timeString}`;
    } else {
      const monthName = notificationDate.toLocaleDateString('en-US', { month: 'long' });
      return `${monthName} ${notificationDate.getDate()}, ${timeString}`;
    }
  };

  const renderNotificationCard = (notification) => {
    const scheduledDate = new Date(notification.scheduledFor);
    const sentDate = notification.sentAt ? new Date(notification.sentAt) : null;
    const displayDate = activeTab === 'history' && sentDate 
      ? formatNotificationDate(sentDate)
      : formatNotificationDate(scheduledDate);

    return (
      <div key={notification._id} className="mb-3 rounded-lg bg-gray-100 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h5 className="text-base font-bold text-gray-900">
              {notification.title} <span className="font-normal text-gray-600">{displayDate}</span>
            </h5>
            <div className="mt-2 text-sm text-gray-700 leading-relaxed">
              {ReactQuill && (
                <div className="notification-display-wrapper">
                  <ReactQuill
                    value={notification.body || ""}
                    readOnly={true}
                    theme="snow"
                    modules={{ toolbar: false }}
                    className="notification-display"
                  />
                </div>
              )}
            </div>
          </div>
          {activeTab === 'scheduled' && (
            <button
              onClick={() => handleDeleteNotification(notification._id)}
              className="ml-4 text-red-600 hover:text-red-800 text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    );
  };

  const PaginationButton = ({ onClick, active, disabled, children }) => {
    const baseClass = "px-3 py-2 rounded border transition-colors";
    const className = disabled 
      ? `${baseClass} border-gray-300 bg-white text-gray-700 cursor-default`
      : active 
      ? `${baseClass} border-primaryColor bg-primaryColor text-white`
      : `${baseClass} border-gray-300 bg-white text-gray-700 hover:bg-gray-50`;
    
    return (
      <button onClick={onClick} disabled={disabled} className={className}>
        {children}
      </button>
    );
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const { page: currentPage, pages: totalPages } = pagination;
    const pageButtons = [];
    
    if (currentPage > 1) {
      pageButtons.push(
        <PaginationButton 
          key="prev" 
          onClick={() => setPagination(prev => ({ ...prev, page: currentPage - 1 }))}
        >
          &lt;
        </PaginationButton>
      );
    }

    pageButtons.push(
      <PaginationButton 
        key={1}
        active={currentPage === 1}
        onClick={() => setPagination(prev => ({ ...prev, page: 1 }))}
      >
        1
      </PaginationButton>
    );

    if (totalPages >= 2) {
      pageButtons.push(
        <PaginationButton 
          key={2}
          active={currentPage === 2}
          onClick={() => setPagination(prev => ({ ...prev, page: 2 }))}
        >
          2
        </PaginationButton>
      );
    }

    if (totalPages > 4) {
      pageButtons.push(
        <PaginationButton key="ellipsis" disabled>
          ...
        </PaginationButton>
      );
    }

    if (totalPages === 3 || totalPages === 4) {
      pageButtons.push(
        <PaginationButton 
          key={3}
          active={currentPage === 3}
          onClick={() => setPagination(prev => ({ ...prev, page: 3 }))}
        >
          3
        </PaginationButton>
      );
    }

    if (totalPages > 4) {
      pageButtons.push(
        <PaginationButton 
          key={totalPages - 1}
          active={currentPage === totalPages - 1}
          onClick={() => setPagination(prev => ({ ...prev, page: totalPages - 1 }))}
        >
          {totalPages - 1}
        </PaginationButton>
      );
    }

    if (totalPages >= 4) {
      pageButtons.push(
        <PaginationButton 
          key={totalPages}
          active={currentPage === totalPages}
          onClick={() => setPagination(prev => ({ ...prev, page: totalPages }))}
        >
          {totalPages}
        </PaginationButton>
      );
    }

    if (currentPage < totalPages) {
      pageButtons.push(
        <PaginationButton 
          key="next"
          onClick={() => setPagination(prev => ({ ...prev, page: currentPage + 1 }))}
        >
          &gt;
        </PaginationButton>
      );
    }

    return (
      <div className="mt-6 flex items-center justify-center gap-1">
        {pageButtons}
      </div>
    );
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <Spinner size="xl" />
        </div>
      );
    }

    if (notifications.length > 0) {
      return (
        <>
          {notifications.map(renderNotificationCard)}
          {renderPagination()}
        </>
      );
    }

    const emptyMessages = {
      scheduled: 'No scheduled notifications',
      history: 'No notification history',
      birthdays: 'No birthday notifications scheduled'
    };

    return (
      <div className="py-8 text-center text-gray-500">
        {emptyMessages[activeTab]}
      </div>
    );
  };

  return (
    <div>
      <style jsx global>{`
        .notification-display-wrapper .ql-container {
          border: none;
          font-size: inherit;
          height: auto;
          min-height: auto;
        }
        .notification-display-wrapper .ql-editor {
          padding: 0;
          font-size: inherit;
          line-height: inherit;
          min-height: auto;
          height: auto;
        }
        .notification-display-wrapper .ql-editor.ql-blank::before {
          display: none;
        }
        .notification-display-wrapper {
          display: inline-block;
          width: 100%;
        }
      `}</style>

      <div className="mb-4 flex items-center justify-between -mt-4">
        <h2 className="text-lg font-bold">Notification Settings</h2>
        <BoGButton 
          text="Create Notification" 
          onClick={() => setShowModal(true)}
        />
      </div>

      <Tabs.Group
        aria-label="Notification tabs"
        style="underline"
        className="[&>button[aria-selected='true']]:text-primaryColor [&>button[aria-selected='true']]:border-primaryColor"
        onActiveTabChange={(tab) => {
          const tabKeys = ['scheduled', 'history', 'birthdays'];
          setActiveTab(tabKeys[tab]);
          setPagination(prev => ({ ...prev, page: 1 }));
        }}
      >
        <Tabs.Item title="Scheduled" active={activeTab === 'scheduled'}>
          {renderTabContent()}
        </Tabs.Item>

        <Tabs.Item title="History" active={activeTab === 'history'}>
          {renderTabContent()}
        </Tabs.Item>

        <Tabs.Item title="Birthdays" active={activeTab === 'birthdays'}>
          <div className="rounded-lg bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Birthday Notifications</h3>
                <p className="text-sm text-gray-500">
                  Send notifications celebrating members' birthdays
                </p>
              </div>
              <ToggleSwitch
                checked={birthdayNotificationsEnabled}
                onChange={handleBirthdayToggle}
                theme={{
                  toggle: {
                    checked: {
                      color: {
                        primary: "bg-primaryColor",
                      },
                    },
                  },
                }}
                color="primary"
              />
            </div>

            {birthdayNotificationsEnabled && (
              <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
                <h4 className="mb-4 text-lg font-semibold text-gray-800">
                  Birthday Notification Settings
                </h4>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={birthdaySettings.title}
                    onChange={(e) =>
                      setBirthdaySettings(prev => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Birthday notification title"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-primaryColor focus:outline-none focus:ring-1 focus:ring-primaryColor"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-1">
                    Body <span className="text-red-500">*</span>
                  </label>
                  <div className="bg-white">
                    {ReactQuill && (
                      <ReactQuill
                        className="h-96"
                        value={birthdaySettings.body}
                        onChange={(newValue) => setBirthdaySettings(prev => ({ 
                          ...prev, 
                          body: newValue 
                        }))}
                        ref={quill}
                      />
                    )}
                  </div>
                </div>

                <div className="mb-6 mt-20">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Send through <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: "inApp", label: "VolunTrack", field: "sendInApp" },
                      { id: "email", label: "Email", field: "sendEmail" },
                      { id: "text", label: "Text", field: "sendText" },
                    ].map(({ id, label, field }) => (
                      <label key={id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={birthdaySettings[field]}
                          onChange={(e) =>
                            setBirthdaySettings(prev => ({
                              ...prev,
                              [field]: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primaryColor focus:ring-primaryColor"
                        />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <BoGButton text="Save" onClick={handleSaveBirthdaySettings} />
                </div>
              </div>
            )}
          </div>

          {activeTab === 'birthdays' && (
            <div className="mt-6">
              {renderTabContent()}
            </div>
          )}
        </Tabs.Item>
      </Tabs.Group>

      {showModal && (
        <NotificationModal
          isOpen={showModal}
          onClose={handleModalClose}
          organizationId={session.user.organizationId}
        />
      )}
    </div>
  );
};

export default NotificationSettings;