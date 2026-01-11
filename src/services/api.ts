// API Configuration
// Backend API - Update this URL to match your deployed backend
const API_BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface SignupResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
  };
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCoverImage?: string;
  userId: string;
  userName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  fine?: number;
  status: 'borrowed' | 'returned' | 'overdue';
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishYear: number;
  coverImage?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
}

// API Service for making HTTP requests
class ApiService {
  private baseUrl: string;
  private useMockData: boolean = false;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    const user = localStorage.getItem('currentUser');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.token || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const errorMessage = typeof data === 'object' && data.message 
          ? data.message 
          : typeof data === 'string' 
            ? data 
            : `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data;
    } catch (error: any) {
      // Check if it's a network error
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        this.useMockData = true;
        throw new Error('Backend connection failed. Using demo mode.');
      }
      throw error;
    }
  }

  isConfigured(): boolean {
    return !this.useMockData;
  }

  // ============= Authentication APIs =============
  
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      this.useMockData = false;
      return response;
    } catch (error: any) {
      // Fallback to mock login
      if (email === 'admin@center.com' && password === 'admin123') {
        return {
          token: 'mock-admin-token-' + Date.now(),
          user: {
            id: '1',
            name: 'Admin User',
            email: email,
            role: 'admin'
          }
        };
      } else if (email === 'user@center.com' && password === 'user123') {
        return {
          token: 'mock-user-token-' + Date.now(),
          user: {
            id: '2',
            name: 'Demo User',
            email: email,
            role: 'user'
          }
        };
      } else {
        throw new Error('Invalid email or password');
      }
    }
  }

  async signup(name: string, email: string, password: string): Promise<SignupResponse> {
    try {
      const response = await this.fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      
      this.useMockData = false;
      return response;
    } catch (error: any) {
      // Fallback to mock signup
      return {
        token: 'mock-new-user-token-' + Date.now(),
        user: {
          id: Date.now().toString(),
          name: name,
          email: email,
          role: 'user'
        }
      };
    }
  }

  // ============= Books APIs =============
  
  async getBooks() {
    return this.fetchWithAuth('/books', {
      method: 'GET',
    });
  }

  async getBook(id: string) {
    return this.fetchWithAuth(`/books/${id}`, {
      method: 'GET',
    });
  }

  async createBook(bookData: {
    title: string;
    author: string;
    isbn: string;
    category: string;
    publishYear: number;
    coverImage?: string;
    description?: string;
    totalCopies?: number;
  }) {
    return this.fetchWithAuth('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  async updateBook(id: string, bookData: {
    title?: string;
    author?: string;
    isbn?: string;
    category?: string;
    publishYear?: number;
    coverImage?: string;
    description?: string;
    totalCopies?: number;
  }) {
    return this.fetchWithAuth(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    });
  }

  async deleteBook(id: string) {
    return this.fetchWithAuth(`/books/${id}`, {
      method: 'DELETE',
    });
  }

  // ============= Borrow/Return APIs =============
  
  async borrowBook(bookId: string, userId: string) {
    return this.fetchWithAuth('/borrow', {
      method: 'POST',
      body: JSON.stringify({ 
        bookId, 
        userId,
        borrowDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days from now
      }),
    });
  }

  async returnBook(borrowId: string) {
    return this.fetchWithAuth(`/return/${borrowId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        returnDate: new Date().toISOString()
      }),
    });
  }

  async getMyBorrowedBooks(userId: string) {
    return this.fetchWithAuth(`/users/${userId}/borrowed`, {
      method: 'GET',
    });
  }

  async getCurrentBorrows(userId: string) {
    return this.fetchWithAuth(`/users/${userId}/current-borrows`, {
      method: 'GET',
    });
  }

  async getBorrowHistory(userId: string) {
    return this.fetchWithAuth(`/users/${userId}/borrow-history`, {
      method: 'GET',
    });
  }

  async getAllBorrowHistory() {
    return this.fetchWithAuth('/borrows/history', {
      method: 'GET',
    });
  }

  async getAllCurrentBorrows() {
    return this.fetchWithAuth('/borrows/current', {
      method: 'GET',
    });
  }

  async adminReturnBook(borrowId: string) {
    return this.fetchWithAuth(`/borrows/${borrowId}/return`, {
      method: 'POST',
      body: JSON.stringify({ 
        returnDate: new Date().toISOString()
      }),
    });
  }

  async calculateFine(borrowId: string) {
    return this.fetchWithAuth(`/borrows/${borrowId}/fine`, {
      method: 'GET',
    });
  }

  async payFine(borrowId: string) {
    return this.fetchWithAuth(`/borrows/${borrowId}/pay-fine`, {
      method: 'POST',
    });
  }

  // ============= Members APIs (Admin Only) =============
  
  async getMembers() {
    return this.fetchWithAuth('/users', {
      method: 'GET',
    });
  }

  async getMember(id: string) {
    return this.fetchWithAuth(`/users/${id}`, {
      method: 'GET',
    });
  }

  async updateMember(id: string, memberData: {
    name?: string;
    email?: string;
    status?: string;
  }) {
    return this.fetchWithAuth(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  }

  async deleteMember(id: string) {
    return this.fetchWithAuth(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // ============= Statistics APIs (Admin) =============
  
  async getStatistics() {
    return this.fetchWithAuth('/stats', {
      method: 'GET',
    });
  }

  async getDashboardData() {
    return this.fetchWithAuth('/dashboard', {
      method: 'GET',
    });
  }

  // ============= Search & Filter APIs =============
  
  async searchBooks(query: string) {
    return this.fetchWithAuth(`/books/search?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  }

  async getBooksByCategory(category: string) {
    return this.fetchWithAuth(`/books/category/${encodeURIComponent(category)}`, {
      method: 'GET',
    });
  }

  async getAvailableBooks() {
    return this.fetchWithAuth('/books/available', {
      method: 'GET',
    });
  }

  // ============= User Profile APIs =============
  
  async getUserProfile() {
    return this.fetchWithAuth('/auth/profile', {
      method: 'GET',
    });
  }

  async updateUserProfile(userData: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) {
    return this.fetchWithAuth('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.fetchWithAuth('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }
}

export const api = new ApiService(API_BASE_URL);