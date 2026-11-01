const configuredBackendUrl = import.meta.env.BACKEND_URL || 'http://localhost:5000';

// The backend mounts every HTTP route below /api. Normalize the configured
// value so both `https://host` and `https://host/api` work without producing
// either missing or duplicated `/api` segments.
const backendOrigin = configuredBackendUrl.trim().replace(/\/+$/, '');
const backendWithoutApiSuffix = backendOrigin.replace(/(?:\/api)+$/i, '');

export const API_URL = `${backendWithoutApiSuffix}/api`;
