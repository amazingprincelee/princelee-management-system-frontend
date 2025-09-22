import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaCalendarAlt as CalendarIcon, 
  FaChevronLeft as ChevronLeft, 
  FaChevronRight as ChevronRight, 
  FaPlus as Plus,
  FaFilter as Filter,
  FaSearch as Search,
  FaTh as Grid,
  FaList as List,
  FaClock as Clock,
  FaMapMarkerAlt as MapPin,
  FaUsers as Users,
  FaExclamationCircle as AlertCircle,
  FaCheckCircle as CheckCircle,
  FaTimesCircle as XCircle
} from 'react-icons/fa';
import {
  fetchEventsInRange,
  fetchUpcomingEvents,
  setCurrentDate,
  setCurrentView,
  setSelectedDate,
  updateFilters,
  clearFilters
} from '../../redux/features/calendarSlice';
import EventModal from './EventModal';
import EventForm from './EventForm';
import './Calendar.css';

const Calendar = () => {
  const dispatch = useDispatch();
  const {
    events,
    upcomingEvents,
    eventsByDate,
    currentView,
    currentDate,
    selectedDate,
    filters,
    loading,
    error
  } = useSelector(state => state.calendar);
  
  // Get user role from auth state
  const { role: userRole } = useSelector(state => state.auth);

  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Calendar navigation
  const currentDateObj = useMemo(() => new Date(currentDate), [currentDate]);
  const currentMonth = currentDateObj.getMonth();
  const currentYear = currentDateObj.getFullYear();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const days = [];

    // Previous month's trailing days
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      days.push({
        date: new Date(currentYear, currentMonth - 1, day),
        isCurrentMonth: false,
        day: day
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(currentYear, currentMonth, day),
        isCurrentMonth: true,
        day: day
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, day),
        isCurrentMonth: false,
        day: day
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Load events when date range changes
  useEffect(() => {
    const startDate = calendarDays[0]?.date;
    const endDate = calendarDays[calendarDays.length - 1]?.date;
    
    if (startDate && endDate) {
      dispatch(fetchEventsInRange({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        view: currentView
      }));
    }
  }, [dispatch, calendarDays, currentView]);

  // Load upcoming events
  useEffect(() => {
    dispatch(fetchUpcomingEvents({ limit: 10, days: 30 }));
  }, [dispatch]);

  // Navigation functions
  const navigateMonth = (direction) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    dispatch(setCurrentDate(newDate.toISOString()));
  };

  const goToToday = () => {
    dispatch(setCurrentDate(new Date().toISOString()));
  };

  // Event handlers
  const handleDateClick = (date) => {
    dispatch(setSelectedDate(date.toISOString()));
    setShowEventForm(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(null);
    setShowEventForm(true);
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(updateFilters({ [filterName]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return eventsByDate[dateStr] || [];
  };

  // Get event type color
  const getEventTypeColor = (type) => {
    const eventTypeColors = {
      'academic': 'bg-blue-500',
      'exam': 'bg-red-500',
      'holiday': 'bg-green-500',
      'meeting': 'bg-purple-500',
      'sports': 'bg-yellow-500',
      'cultural': 'bg-pink-500',
      'workshop': 'bg-indigo-500',
      'deadline': 'bg-orange-500',
      'other': 'bg-gray-500'
    };
    return eventTypeColors[type] || eventTypeColors.other;
  };

  // Get priority icon
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-3 h-3 text-red-500" />;
      case 'medium':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading.events && !events.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <div className="calendar-title">
          <CalendarIcon className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-neutral-900">School Calendar</h1>
        </div>
        
        <div className="calendar-actions">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-filter ${showFilters ? 'active' : ''}`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          {/* Only show Add Event button for admin users */}
          {userRole === 'admin' && (
            <button
              onClick={handleCreateEvent}
              className="btn-primary bg-primary"
            >
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="calendar-filters">
          <div className="filter-group">
            <label>Event Type:</label>
            <select
              value={filters.eventType}
              onChange={(e) => handleFilterChange('eventType', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="academic">Academic</option>
              <option value="exam">Exam</option>
              <option value="holiday">Holiday</option>
              <option value="meeting">Meeting</option>
              <option value="sports">Sports</option>
              <option value="cultural">Cultural</option>
              <option value="workshop">Workshop</option>
              <option value="deadline">Deadline</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority:</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search:</label>
            <div className="search-input">
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        </div>
      )}

      <div className="calendar-content">
        {/* Calendar Navigation */}
        <div className="calendar-nav">
          <div className="nav-controls">
            <button
              onClick={() => navigateMonth(-1)}
              className="nav-btn"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="current-month">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            
            <button
              onClick={() => navigateMonth(1)}
              className="nav-btn"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="btn-today"
          >
            Today
          </button>
        </div>

        <div className="calendar-layout">
          {/* Calendar Grid */}
          <div className="calendar-grid">
            {/* Week headers */}
            <div className="week-headers">
              {weekDays.map(day => (
                <div key={day} className="week-header">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="calendar-days">
              {calendarDays.map((dayObj, index) => {
                const dayEvents = getEventsForDate(dayObj.date);
                const isToday = dayObj.date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && 
                  dayObj.date.toDateString() === new Date(selectedDate).toDateString();

                return (
                  <div
                    key={index}
                    className={`calendar-day ${!dayObj.isCurrentMonth ? 'other-month' : ''} 
                               ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDateClick(dayObj.date)}
                  >
                    <span className="day-number">{dayObj.day}</span>
                    
                    {dayEvents.length > 0 && (
                      <div className="day-events">
                        {dayEvents.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={event._id}
                            className={`day-event ${getEventTypeColor(event.eventType)}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);
                            }}
                            title={event.title}
                          >
                            <span className="event-title">{event.title}</span>
                            {getPriorityIcon(event.priority)}
                          </div>
                        ))}
                        
                        {dayEvents.length > 3 && (
                          <div className="more-events">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events Sidebar */}
          <div className="upcoming-events">
            <h3 className="sidebar-title">Upcoming Events</h3>
            
            {loading.upcomingEvents ? (
              <div className="loading-spinner">
                <div className="w-6 h-6 border-b-2 rounded-full animate-spin border-primary-600"></div>
              </div>
            ) : upcomingEvents.length > 0 ? (
              <div className="events-list">
                {upcomingEvents.map(event => (
                  <div
                    key={event._id}
                    className="upcoming-event"
                    onClick={() => handleEventClick(event)}
                  >
                    <div className={`event-indicator ${getEventTypeColor(event.eventType)}`}></div>
                    
                    <div className="event-details">
                      <h4 className="event-title">{event.title}</h4>
                      
                      <div className="event-meta">
                        <div className="event-date">
                          <Clock className="w-3 h-3" />
                          {new Date(event.startDate).toLocaleDateString()}
                        </div>
                        
                        {event.location && (
                          <div className="event-location">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </div>
                        )}
                        
                        {event.targetAudience?.length > 0 && (
                          <div className="event-audience">
                            <Users className="w-3 h-3" />
                            {event.targetAudience.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      {getPriorityIcon(event.priority)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-events">
                <CalendarIcon className="w-8 h-8 text-neutral-400" />
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEventModal && selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => {
            setShowEventModal(false);
            setSelectedEvent(null);
          }}
          onEdit={() => {
            setShowEventModal(false);
            setShowEventForm(true);
          }}
        />
      )}

      {showEventForm && (
        <EventForm
          event={selectedEvent}
          initialDate={selectedDate}
          onClose={() => {
            setShowEventForm(false);
            setSelectedEvent(null);
            dispatch(setSelectedDate(null));
          }}
          onSuccess={() => {
            setShowEventForm(false);
            setSelectedEvent(null);
            dispatch(setSelectedDate(null));
            // Refresh events
            const startDate = calendarDays[0]?.date;
            const endDate = calendarDays[calendarDays.length - 1]?.date;
            if (startDate && endDate) {
              dispatch(fetchEventsInRange({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                view: currentView
              }));
            }
            dispatch(fetchUpcomingEvents({ limit: 10, days: 30 }));
          }}
        />
      )}

      {/* Error Display */}
      {error.events && (
        <div className="error-message">
          <XCircle className="w-5 h-5 text-red-500" />
          <span>{error.events}</span>
        </div>
      )}
    </div>
  );
};

export default Calendar;