const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const getAccessToken = () => {
  const directToken = localStorage.getItem('UNIFY_access_token');
  if (directToken) return directToken;
  try {
    const user = JSON.parse(localStorage.getItem('UNIFY_current_user') || '{}');
    return user?.token || null;
  } catch {
    return null;
  }
};

const request = async (path, options = {}) => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
      console.warn(`[UNIFY API] ${path} responded with ${response.status}:`, errorBody.error);
      return null;
    }

    const body = await response.json();
    return body.data;
  } catch (err) {
    console.info(`[UNIFY API] Network or service offline for ${path}. Operating in resilient local mode.`);
    return null;
  }
};

export const complaintApi = {
  listMine: () => request('/complaints/mine'),
  listCampus: (campusId) => request(`/complaints/campuses/${campusId}`),
  create: (payload) => request('/complaints', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  transition: (complaintId, status, note) => request(`/complaints/${complaintId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status, note })
  })
};

/**
 * 4-Stage Notification System Client
 * 1. Push Dispatch (Incoming via Supabase/FCM)
 * 2. Acknowledge (Receipt Handshake)
 * 3. Action (Execution)
 * 4. Verification (Audit & Confirmation)
 */
export const notificationApi = {
  list: () => request('/notifications'),
  unreadCount: () => request('/notifications/unread-count'),
  markRead: (notificationId) => request(`/notifications/${notificationId}/read`, { method: 'PATCH' }),
  acknowledge: (notificationId, metadata = {}) => request(`/notifications/${notificationId}/acknowledge`, {
    method: 'PATCH',
    body: JSON.stringify({ metadata, acknowledgedAt: new Date().toISOString() })
  }),
  takeAction: (notificationId, actionPayload) => request(`/notifications/${notificationId}/action`, {
    method: 'POST',
    body: JSON.stringify(actionPayload)
  }),
  verify: (notificationId, verificationProof) => request(`/notifications/${notificationId}/verify`, {
    method: 'POST',
    body: JSON.stringify(verificationProof)
  })
};
