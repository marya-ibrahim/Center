// API Configuration
// Based on the backend from https://github.com/hamzaalmawla/Backend.git

const API_BASE_URL = 'http://localhost:5000/api'; // Update this with your backend URL

// API Service for making HTTP requests
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private getToken(): string | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token || null;
    }
    return null;
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(name: string, email: string, password: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  // Books endpoints
  async getBooks() {
    return this.request('/books');
  }

  async getBook(id: string) {
    return this.request(`/books/${id}`);
  }

  async createBook(bookData: any) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: string, bookData: any) {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: string) {
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  // Checkout endpoints
  async checkoutBook(bookId: string, userId: string) {
    return this.request('/checkout', {
      method: 'POST',
      body: JSON.stringify({ bookId, userId }),
    });
  }

  async returnBook(bookId: string) {
    return this.request('/return', {
      method: 'POST',
      body: JSON.stringify({ bookId }),
    });
  }

  // Members endpoints (admin only)
  async getMembers() {
    return this.request('/members');
  }

  async getMember(id: string) {
    return this.request(`/members/${id}`);
  }

  async updateMember(id: string, memberData: any) {
    return this.request(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteMember(id: string) {
    return this.request(`/members/${id}`, {
      method: 'DELETE',
    });
  }
}

export const api = new ApiService(API_BASE_URL);
