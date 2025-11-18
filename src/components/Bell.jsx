import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import NotificationModal from "./notifications/NotificationModal";

export default function Bell() {
  const [notifications, setNotifications] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [hovering, setHovering] = useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr}${ampm}`;
  };

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    // Reset time to midnight for date comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const notifDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const diffTime = today - notifDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let datePrefix = "";

    if (diffDays === 0) {
      datePrefix = "Today";
    } else if (diffDays === 1) {
      datePrefix = "Yesterday";
    } else if (diffDays > 0 && diffDays < 7) {
      // Day of the week
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      datePrefix = days[date.getDay()];
    } else {
      // Format as "November 5th"
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const day = date.getDate();
      const suffix =
        day === 1 || day === 21 || day === 31
          ? "st"
          : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
          ? "rd"
          : "th";
      datePrefix = `${months[date.getMonth()]} ${day}${suffix}`;
    }

    return `${datePrefix}, ${formatTime(timestamp)}`;
  };

  useEffect(() => {
    async function fetchNotifications() {
      const response = await fetch("/api/notifications/user?includeRead=true");
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      }
    }

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unRead = notifications.filter((item) => !item.isRead);
  const read = notifications.filter((item) => item.isRead);

  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead === b.isRead) {
      return new Date(b.sentAt) - new Date(a.sentAt);
    }
    return a.isRead ? 1 : -1;
  });

  const displayedNotifications =
    activeTab === "all" ? sortedNotifications : unRead;

  const handleBellClick = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/mark-read`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const notifResponse = await fetch(
          "/api/notifications/user?includeRead=true"
        );
        const data = await notifResponse.json();

        if (data.success) {
          setNotifications(data.notifications);
        }
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleIconHover = () => {
    setHovering(true);
  };

  const handleIconLeave = () => {
    setHovering(false);
  };

  return (
    <>
      <div
        className="relative ml-5 mr-3 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full hover:bg-[#F5F5F5]"
        onClick={handleBellClick}
        onMouseEnter={handleIconHover}
        onMouseLeave={handleIconLeave}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 19 22"
          fill="none"
          className="h-full w-full p-2"
        >
          <path
            d="M11.875 19.25C12.0623 19.25 12.2163 19.4045 12.1934 19.5928C12.0267 20.9496 10.8844 22 9.5 22C8.11561 22 6.97331 20.9496 6.80664 19.5928C6.78369 19.4045 6.93771 19.25 7.125 19.25H11.875ZM9.5 0C13.2476 1.95822e-07 16.2861 3.07805 16.2861 6.875V10.9277C16.2862 10.9955 16.3056 11.0618 16.3428 11.1182L18.6543 14.6309C18.8798 14.9736 19 15.3763 19 15.7881C19 16.9406 18.078 17.875 16.9404 17.875H2.05957C0.922102 17.875 0 16.9406 0 15.7881C4.16641e-05 15.3763 0.120235 14.9736 0.345703 14.6309L2.65723 11.1182C2.69433 11.0618 2.71381 10.9955 2.71387 10.9277V6.875C2.71387 3.07805 5.75236 0 9.5 0ZM9.5 2.0625C6.87664 2.0625 4.75 4.21712 4.75 6.875V10.9277C4.74994 11.4025 4.61137 11.8666 4.35156 12.2617L2.04004 15.7744C2.03747 15.7783 2.03617 15.7834 2.03613 15.7881C2.03613 15.7933 2.03711 15.7979 2.03711 15.7979C2.03776 15.799 2.04053 15.8032 2.04297 15.8057C2.04574 15.8084 2.0503 15.8103 2.05078 15.8105C2.05095 15.8106 2.05453 15.8125 2.05957 15.8125H16.9404C16.9456 15.8125 16.9492 15.8105 16.9492 15.8105C16.9498 15.8102 16.9544 15.8084 16.957 15.8057C16.9596 15.8032 16.9623 15.799 16.9629 15.7979L16.9639 15.7949C16.964 15.7942 16.9639 15.7908 16.9639 15.7881C16.9638 15.7834 16.9626 15.7783 16.96 15.7744L14.6484 12.2617C14.3887 11.8666 14.2501 11.4025 14.25 10.9277V6.875C14.25 4.21713 12.1234 2.0625 9.5 2.0625Z"
            fill="#212B36"
          />
        </svg>
        {unRead.length > 0 && (
          <div className="absolute right-[.7rem] top-[.45rem] h-[7px] w-[6px] rounded-full bg-primaryColor" />
        )}

        {hovering && !isPanelOpen && (
          <div className="absolute right-[-10px] top-[calc(100%+12px)] flex w-[400px] flex-col rounded-xl border-2 border-[#D9D9D9] bg-white py-2">
            {unRead.map((notif, i) => (
              <div
                className={`flex items-center px-2 ${
                  i !== 0 && "mt-2 border-t-2 pt-2"
                }`}
                key={i}
              >
                <div className="flex items-center justify-center self-stretch pl-1 pr-3">
                  <div className="h-[12px] w-[12px] rounded-full bg-primaryColor" />
                </div>
                <div className="font-open-sans text-black">
                  <h1 className="m-0 font-open-sans text-lg font-bold text-black">
                    {notif.title}
                  </h1>
                  <h2 className="m-0 font-open-sans text-sm text-gray-600">
                    {formatTime(notif.sentAt)}
                  </h2>
                </div>
                <div className="ml-auto flex items-center self-stretch px-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M0.287884 0.313303C0.472448 0.128962 0.722649 0.0254192 0.983509 0.0254192C1.24437 0.0254192 1.49456 0.128962 1.67913 0.313303L5.90538 4.53955L10.1316 0.313303C10.2218 0.216585 10.3305 0.139016 10.4512 0.0852169C10.572 0.0314175 10.7023 0.00248994 10.8345 0.000153688C10.9666 -0.00218256 11.0979 0.0221381 11.2205 0.0716456C11.3431 0.121153 11.4544 0.194837 11.5478 0.288313C11.6414 0.381789 11.715 0.493142 11.7645 0.615703C11.814 0.738278 11.8384 0.869567 11.836 1.00174C11.8337 1.13392 11.8048 1.26426 11.751 1.38501C11.6972 1.50576 11.6196 1.61444 11.5229 1.70455L7.29663 5.9308L11.5229 10.1571C11.6196 10.2472 11.6972 10.3559 11.751 10.4766C11.8048 10.5974 11.8337 10.7277 11.836 10.8599C11.8384 10.9921 11.814 11.1233 11.7645 11.2459C11.715 11.3685 11.6414 11.4798 11.5478 11.5732C11.4544 11.6668 11.3431 11.7405 11.2205 11.7899C11.0979 11.8394 10.9666 11.8638 10.8345 11.8615C10.7023 11.8591 10.572 11.8302 10.4512 11.7764C10.3305 11.7226 10.2218 11.645 10.1316 11.5483L5.90538 7.32205L1.67913 11.5483C1.49252 11.7222 1.24571 11.8168 0.990688 11.8124C0.735669 11.8078 0.492358 11.7045 0.311994 11.5242C0.131644 11.3438 0.028337 11.1005 0.0238351 10.8455C0.0193333 10.5904 0.114004 10.3437 0.287884 10.1571L4.51413 5.9308L0.287884 1.70455C0.103543 1.51999 0 1.26979 0 1.00893C0 0.748069 0.103543 0.49788 0.287884 0.313303Z"
                      fill="#212B36"
                    />
                  </svg>
                </div>
              </div>
            ))}
            {read.map((notif, i) => (
              <div
                className={`flex items-center px-2 ${
                  (i !== 0 || unRead.length > 0) && "mt-2 border-t-2 pt-2"
                }`}
                key={i}
              >
                <div className="flex items-center justify-center self-stretch pl-1 pr-3">
                  <div className="h-[12px] w-[12px]" />
                </div>
                <div className="font-open-sans text-black">
                  <h1 className="m-0 font-open-sans text-lg font-bold text-black">
                    {notif.title}
                  </h1>
                  <h2 className="m-0 font-open-sans text-sm text-gray-600">
                    {formatTime(notif.sentAt)}
                  </h2>
                </div>
                <div className="ml-auto flex items-center self-stretch px-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                  >
                    <path
                      d="M0.287884 0.313303C0.472448 0.128962 0.722649 0.0254192 0.983509 0.0254192C1.24437 0.0254192 1.49456 0.128962 1.67913 0.313303L5.90538 4.53955L10.1316 0.313303C10.2218 0.216585 10.3305 0.139016 10.4512 0.0852169C10.572 0.0314175 10.7023 0.00248994 10.8345 0.000153688C10.9666 -0.00218256 11.0979 0.0221381 11.2205 0.0716456C11.3431 0.121153 11.4544 0.194837 11.5478 0.288313C11.6414 0.381789 11.715 0.493142 11.7645 0.615703C11.814 0.738278 11.8384 0.869567 11.836 1.00174C11.8337 1.13392 11.8048 1.26426 11.751 1.38501C11.6972 1.50576 11.6196 1.61444 11.5229 1.70455L7.29663 5.9308L11.5229 10.1571C11.6196 10.2472 11.6972 10.3559 11.751 10.4766C11.8048 10.5974 11.8337 10.7277 11.836 10.8599C11.8384 10.9921 11.814 11.1233 11.7645 11.2459C11.715 11.3685 11.6414 11.4798 11.5478 11.5732C11.4544 11.6668 11.3431 11.7405 11.2205 11.7899C11.0979 11.8394 10.9666 11.8638 10.8345 11.8615C10.7023 11.8591 10.572 11.8302 10.4512 11.7764C10.3305 11.7226 10.2218 11.645 10.1316 11.5483L5.90538 7.32205L1.67913 11.5483C1.49252 11.7222 1.24571 11.8168 0.990688 11.8124C0.735669 11.8078 0.492358 11.7045 0.311994 11.5242C0.131644 11.3438 0.028337 11.1005 0.0238351 10.8455C0.0193333 10.5904 0.114004 10.3437 0.287884 10.1571L4.51413 5.9308L0.287884 1.70455C0.103543 1.51999 0 1.26979 0 1.00893C0 0.748069 0.103543 0.49788 0.287884 0.313303Z"
                      fill="#212B36"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isPanelOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={handleClosePanel}
          />

          <div className="fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col border-l-2 bg-white">
            <div className="flex items-center gap-4 border-b border-gray-200 px-6 pb-2 pt-4">
              <h2 className="font-open-sans text-2xl font-bold text-black">
                Notifications
              </h2>
              <button
                onClick={() => setActiveTab("all")}
                className={`y-3 border-b-2 font-open-sans font-semibold text-primaryColor ${
                  activeTab === "all"
                    ? "border-primaryColor"
                    : "border-transparent"
                }`}
              >
                <div>All</div>
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={`y-3 border-b-2 font-open-sans font-semibold text-primaryColor ${
                  activeTab === "unread"
                    ? "border-primaryColor"
                    : "border-transparent"
                }`}
              >
                Unread ({unRead.length})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {displayedNotifications.length === 0 ? (
                <div className="flex h-full items-center justify-center text-gray-500">
                  <p className="font-open-sans">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {displayedNotifications.map((notif, i) => (
                    <div
                      key={notif._id || i}
                      className={`flex items-start px-3 py-3 hover:bg-gray-50 ${
                        !notif.isRead ? "cursor-pointer" : ""
                      }`}
                      onClick={() =>
                        !notif.isRead && handleMarkAsRead(notif._id)
                      }
                    >
                      <div className="flex flex-1 flex-col gap-1">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center">
                            <div
                              className={`h-[10px] w-[10px] rounded-full ${
                                !notif.isRead
                                  ? "bg-primaryColor"
                                  : "bg-transparent"
                              }`}
                            />
                          </div>
                          <div className="block pl-3 pt-[1px] font-open-sans text-lg font-bold text-black">
                            {notif.title}
                          </div>
                          <div className="ml-auto flex items-center self-stretch px-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                            >
                              <path
                                d="M0.287884 0.313303C0.472448 0.128962 0.722649 0.0254192 0.983509 0.0254192C1.24437 0.0254192 1.49456 0.128962 1.67913 0.313303L5.90538 4.53955L10.1316 0.313303C10.2218 0.216585 10.3305 0.139016 10.4512 0.0852169C10.572 0.0314175 10.7023 0.00248994 10.8345 0.000153688C10.9666 -0.00218256 11.0979 0.0221381 11.2205 0.0716456C11.3431 0.121153 11.4544 0.194837 11.5478 0.288313C11.6414 0.381789 11.715 0.493142 11.7645 0.615703C11.814 0.738278 11.8384 0.869567 11.836 1.00174C11.8337 1.13392 11.8048 1.26426 11.751 1.38501C11.6972 1.50576 11.6196 1.61444 11.5229 1.70455L7.29663 5.9308L11.5229 10.1571C11.6196 10.2472 11.6972 10.3559 11.751 10.4766C11.8048 10.5974 11.8337 10.7277 11.836 10.8599C11.8384 10.9921 11.814 11.1233 11.7645 11.2459C11.715 11.3685 11.6414 11.4798 11.5478 11.5732C11.4544 11.6668 11.3431 11.7405 11.2205 11.7899C11.0979 11.8394 10.9666 11.8638 10.8345 11.8615C10.7023 11.8591 10.572 11.8302 10.4512 11.7764C10.3305 11.7226 10.2218 11.645 10.1316 11.5483L5.90538 7.32205L1.67913 11.5483C1.49252 11.7222 1.24571 11.8168 0.990688 11.8124C0.735669 11.8078 0.492358 11.7045 0.311994 11.5242C0.131644 11.3438 0.028337 11.1005 0.0238351 10.8455C0.0193333 10.5904 0.114004 10.3437 0.287884 10.1571L4.51413 5.9308L0.287884 1.70455C0.103543 1.51999 0 1.26979 0 1.00893C0 0.748069 0.103543 0.49788 0.287884 0.313303Z"
                                fill="#212B36"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="block pl-[calc(1rem+10px)] font-open-sans text-sm text-secondary-grey">
                          {formatDateTime(notif.sentAt)}
                        </div>
                        <div className="block pl-[calc(1rem+10px)] font-open-sans text-sm text-black">
                          {notif.body}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
