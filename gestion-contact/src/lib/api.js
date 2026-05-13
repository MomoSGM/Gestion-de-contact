const BASE_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = localStorage.getItem('token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export const api = {
  get: (url) => fetch(`${BASE_URL}${url}`, { headers: getHeaders() }).then(res => res.json()),
  post: (url, body) => fetch(`${BASE_URL}${url}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(body)
  }).then(res => res.json()),
  put: (url, body) => fetch(`${BASE_URL}${url}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(body)
  }).then(res => res.json()),
  delete: (url) => fetch(`${BASE_URL}${url}`, {
    method: 'DELETE',
    headers: getHeaders()
  })
};
