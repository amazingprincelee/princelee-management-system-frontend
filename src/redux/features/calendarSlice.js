import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

// Async thunks for calendar operations
export const fetchEvents = createAsyncThunk(
  'calendar/fetchEvents',
  async (params = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== '') {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await axios.get(
        `${API_BASE_URL}/calendar/events?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch events'
      );
    }
  }
);

export const fetchEventsInRange = createAsyncThunk(
  'calendar/fetchEventsInRange',
  async ({ startDate, endDate, view = 'month' }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await axios.get(
        `${API_BASE_URL}/calendar/events/range`,
        {
          params: { startDate, endDate, view },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch events in range'
      );
    }
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  'calendar/fetchUpcomingEvents',
  async ({ limit = 10, days = 30 } = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await axios.get(
        `${API_BASE_URL}/calendar/events/upcoming`,
        {
          params: { limit, days },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch upcoming events'
      );
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'calendar/fetchEventById',
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await axios.get(
        `${API_BASE_URL}/calendar/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch event details'
      );
    }
  }
);

export const createEvent = createAsyncThunk(
  'calendar/createEvent',
  async (eventData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await axios.post(
        `${API_BASE_URL}/calendar/events`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create event'
      );
    }
  }
);

export const updateEvent = createAsyncThunk(
  'calendar/updateEvent',
  async ({ eventId, eventData }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const response = await axios.put(
        `${API_BASE_URL}/calendar/events/${eventId}`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update event'
      );
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'calendar/deleteEvent',
  async (eventId, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      await axios.delete(
        `${API_BASE_URL}/calendar/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return eventId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete event'
      );
    }
  }
);

export const fetchEventsByType = createAsyncThunk(
  'calendar/fetchEventsByType',
  async ({ type, academicSession, term, limit = 50 }, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const params = { limit };
      if (academicSession) params.academicSession = academicSession;
      if (term) params.term = term;
      
      const response = await axios.get(
        `${API_BASE_URL}/calendar/events/type/${type}`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch events by type'
      );
    }
  }
);

export const fetchCalendarStats = createAsyncThunk(
  'calendar/fetchCalendarStats',
  async ({ academicSession, term } = {}, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      
      const params = {};
      if (academicSession) params.academicSession = academicSession;
      if (term) params.term = term;
      
      const response = await axios.get(
        `${API_BASE_URL}/calendar/events/stats`,
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch calendar statistics'
      );
    }
  }
);

const initialState = {
  events: [],
  upcomingEvents: [],
  selectedEvent: null,
  eventsByDate: {},
  calendarStats: null,
  currentView: 'month',
  currentDate: new Date().toISOString(),
  selectedDate: null,
  filters: {
    eventType: '',
    academicSession: '',
    term: '',
    status: '',
    priority: '',
    search: ''
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  loading: {
    events: false,
    upcomingEvents: false,
    selectedEvent: false,
    creating: false,
    updating: false,
    deleting: false,
    stats: false
  },
  error: {
    events: null,
    upcomingEvents: null,
    selectedEvent: null,
    creating: null,
    updating: null,
    deleting: null,
    stats: null
  }
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    setCurrentDate: (state, action) => {
      state.currentDate = action.payload;
    },
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload;
    },
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
      state.error.selectedEvent = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading.events = true;
        state.error.events = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading.events = false;
        state.events = action.payload.data;
        state.pagination = action.payload.pagination || initialState.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading.events = false;
        state.error.events = action.payload;
      })
      
      // Fetch Events in Range
      .addCase(fetchEventsInRange.pending, (state) => {
        state.loading.events = true;
        state.error.events = null;
      })
      .addCase(fetchEventsInRange.fulfilled, (state, action) => {
        state.loading.events = false;
        state.events = action.payload.data.events;
        state.eventsByDate = action.payload.data.eventsByDate;
      })
      .addCase(fetchEventsInRange.rejected, (state, action) => {
        state.loading.events = false;
        state.error.events = action.payload;
      })
      
      // Fetch Upcoming Events
      .addCase(fetchUpcomingEvents.pending, (state) => {
        state.loading.upcomingEvents = true;
        state.error.upcomingEvents = null;
      })
      .addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
        state.loading.upcomingEvents = false;
        state.upcomingEvents = action.payload.data;
      })
      .addCase(fetchUpcomingEvents.rejected, (state, action) => {
        state.loading.upcomingEvents = false;
        state.error.upcomingEvents = action.payload;
      })
      
      // Fetch Event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading.selectedEvent = true;
        state.error.selectedEvent = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading.selectedEvent = false;
        state.selectedEvent = action.payload.data;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading.selectedEvent = false;
        state.error.selectedEvent = action.payload;
      })
      
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading.creating = true;
        state.error.creating = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.events.unshift(action.payload.data);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading.creating = false;
        state.error.creating = action.payload;
      })
      
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading.updating = true;
        state.error.updating = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading.updating = false;
        const updatedEvent = action.payload.data;
        const index = state.events.findIndex(event => event._id === updatedEvent._id);
        if (index !== -1) {
          state.events[index] = updatedEvent;
        }
        if (state.selectedEvent && state.selectedEvent._id === updatedEvent._id) {
          state.selectedEvent = updatedEvent;
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading.updating = false;
        state.error.updating = action.payload;
      })
      
      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading.deleting = true;
        state.error.deleting = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading.deleting = false;
        const eventId = action.payload;
        state.events = state.events.filter(event => event._id !== eventId);
        if (state.selectedEvent && state.selectedEvent._id === eventId) {
          state.selectedEvent = null;
        }
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading.deleting = false;
        state.error.deleting = action.payload;
      })
      
      // Fetch Events by Type
      .addCase(fetchEventsByType.fulfilled, (state, action) => {
        // This can be used for specific type filtering
        state.events = action.payload.data;
      })
      
      // Fetch Calendar Stats
      .addCase(fetchCalendarStats.pending, (state) => {
        state.loading.stats = true;
        state.error.stats = null;
      })
      .addCase(fetchCalendarStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.calendarStats = action.payload.data;
      })
      .addCase(fetchCalendarStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error.stats = action.payload;
      });
  }
});

export const {
  setCurrentView,
  setCurrentDate,
  setSelectedDate,
  setSelectedEvent,
  updateFilters,
  clearFilters,
  clearErrors,
  clearSelectedEvent
} = calendarSlice.actions;

export default calendarSlice.reducer;