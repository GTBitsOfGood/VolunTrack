import { useEffect, useRef, useState } from "react";
import BoGButton from '../BoGButton';
import DropdownMenu from '../Dropdown';
import "react-quill/dist/quill.snow.css";

export default function NotificationModal({ isOpen, onClose, organizationId }) {
  let ReactQuill;
  if (typeof window !== "undefined") {
    ReactQuill = require("react-quill");
  }
  const quill = useRef(null);
  
  const [activeTab, setActiveTab] = useState("individual");
  const [formData, setFormData] = useState({
    title: "",
    body: "",
    recipients: "everyone",
    scheduledDate: "",
    scheduledTime: "",
    sendInApp: true,
    sendEmail: false,
    sendText: false,
    recurrence: { 
      frequency: "daily",
      startDate: "",
      time: "",
      customRecurrence: null,
    },
  });

  const [recipientMode, setRecipientMode] = useState("everyone");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCustomRecurrence, setShowCustomRecurrence] = useState(false);
  const [customRecurrence, setCustomRecurrence] = useState({
    repeatEvery: 1,
    repeatUnit: "week",
    repeatOn: [],
    ends: "never",
    endDate: "",
    occurrences: 13,
  });

  useEffect(() => {
    if (isOpen && organizationId) fetchUsers();
  }, [isOpen, organizationId]);

  const getCurrentDayInfo = () => {
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const occurrence = Math.ceil(now.getDate() / 7);
    const occurrenceText = ["1st", "2nd", "3rd", "4th", "5th"][occurrence - 1] || `${occurrence}th`;
    
    return {
      dayOfWeek: dayNames[now.getDay()],
      fullDate: `${monthNames[now.getMonth()]} ${now.getDate()}`,
      occurrence: occurrenceText,
    };
  };
  
  const getRecurringEventOptions = () => {
    const dayInfo = getCurrentDayInfo();
    return [
      "Daily",
      `Weekly on ${dayInfo.dayOfWeek}`,
      `Monthly on ${dayInfo.occurrence} ${dayInfo.dayOfWeek}`,
      `Annually on ${dayInfo.fullDate}`,
      "Custom..."
    ];
  };

  const getRecurringEventDisplayText = () => {
    const frequency = formData.recurrence.frequency || "daily";
    const customRec = formData.recurrence.customRecurrence;
    const dayInfo = getCurrentDayInfo();
    
    if (customRec?.repeatOn?.length > 0 && (frequency === "weekly" || frequency === "monthly")) {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayMap = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
      
      const selectedDays = customRec.repeatOn
        .map(day => dayMap[day.toLowerCase()])
        .filter(dayNum => dayNum !== null && dayNum !== undefined)
        .sort((a, b) => a - b)
        .map(dayNum => dayNames[dayNum]);
      
      if (selectedDays.length > 0) {
        const daysList = selectedDays.join(", ");
        return frequency === "weekly" 
          ? `Weekly on ${daysList}`
          : `Monthly on ${dayInfo.occurrence} ${daysList}`;
      }
    }
    
    switch (frequency) {
      case "daily": return "Daily";
      case "weekly": return `Weekly on ${dayInfo.dayOfWeek}`;
      case "monthly": return `Monthly on ${dayInfo.occurrence} ${dayInfo.dayOfWeek}`;
      case "annually": return `Annually on ${dayInfo.fullDate}`;
      case "custom": return "Custom...";
      default: return "Daily";
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users?organizationId=${organizationId}`);
      const data = await res.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddUser = (user) => {
    if (recipientMode === "everyone") {
      setRecipientMode("specific");
      handleInputChange("recipients", []);
    }
    if (!selectedUsers.find((u) => u._id === user._id)) {
      const newUsers = [...selectedUsers, user];
      setSelectedUsers(newUsers);
      handleInputChange("recipients", newUsers.map((u) => u._id));
      setRecipientMode("specific");
    }
    setUserSearchQuery("");
    setShowUserDropdown(false);
  };

  const handleAddEveryone = () => {
    setSelectedUsers([]);
    setRecipientMode("everyone");
    handleInputChange("recipients", "everyone");
    setUserSearchQuery("");
    setShowUserDropdown(false);
  };

  const handleRemoveUser = (id) => {
    const newUsers = selectedUsers.filter((u) => u._id !== id);
    setSelectedUsers(newUsers);
    handleInputChange("recipients", newUsers.map((u) => u._id));
    if (newUsers.length === 0) {
      setRecipientMode("everyone");
      handleInputChange("recipients", "everyone");
    }
  };

  const handleRemoveEveryone = () => {
    setRecipientMode("specific");
    handleInputChange("recipients", []);
  };

  const filteredUsers = users.filter(
    (u) =>
      !selectedUsers.some((s) => s._id === u._id) &&
      [u.firstName, u.lastName, u.email]
        .join(" ")
        .toLowerCase()
        .includes(userSearchQuery.toLowerCase())
  );

  const handleRecurringOptionSelect = (choice) => {
    let selectedFrequency;
    if (choice === "Daily") selectedFrequency = "daily";
    else if (choice.startsWith("Weekly")) selectedFrequency = "weekly";
    else if (choice.startsWith("Monthly")) selectedFrequency = "monthly";
    else if (choice.startsWith("Annually")) selectedFrequency = "annually";
    else if (choice === "Custom...") selectedFrequency = "custom";
    
    if (selectedFrequency === "custom") {
      if (formData.recurrence.customRecurrence) {
        setCustomRecurrence(formData.recurrence.customRecurrence);
      } else {
        const currentFreq = formData.recurrence.frequency || "daily";
        const unit = currentFreq === "monthly" ? "month" : "week";
        setCustomRecurrence({
          repeatEvery: 1,
          repeatUnit: unit,
          repeatOn: [],
          ends: "never",
          endDate: "",
          occurrences: 13,
        });
      }
      setShowCustomRecurrence(true);
    } else {
      const shouldPreserveCustom = 
        (selectedFrequency === "weekly" || selectedFrequency === "monthly") && 
        formData.recurrence.customRecurrence &&
        formData.recurrence.customRecurrence.repeatUnit === (selectedFrequency === "weekly" ? "week" : "month");
      
      setFormData((prev) => ({
        ...prev,
        recurrence: { 
          ...prev.recurrence, 
          frequency: selectedFrequency, 
          customRecurrence: shouldPreserveCustom ? prev.recurrence.customRecurrence : null 
        },
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.body) {
      alert("Please fill in all required fields");
      return;
    }
    if (recipientMode === "specific" && selectedUsers.length === 0) {
      alert("Select at least one user");
      return;
    }
    if (activeTab === "recurring" && !formData.recurrence?.time) {
      alert("Please select a time for the recurring notification");
      return;
    }
    if (!formData.sendInApp && !formData.sendEmail && !formData.sendText) {
      alert("Select a send through option");
      return;
    }

    setLoading(true);
    try {
      let scheduledFor;
      let todayStr = null;
      
      if (activeTab === "individual") {
        if (formData.scheduledDate && formData.scheduledTime) {
          const [year, month, day] = formData.scheduledDate.split("-");
          const [hours, minutes] = formData.scheduledTime.split(":");
          scheduledFor = new Date(
            parseInt(year), 
            parseInt(month) - 1, 
            parseInt(day), 
            parseInt(hours), 
            parseInt(minutes)
          ).toISOString();
        } else {
          scheduledFor = new Date().toISOString();
        }
      } else {
        const today = new Date();
        const [hours, minutes] = formData.recurrence.time.split(":");
        scheduledFor = new Date(
          today.getFullYear(), 
          today.getMonth(), 
          today.getDate(), 
          parseInt(hours), 
          parseInt(minutes)
        ).toISOString();
        
        todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      }

      const payload = {
        ...formData,
        type: activeTab,
        scheduledFor,
        recurrence: activeTab === "recurring" ? {
          ...formData.recurrence,
          startDate: formData.recurrence.startDate || todayStr,
        } : undefined,
      };
      
      delete payload.scheduledDate;
      delete payload.scheduledTime;

      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (res.ok) {
        onClose(true);
      } else {
        alert(data.error || "Failed to create notification");
        console.error("Notification creation error:", data);
      }
    } catch (err) {
      console.error("Error creating notification:", err);
      alert("Error creating notification: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-6xl rounded-2xl bg-white shadow-xl">
        <div className="flex border-b border-gray-200">
          {["individual", "recurring"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center text-sm font-medium ${
                activeTab === tab
                  ? "border-b-4 border-teal-600 text-teal-600"
                  : "text-gray-500 hover:text-teal-600"
              }`}
            >
              {tab === "individual" ? "Individual Notification" : "Recurring Notification"}
            </button>
          ))}
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Notification Information
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Notification title"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Body <span className="text-red-500">*</span>
            </label>
            <div className="bg-white">
              {ReactQuill && (
                <ReactQuill
                  className="h-96"
                  value={formData.body}
                  onChange={(newValue) => handleInputChange("body", newValue)}
                  ref={quill}
                />
              )}
            </div>
          </div>

          <div className="mb-6 mt-20">
            <label className="block text-sm font-bold text-gray-800 mb-1">
              Send to <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <div 
                className="min-h-[42px] w-full rounded border border-gray-300 px-3 py-2 focus-within:border-teal-600 focus-within:ring-1 focus-within:ring-teal-600 cursor-text"
                onClick={() => document.getElementById('recipient-search')?.focus()}
              >
                <div className="flex flex-wrap gap-2 items-center">
                  {recipientMode === "everyone" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-900">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveEveryone();
                        }}
                        className="text-gray-700 hover:text-gray-900 font-bold text-base leading-none"
                      >
                        ×
                      </button>
                      Everyone
                    </span>
                  )}
                  {selectedUsers.map((user) => (
                    <span
                      key={user._id}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-900"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveUser(user._id);
                        }}
                        className="text-gray-700 hover:text-gray-900 font-bold text-base leading-none"
                      >
                        ×
                      </button>
                      {user.firstName} {user.lastName}
                    </span>
                  ))}
                  <input
                    id="recipient-search"
                    type="text"
                    placeholder="Search users..."
                    value={userSearchQuery}
                    onChange={(e) => {
                      setUserSearchQuery(e.target.value);
                      setShowUserDropdown(true);
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    onBlur={() => setTimeout(() => setShowUserDropdown(false), 200)}
                    className="flex-1 min-w-[120px] outline-none text-sm"
                  />
                </div>
              </div>

              {showUserDropdown && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white shadow-lg">
                  {recipientMode !== "everyone" && (
                    <button
                      type="button"
                      onClick={() => handleAddEveryone()}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 border-b border-gray-200"
                    >
                      <div className="font-medium text-sm">Everyone</div>
                      <div className="text-xs text-gray-500">Send to all members</div>
                    </button>
                  )}
                  {userSearchQuery.length > 0 && filteredUsers.length > 0 && (
                    <>
                      {recipientMode !== "everyone" && (
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-200 bg-gray-50">
                          Users
                        </div>
                      )}
                      {filteredUsers.slice(0, 10).map((user) => (
                        <button
                          type="button"
                          key={user._id}
                          onClick={() => handleAddUser(user)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50"
                        >
                          <div className="font-medium text-sm">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </button>
                      ))}
                    </>
                  )}
                  {userSearchQuery.length > 0 && filteredUsers.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">No users found</div>
                  )}
                  {userSearchQuery.length === 0 && recipientMode === "everyone" && (
                    <div className="px-4 py-2 text-sm text-gray-500">Type to search for users</div>
                  )}
                  {userSearchQuery.length === 0 && recipientMode !== "everyone" && selectedUsers.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">Type to search for users or select "Everyone"</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {activeTab === "individual" && (
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Schedule date
                </label>
                <input
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">
                  Schedule time
                </label>
                <input
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => handleInputChange("scheduledTime", e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                />
              </div>
            </div>
          )}

          {activeTab === "recurring" && (
            <div className="mb-6">
              <div className="flex gap-4 mb-4" style={{ maxWidth: '50%' }}>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-800 mb-1">
                    Recurring Event
                  </label>
                  <DropdownMenu
                    value={getRecurringEventDisplayText()}
                    options={getRecurringEventOptions()}
                    callback={handleRecurringOptionSelect}
                    arrow
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-800 mb-1">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.recurrence.time || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        recurrence: { ...prev.recurrence, time: e.target.value },
                      }))
                    }
                    placeholder="--:--"
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  />
                </div>
              </div>
              
              <div className="border-t border-gray-300 my-4"></div>
            </div>
          )}
          
          {showCustomRecurrence && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-lg bg-white shadow-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Custom Recurrence</h3>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-gray-800 mb-1">
                    Repeat every
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={customRecurrence.repeatEvery}
                      onChange={(e) => setCustomRecurrence(prev => ({ ...prev, repeatEvery: parseInt(e.target.value) || 1 }))}
                      className="w-20 rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    />
                    <select
                      value={customRecurrence.repeatUnit}
                      onChange={(e) => setCustomRecurrence(prev => ({ ...prev, repeatUnit: e.target.value }))}
                      className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600"
                    >
                      <option value="day">day</option>
                      <option value="week">week</option>
                      <option value="month">month</option>
                      <option value="year">year</option>
                    </select>
                  </div>
                </div>
                
                {customRecurrence.repeatUnit === "week" && (
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-800 mb-2">
                      Repeat on
                    </label>
                    <div className="flex gap-2">
                      {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => {
                        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
                        const dayName = days[index];
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setCustomRecurrence(prev => ({
                                ...prev,
                                repeatOn: prev.repeatOn.includes(dayName)
                                  ? prev.repeatOn.filter(d => d !== dayName)
                                  : [...prev.repeatOn, dayName]
                              }));
                            }}
                            className={`w-10 h-10 rounded-full text-sm font-medium ${
                              customRecurrence.repeatOn.includes(dayName)
                                ? "bg-teal-600 text-white"
                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    Ends
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="ends"
                        value="never"
                        checked={customRecurrence.ends === "never"}
                        onChange={(e) => setCustomRecurrence(prev => ({ ...prev, ends: e.target.value }))}
                        className="text-teal-600 focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">Never</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="ends"
                        value="on"
                        checked={customRecurrence.ends === "on"}
                        onChange={(e) => setCustomRecurrence(prev => ({ ...prev, ends: e.target.value }))}
                        className="text-teal-600 focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">On</span>
                      <input
                        type="date"
                        value={customRecurrence.endDate}
                        onChange={(e) => setCustomRecurrence(prev => ({ ...prev, endDate: e.target.value }))}
                        disabled={customRecurrence.ends !== "on"}
                        className="ml-2 rounded border border-gray-300 px-2 py-1 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 disabled:bg-gray-100 disabled:text-gray-400"
                      />
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="ends"
                        value="after"
                        checked={customRecurrence.ends === "after"}
                        onChange={(e) => setCustomRecurrence(prev => ({ ...prev, ends: e.target.value }))}
                        className="text-teal-600 focus:ring-teal-600"
                      />
                      <span className="text-sm text-gray-700">After</span>
                      <input
                        type="number"
                        min="1"
                        value={customRecurrence.occurrences}
                        onChange={(e) => setCustomRecurrence(prev => ({ ...prev, occurrences: parseInt(e.target.value) || 1 }))}
                        disabled={customRecurrence.ends !== "after"}
                        className="ml-2 w-32 rounded border border-gray-300 px-2 py-1 text-sm focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 disabled:bg-gray-100 disabled:text-gray-400"
                      />
                      <span className="text-sm text-gray-500">occurrences</span>
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCustomRecurrence(false)}
                    className="px-4 py-2 text-sm font-medium text-teal-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      let baseFrequency = "custom";
                      if (customRecurrence.repeatEvery === 1) {
                        const unitMap = {
                          day: "daily",
                          week: "weekly",
                          month: "monthly",
                          year: "annually"
                        };
                        baseFrequency = unitMap[customRecurrence.repeatUnit] || "custom";
                      }
                      
                      setFormData((prev) => ({
                        ...prev,
                        recurrence: {
                          ...prev.recurrence,
                          frequency: baseFrequency,
                          customRecurrence: customRecurrence,
                        },
                      }));
                      setShowCustomRecurrence(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}

          <div>
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
                    checked={formData[field]}
                    onChange={(e) => handleInputChange(field, e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={() => onClose(false)}
            className="rounded px-4 py-2 text-sm font-medium text-primaryColor hover:bg-gray-100"
          >
            Cancel
          </button>
          <BoGButton
            onClick={handleSubmit}
            disabled={loading}
            text="Create"
          />
        </div>
      </div>
    </div>
  );
}