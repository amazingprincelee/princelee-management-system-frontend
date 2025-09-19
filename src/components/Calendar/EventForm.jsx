import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaTimes as X,
  FaCalendarAlt as Calendar,
  FaClock as Clock,
  FaMapMarkerAlt as MapPin,
  FaUsers as Users,
  FaFileAlt as FileText,
  FaSave as Save,
  FaExclamationCircle as AlertCircle,
  FaTag as Tag,
  FaRedo as Repeat
} from 'react-icons/fa';
import { createEvent, updateEvent } from '../../redux/features/calendarSlice';

const EventForm = ({ event, initialDate, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.calendar);
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'academic',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isAllDay: false,
    location: '',
    targetAudience: [],
    priority: 'medium',
    status: 'scheduled',
    academicSession: '',
    term: '',
    recurrence: {
      type: 'none',
      interval: 1,
      endDate: ''
    },
    visibility: 'public'
  });

  const [errors, setErrors] = useState({});
  const [audienceInput, setAudienceInput] = useState('');

  // Initialize form data
  useEffect(() => {
    if (event) {
      // Editing existing event
      const startDate = new Date(event.startDate);
      const endDate = event.endDate ? new Date(event.endDate) : null;

      setFormData({
        title: event.title || '',
        description: event.description || '',
        eventType: event.eventType || 'academic',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate ? endDate.toISOString().split('T')[0] : '',
        startTime: event.isAllDay ? '' : startDate.toTimeString().slice(0, 5),
        endTime: event.isAllDay || !endDate ? '' : endDate.toTimeString().slice(0, 5),
        isAllDay: event.isAllDay || false,
        location: event.location || '',
        targetAudience: event.targetAudience || [],
        priority: event.priority || 'medium',
        status: event.status || 'scheduled',
        academicSession: event.academicSession || '',
        term: event.term || '',
        recurrence: event.recurrence || {
          type: 'none',
          interval: 1,
          endDate: ''
        },
        visibility: event.visibility || 'public'
      });
    } else if (initialDate) {
      // Creating new event with initial date
      const date = new Date(initialDate);
      setFormData(prev => ({
        ...prev,
        startDate: date.toISOString().split('T')[0],
        endDate: date.toISOString().split('T')[0]
      }));
    }
  }, [event, initialDate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (like recurrence)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAudienceAdd = () => {
    if (audienceInput.trim() && !formData.targetAudience.includes(audienceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        targetAudience: [...prev.targetAudience, audienceInput.trim()]
      }));
      setAudienceInput('');
    }
  };

  const handleAudienceRemove = (audience) => {
    setFormData(prev => ({
      ...prev,
      targetAudience: prev.targetAudience.filter(item => item !== audience)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.isAllDay && !formData.startTime) {
      newErrors.startTime = 'Start time is required for non-all-day events';
    }

    if (formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'End date cannot be before start date';
    }

    if (!formData.isAllDay && formData.startTime && formData.endTime && 
        formData.startDate === formData.endDate && formData.endTime <= formData.startTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (formData.recurrence.type !== 'none' && formData.recurrence.endDate && 
        formData.recurrence.endDate <= formData.startDate) {
      newErrors['recurrence.endDate'] = 'Recurrence end date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const eventData = {
        ...formData,
        startDate: formData.isAllDay 
          ? formData.startDate 
          : `${formData.startDate}T${formData.startTime}:00.000Z`,
        endDate: formData.endDate 
          ? (formData.isAllDay 
              ? formData.endDate 
              : `${formData.endDate}T${formData.endTime || formData.startTime}:00.000Z`)
          : null
      };

      // Remove empty fields
      Object.keys(eventData).forEach(key => {
        if (eventData[key] === '' || eventData[key] === null) {
          delete eventData[key];
        }
      });

      if (event) {
        await dispatch(updateEvent({ eventId: event._id, eventData })).unwrap();
      } else {
        await dispatch(createEvent(eventData)).unwrap();
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  const eventTypes = [
    { value: 'academic', label: 'Academic' },
    { value: 'exam', label: 'Exam' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'event', label: 'Event' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'other', label: 'Other' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  const statuses = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const recurrenceTypes = [
    { value: 'none', label: 'No recurrence' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const predefinedAudiences = [
    'All Students',
    'All Teachers',
    'All Parents',
    'All Staff',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="close-btn"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="event-form">
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="section-title">
              <FileText className="w-5 h-5" />
              Basic Information
            </h3>

            <div className="form-group">
              <label htmlFor="title" className="form-label required">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`form-input ${errors.title ? 'error' : ''}`}
                placeholder="Enter event title"
              />
              {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows="3"
                placeholder="Enter event description"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="eventType" className="form-label">
                  Event Type
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priority" className="form-label">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {priorities.map(priority => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {statuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date and Time */}
          <div className="form-section">
            <h3 className="section-title">
              <Calendar className="w-5 h-5" />
              Date & Time
            </h3>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isAllDay"
                  checked={formData.isAllDay}
                  onChange={handleInputChange}
                  className="form-checkbox"
                />
                All Day Event
              </label>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate" className="form-label required">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className={`form-input ${errors.startDate ? 'error' : ''}`}
                />
                {errors.startDate && <span className="error-text">{errors.startDate}</span>}
              </div>

              {!formData.isAllDay && (
                <div className="form-group">
                  <label htmlFor="startTime" className="form-label required">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className={`form-input ${errors.startTime ? 'error' : ''}`}
                  />
                  {errors.startTime && <span className="error-text">{errors.startTime}</span>}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className={`form-input ${errors.endDate ? 'error' : ''}`}
                />
                {errors.endDate && <span className="error-text">{errors.endDate}</span>}
              </div>

              {!formData.isAllDay && formData.endDate && (
                <div className="form-group">
                  <label htmlFor="endTime" className="form-label">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className={`form-input ${errors.endTime ? 'error' : ''}`}
                  />
                  {errors.endTime && <span className="error-text">{errors.endTime}</span>}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="form-section">
            <h3 className="section-title">
              <MapPin className="w-5 h-5" />
              Location
            </h3>

            <div className="form-group">
              <label htmlFor="location" className="form-label">
                Event Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Enter event location"
              />
            </div>
          </div>

          {/* Target Audience */}
          <div className="form-section">
            <h3 className="section-title">
              <Users className="w-5 h-5" />
              Target Audience
            </h3>

            <div className="form-group">
              <label className="form-label">
                Select Audience
              </label>
              <div className="audience-selector">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !formData.targetAudience.includes(e.target.value)) {
                      setFormData(prev => ({
                        ...prev,
                        targetAudience: [...prev.targetAudience, e.target.value]
                      }));
                    }
                  }}
                  className="form-select"
                >
                  <option value="">Select predefined audience</option>
                  {predefinedAudiences.map(audience => (
                    <option key={audience} value={audience}>
                      {audience}
                    </option>
                  ))}
                </select>
              </div>

              <div className="audience-input">
                <input
                  type="text"
                  value={audienceInput}
                  onChange={(e) => setAudienceInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAudienceAdd())}
                  className="form-input"
                  placeholder="Or type custom audience"
                />
                <button
                  type="button"
                  onClick={handleAudienceAdd}
                  className="add-btn"
                >
                  Add
                </button>
              </div>

              {formData.targetAudience.length > 0 && (
                <div className="audience-tags">
                  {formData.targetAudience.map((audience, index) => (
                    <span key={index} className="audience-tag">
                      {audience}
                      <button
                        type="button"
                        onClick={() => handleAudienceRemove(audience)}
                        className="remove-tag-btn"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Academic Information */}
          <div className="form-section">
            <h3 className="section-title">
              <Tag className="w-5 h-5" />
              Academic Information
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="academicSession" className="form-label">
                  Academic Session
                </label>
                <input
                  type="text"
                  id="academicSession"
                  name="academicSession"
                  value={formData.academicSession}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., 2023-2024"
                />
              </div>

              <div className="form-group">
                <label htmlFor="term" className="form-label">
                  Term
                </label>
                <select
                  id="term"
                  name="term"
                  value={formData.term}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select term</option>
                  <option value="First Term">First Term</option>
                  <option value="Second Term">Second Term</option>
                  <option value="Third Term">Third Term</option>
                </select>
              </div>
            </div>
          </div>

          {/* Recurrence */}
          <div className="form-section">
            <h3 className="section-title">
              <Repeat className="w-5 h-5" />
              Recurrence
            </h3>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="recurrence.type" className="form-label">
                  Repeat
                </label>
                <select
                  id="recurrence.type"
                  name="recurrence.type"
                  value={formData.recurrence.type}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  {recurrenceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.recurrence.type !== 'none' && (
                <>
                  <div className="form-group">
                    <label htmlFor="recurrence.interval" className="form-label">
                      Every
                    </label>
                    <input
                      type="number"
                      id="recurrence.interval"
                      name="recurrence.interval"
                      value={formData.recurrence.interval}
                      onChange={handleInputChange}
                      className="form-input"
                      min="1"
                      max="365"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="recurrence.endDate" className="form-label">
                      Until
                    </label>
                    <input
                      type="date"
                      id="recurrence.endDate"
                      name="recurrence.endDate"
                      value={formData.recurrence.endDate}
                      onChange={handleInputChange}
                      className={`form-input ${errors['recurrence.endDate'] ? 'error' : ''}`}
                    />
                    {errors['recurrence.endDate'] && (
                      <span className="error-text">{errors['recurrence.endDate']}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error.creating && (
            <div className="error-message">
              <AlertCircle className="w-5 h-5" />
              <span>{error.creating}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading.creating || loading.updating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-save"
              disabled={loading.creating || loading.updating}
            >
              {loading.creating || loading.updating ? (
                <div className="loading-spinner"></div>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {event ? 'Update Event' : 'Create Event'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .close-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background-color: #f3f4f6;
          color: #6b7280;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background-color: #e5e7eb;
        }

        .event-form {
          padding: 1.5rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-label.required::after {
          content: ' *';
          color: #ef4444;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background-color: white;
          color: #374151;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error,
        .form-select.error,
        .form-textarea.error {
          border-color: #ef4444;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
          cursor: pointer;
        }

        .form-checkbox {
          width: 1rem;
          height: 1rem;
          accent-color: #3b82f6;
        }

        .audience-selector {
          margin-bottom: 0.5rem;
        }

        .audience-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .add-btn {
          padding: 0.75rem 1rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .add-btn:hover {
          background-color: #2563eb;
        }

        .audience-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .audience-tag {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background-color: #f3f4f6;
          color: #374151;
          border-radius: 9999px;
          font-size: 0.875rem;
        }

        .remove-tag-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          background-color: #e5e7eb;
          color: #6b7280;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.2s;
        }

        .remove-tag-btn:hover {
          background-color: #d1d5db;
          color: #374151;
        }

        .error-text {
          display: block;
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.5rem;
          color: #dc2626;
          margin-bottom: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          padding-top: 1.5rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background-color: #e5e7eb;
        }

        .btn-save {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-save:hover {
          background-color: #2563eb;
        }

        .btn-save:disabled,
        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 768px) {
          .modal-content {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .audience-input {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default EventForm;