import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { UserDashboard } from './components/user/UserDashboard';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  token?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publishYear: number;
  status: 'available' | 'checked-out';
  borrowedBy?: string;
  dueDate?: string;
  coverImage?: string;
  description?: string;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setCurrentPage('dashboard');
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    // In a real app, this would call your backend API
    // For now, we'll simulate it
    // Admin: admin@center.com / admin123
    // User: user@center.com / user123
    
    if (email === 'admin@center.com' && password === 'admin123') {
      const user: User = {
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin',
        token: 'admin-token-123'
      };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentPage('dashboard');
      return true;
    } else if (email === 'user@center.com' && password === 'user123') {
      const user: User = {
        id: '2',
        name: 'Regular User',
        email: email,
        role: 'user',
        token: 'user-token-456'
      };
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentPage('dashboard');
      return true;
    }
    return false;
  };

  const handleSignup = (name: string, email: string, password: string) => {
    // In a real app, this would call your backend API
    const user: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      role: 'user', // New signups are regular users by default
      token: 'new-user-token-' + Date.now()
    };
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentPage('dashboard');
    return true;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentPage('login');
  };

  if (currentPage === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onSwitchToSignup={() => setCurrentPage('signup')}
      />
    );
  }

  if (currentPage === 'signup') {
    return (
      <SignupPage
        onSignup={handleSignup}
        onSwitchToLogin={() => setCurrentPage('login')}
      />
    );
  }

  if (currentPage === 'dashboard' && currentUser) {
    if (currentUser.role === 'admin') {
      return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
    } else {
      return <UserDashboard user={currentUser} onLogout={handleLogout} />;
    }
  }

  return null;
}
