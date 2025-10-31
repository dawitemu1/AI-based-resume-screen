import axios from 'axios'

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: '/api', // Use the proxy path
  timeout: 10000,
})

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear local storage and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Add a helper method for login that sends form data
api.postForm = async function(url, data) {
  const formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  return this.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export default api