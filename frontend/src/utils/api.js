const API_BASE_URL = "http://localhost:8001/api/v1";


const getToken = () => localStorage.getItem("token");



export const registerUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Registration failed");
  }
  
  return response.json();
};

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Login failed");
  }
  
  return response.json();
};



export const getAllEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/events/`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }
  
  return response.json();
};

export const createEvent = async (title, description, date, capacity) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/events/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, date, capacity }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to create event");
  }
  
  return response.json();
};

export const updateEvent = async (eventId, title, description, date, capacity) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, date, capacity }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to update event");
  }
  
  return response.json();
};

export const deleteEvent = async (eventId) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to delete event");
  }
};



export const joinEvent = async (eventId) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/join`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to join event");
  }
  
  return response.json();
};

export const leaveEvent = async (eventId) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}/events/${eventId}/leave`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "Failed to leave event");
  }
  
  return response.json();
};