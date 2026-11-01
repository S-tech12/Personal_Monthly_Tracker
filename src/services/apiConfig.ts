const configuredApiUrl = import.meta.env.BACKEND_URL || 'http://localhost:5000/api';

export const API_URL = configuredApiUrl.replace(/\/$/, '');
