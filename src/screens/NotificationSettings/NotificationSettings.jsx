import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Tabs, ToggleSwitch, Spinner } from 'flowbite-react';
import BoGButton from '../../components/BoGButton';
import NotificationModal from '../../components/notifications/NotificationModal';
import { formatDistance } from 'date-fns';
import {
  getOrganization,
  updateOrganization,
} from '../../queries/organizations';

const NotificationSettings = () => {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState('scheduled');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [birthdayNotificationsEnabled, setBirthdayNotificationsEnabled] =
    useState(false);
  const [showModal, setShowModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
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
      if (response.data.organization) {
        setBirthdayNotificationsEnabled(
          response.data.organization.birthdayNotificationsEnabled || false
        );
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
        setPagination((prev) => ({
          ...prev,
          ...data.pagination,
        }));
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

  const handleCreateNotification = () => {
    setShowModal(true);
  };

  const handleModalClose = (shouldRefresh) => {
    setShowModal(false);
    if (shouldRefresh) {
      fetchNotifications();
    }
  };

  const renderNotificationCard = (notification) => {
    const scheduledDate = new Date(notification.scheduledFor);
    const sentDate = notification.sentAt ? new Date(notification.sentAt) : null;
    const timeAgo = sentDate
      ? formatDistance(sentDate, new Date(), { addSuffix: true })
      : formatDistance(scheduledDate, new Date(), { addSuffix: true });

    return (
      <div key={notification._id} className="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h5 className="text-xl font-bold tracking-tight text-gray-900">
              {notification.title}
            </h5>
            <p className="text-sm text-gray-500">
              {activeTab === 'scheduled'
                ? scheduledDate.toLocaleString()
                : sentDate
                ? sentDate.toLocaleString()
                : timeAgo}
            </p>
            <p className="mt-2 font-normal text-gray-700">
              {notification.body.replace(/<[^>]+>/g, ' ').substring(0, 200)}
              {notification.body.length > 200 ? '...' : ''}
            </p>

            {/* Recipients display */}
            {activeTab === 'history' && (
              <div className="mt-2">
                <span className="text-sm font-semibold text-gray-700">Sent to: </span>
                <span className="text-sm text-gray-600">
                  {notification.recipients === 'everyone'
                    ? 'Everyone'
                    : Array.isArray(notification.recipients)
                    ? notification.recipients.length > 0
                      ? notification.recipients
                          .map((r) => `${r.firstName} ${r.lastName}`)
                          .join(', ')
                      : 'Specific users'
                    : 'Everyone'}
                </span>
              </div>
            )}

            <div className="mt-2 flex gap-2">
              {notification.type === 'recurring' && (
                <span className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
                  Recurring
                </span>
              )}
              {notification.sendEmail && (
                <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-800">
                  Email
                </span>
              )}
              {notification.sendInApp && (
                <span className="rounded bg-purple-100 px-2 py-1 text-xs font-semibold text-purple-800">
                  In-App
                </span>
              )}
              {notification.isBirthdayNotification && (
                <span className="rounded bg-pink-100 px-2 py-1 text-xs font-semibold text-pink-800">
                  🎂 Birthday
                </span>
              )}
            </div>
          </div>
          {activeTab === 'scheduled' && (
            <div className="ml-4">
              <button
                onClick={() => handleDeleteNotification(notification._id)}
                className="text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const showEllipsisStart = pagination.page > 3;
    const showEllipsisEnd = pagination.page < pagination.pages - 2;

    if (pagination.page > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          &lt;
        </button>
      );
    }

    pages.push(
      <button
        key={1}
        onClick={() => setPagination({ ...pagination, page: 1 })}
        className={`px-3 py-2 ${
          pagination.page === 1
            ? 'bg-primary-600 text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        1
      </button>
    );

    if (showEllipsisStart) {
      pages.push(
        <span key="ellipsis-start" className="px-3 py-2 text-gray-700">
          ...
        </span>
      );
    }

    const startPage = Math.max(2, pagination.page - 1);
    const endPage = Math.min(pagination.pages - 1, pagination.page + 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPagination({ ...pagination, page: i })}
          className={`px-3 py-2 ${
            pagination.page === i
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    if (showEllipsisEnd) {
      pages.push(
        <span key="ellipsis-end" className="px-3 py-2 text-gray-700">
          ...
        </span>
      );
    }

    if (pagination.pages > 1) {
      pages.push(
        <button
          key={pagination.pages}
          onClick={() => setPagination({ ...pagination, page: pagination.pages })}
          className={`px-3 py-2 ${
            pagination.page === pagination.pages
              ? 'bg-primary-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {pagination.pages}
        </button>
      );
    }

    if (pagination.page < pagination.pages) {
      pages.push(
        <button
          key="next"
          onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
          className="px-3 py-2 text-gray-700 hover:bg-gray-100"
        >
          &gt;
        </button>
      );
    }

    return (
      <div className="mt-6 flex items-center justify-center gap-1">
        {pages}
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <BoGButton text="Create Notification" onClick={handleCreateNotification} />
      </div>

      <Tabs.Group
        aria-label="Notification tabs"
        style="underline"
        onActiveTabChange={(tab) => {
          const tabKeys = ['scheduled', 'history', 'birthdays'];
          setActiveTab(tabKeys[tab]);
          setPagination({ ...pagination, page: 1 });
        }}
      >
        <Tabs.Item title="Scheduled" active={activeTab === 'scheduled'}>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="xl" />
            </div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map(renderNotificationCard)}
              {renderPagination()}
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No scheduled notifications
            </div>
          )}
        </Tabs.Item>

        <Tabs.Item title="History" active={activeTab === 'history'}>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="xl" />
            </div>
          ) : notifications.length > 0 ? (
            <>
              {notifications.map(renderNotificationCard)}
              {renderPagination()}
            </>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No notification history
            </div>
          )}
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
                onChange={(checked) => handleBirthdayToggle(checked)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="xl" />
            </div>
          ) : notifications.length > 0 ? (
            <>
              <div className="mt-6">
                {notifications.map(renderNotificationCard)}
              </div>
              {renderPagination()}
            </>
          ) : (
            <div className="mt-6 py-8 text-center text-gray-500">
              No birthday notifications scheduled
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
