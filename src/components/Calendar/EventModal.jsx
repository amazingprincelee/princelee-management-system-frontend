import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaTimes as X,
  FaCalendarAlt as Calendar,
  FaClock as Clock,
  FaMapMarkerAlt as MapPin,
  FaUsers as Users,
  FaFileAlt as FileText,
  FaEdit as Edit,
  FaTrash as Trash2,
  FaExclamationCircle as AlertCircle,
  FaCheckCircle as CheckCircle,
  FaTimesCircle as XCircle,
  FaUser as User,
  FaTag as Tag,
  FaRedo as Repeat
} from 'react-icons/fa';
import { deleteEvent } from '../../redux/features/calendarSlice';

const EventModal = ({ event, onClose, onEdit }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.calendar);
  const { role: userRole } = useSelector(state => state.auth);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    try {
      await dispatch(deleteEvent(event._id)).unwrap();
      onClose();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'academic': 'bg-blue-100 text-blue-800',
      'exam': 'bg-red-100 text-red-800',
      'holiday': 'bg-green-100 text-green-800',
      'meeting': 'bg-purple-100 text-purple-800',
      'event': 'bg-yellow-100 text-yellow-800',
      'deadline': 'bg-orange-100 text-orange-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.other;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'text-red-600',
      'medium': 'text-yellow-600',
      'low': 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'scheduled': 'bg-blue-100 text-blue-800',
      'ongoing': 'bg-green-100 text-green-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.scheduled;
  };

  const formatRecurrence = (recurrence) => {
    if (!recurrence || recurrence.type === 'none') return 'No recurrence';
    
    let text = `Repeats ${recurrence.type}`;
    if (recurrence.interval > 1) {
      text += ` every ${recurrence.interval} ${recurrence.type}s`;
    }
    if (recurrence.endDate) {
      text += ` until ${formatDate(recurrence.endDate)}`;
    }
    return text;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 className="modal-title">{event.title}</h2>
            <div className="event-badges">
              <span className={`event-type-badge ${getEventTypeColor(event.eventType)}`}>
                {event.eventType}
              </span>
              <span className={`priority-badge ${getPriorityColor(event.priority)}`}>
                {getPriorityIcon(event.priority)}
                {event.priority}
              </span>
              <span className={`status-badge ${getStatusColor(event.status)}`}>
                {event.status}
              </span>
            </div>
          </div>
          
          <div className="modal-actions">
            {/* Only show edit and delete buttons for admin users */}
            {userRole === 'admin' && (
              <>
                <button
                  onClick={onEdit}
                  className="action-btn edit-btn"
                  title="Edit Event"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="action-btn delete-btn"
                  title="Delete Event"
                  disabled={loading.deleting}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="action-btn close-btn"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Date and Time */}
          <div className="event-section">
            <div className="section-header">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3>Date & Time</h3>
            </div>
            <div className="section-content">
              <div className="date-time-info">
                <div className="date-info">
                  <strong>Start:</strong> {formatDate(event.startDate)}
                  {event.startTime && ` at ${formatTime(event.startDate)}`}
                </div>
                {event.endDate && (
                  <div className="date-info">
                    <strong>End:</strong> {formatDate(event.endDate)}
                    {event.endTime && ` at ${formatTime(event.endDate)}`}
                  </div>
                )}
                {event.isAllDay && (
                  <div className="all-day-badge">
                    <Clock className="w-4 h-4" />
                    All Day Event
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="event-section">
              <div className="section-header">
                <FileText className="w-5 h-5 text-gray-600" />
                <h3>Description</h3>
              </div>
              <div className="section-content">
                <p className="description-text">{event.description}</p>
              </div>
            </div>
          )}

          {/* Location */}
          {event.location && (
            <div className="event-section">
              <div className="section-header">
                <MapPin className="w-5 h-5 text-green-600" />
                <h3>Location</h3>
              </div>
              <div className="section-content">
                <p className="location-text">{event.location}</p>
              </div>
            </div>
          )}

          {/* Target Audience */}
          {event.targetAudience && event.targetAudience.length > 0 && (
            <div className="event-section">
              <div className="section-header">
                <Users className="w-5 h-5 text-purple-600" />
                <h3>Target Audience</h3>
              </div>
              <div className="section-content">
                <div className="audience-tags">
                  {event.targetAudience.map((audience, index) => (
                    <span key={index} className="audience-tag">
                      {audience}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Academic Information */}
          {(event.academicSession || event.term) && (
            <div className="event-section">
              <div className="section-header">
                <Tag className="w-5 h-5 text-indigo-600" />
                <h3>Academic Information</h3>
              </div>
              <div className="section-content">
                {event.academicSession && (
                  <div className="academic-info">
                    <strong>Academic Session:</strong> {event.academicSession}
                  </div>
                )}
                {event.term && (
                  <div className="academic-info">
                    <strong>Term:</strong> {event.term}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recurrence */}
          {event.recurrence && event.recurrence.type !== 'none' && (
            <div className="event-section">
              <div className="section-header">
                <Repeat className="w-5 h-5 text-orange-600" />
                <h3>Recurrence</h3>
              </div>
              <div className="section-content">
                <p className="recurrence-text">{formatRecurrence(event.recurrence)}</p>
              </div>
            </div>
          )}

          {/* Created By */}
          {event.createdBy && (
            <div className="event-section">
              <div className="section-header">
                <User className="w-5 h-5 text-gray-600" />
                <h3>Created By</h3>
              </div>
              <div className="section-content">
                <p className="creator-text">
                  {event.createdBy.name || event.createdBy.email || 'Unknown'}
                </p>
                <p className="created-date">
                  {new Date(event.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && userRole === 'admin' && (
          <div className="delete-confirm-overlay">
            <div className="delete-confirm-modal">
              <div className="delete-confirm-header">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <h3>Delete Event</h3>
              </div>
              <p>Are you sure you want to delete this event? This action cannot be undone.</p>
              <div className="delete-confirm-actions">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn-cancel"
                  disabled={loading.deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn-delete"
                  disabled={loading.deleting}
                >
                  {loading.deleting ? (
                    <div className="loading-spinner-small"></div>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
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
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-title-section {
          flex: 1;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0 0 0.75rem 0;
        }

        .event-badges {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .event-type-badge,
        .priority-badge,
        .status-badge {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .modal-actions {
          display: flex;
          gap: 0.5rem;
          margin-left: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-btn {
          background-color: #dbeafe;
          color: #3b82f6;
        }

        .edit-btn:hover {
          background-color: #bfdbfe;
        }

        .delete-btn {
          background-color: #fef2f2;
          color: #ef4444;
        }

        .delete-btn:hover {
          background-color: #fecaca;
        }

        .close-btn {
          background-color: #f3f4f6;
          color: #6b7280;
        }

        .close-btn:hover {
          background-color: #e5e7eb;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .event-section {
          margin-bottom: 1.5rem;
        }

        .event-section:last-child {
          margin-bottom: 0;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .section-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }

        .section-content {
          padding-left: 1.5rem;
        }

        .date-time-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .date-info {
          color: #4b5563;
        }

        .all-day-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .description-text,
        .location-text,
        .recurrence-text {
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }

        .audience-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .audience-tag {
          padding: 0.25rem 0.75rem;
          background-color: #f3f4f6;
          color: #374151;
          border-radius: 9999px;
          font-size: 0.875rem;
        }

        .academic-info {
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .creator-text {
          color: #4b5563;
          margin: 0 0 0.25rem 0;
          font-weight: 500;
        }

        .created-date {
          color: #9ca3af;
          font-size: 0.875rem;
          margin: 0;
        }

        .delete-confirm-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .delete-confirm-modal {
          background: white;
          border-radius: 0.5rem;
          padding: 1.5rem;
          max-width: 400px;
          width: 90%;
        }

        .delete-confirm-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .delete-confirm-header h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .delete-confirm-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .btn-cancel {
          padding: 0.5rem 1rem;
          background-color: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover {
          background-color: #e5e7eb;
        }

        .btn-delete {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-delete:hover {
          background-color: #dc2626;
        }

        .btn-delete:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner-small {
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

        @media (max-width: 640px) {
          .modal-content {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .modal-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .modal-actions {
            margin-left: 0;
            justify-content: flex-end;
          }

          .event-badges {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
};

export default EventModal;