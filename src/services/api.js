// API service for backend communication
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.fallbackMode = false;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      
      // Fallback to localStorage for development
      if (error.message.includes('fetch') || error.message.includes('NetworkError')) {
        console.warn('Backend not available, using localStorage fallback');
        return this.handleFallback(endpoint, options);
      }
      
      throw error;
    }
  }

  // Fallback methods using localStorage
  handleFallback(endpoint, options) {
    const method = options.method || 'GET';
    
    if (endpoint === '/auth/login' && method === 'POST') {
      return this.fallbackLogin(JSON.parse(options.body));
    }
    
    if (endpoint === '/auth/signup' && method === 'POST') {
      return this.fallbackSignup(JSON.parse(options.body));
    }
    
    if (endpoint === '/auth/me' && method === 'GET') {
      return this.fallbackGetUser();
    }
    
    throw new Error('Backend server not available. Please start the backend server.');
  }

  fallbackLogin({ email, password }) {
    const users = JSON.parse(localStorage.getItem('fallback_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    const token = 'fallback_token_' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('fallback_current_user', JSON.stringify(user));
    
    return {
      message: 'Login successful',
      token,
      user: { ...user, password: undefined }
    };
  }

  fallbackSignup({ name, email, password }) {
    const users = JSON.parse(localStorage.getItem('fallback_users') || '[]');
    
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists with this email');
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password, // In real app, this would be hashed
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('fallback_users', JSON.stringify(users));
    
    const token = 'fallback_token_' + Date.now();
    localStorage.setItem('authToken', token);
    localStorage.setItem('fallback_current_user', JSON.stringify(newUser));
    
    return {
      message: 'Account created successfully',
      token,
      user: { ...newUser, password: undefined }
    };
  }

  fallbackGetUser() {
    const user = JSON.parse(localStorage.getItem('fallback_current_user') || 'null');
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user, password: undefined };
  }

  // Auth endpoints
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Fallback logout
      localStorage.removeItem('authToken');
      localStorage.removeItem('fallback_current_user');
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // User profile endpoints
  async updateProfile(userData) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async saveRiskAssessment(assessmentData) {
    return this.request('/user/risk-assessment', {
      method: 'POST',
      body: JSON.stringify(assessmentData),
    });
  }

  async getScreeningHistory() {
    return this.request('/user/screening-history');
  }

  async saveScreeningResult(resultData) {
    return this.request('/user/screening-result', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  }
}

export default new ApiService();