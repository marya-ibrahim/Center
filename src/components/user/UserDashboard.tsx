import { useState } from 'react';
import { Container, Navbar, Nav, Dropdown } from 'react-bootstrap';
import { User } from '../../App';
import { Logo } from '../Logo';
import { UserBooksPage } from './UserBooksPage';
import { UserHomePage } from './UserHomePage';
import { UserAboutPage } from './UserAboutPage';

interface UserDashboardProps {
  user: User;
  onLogout: () => void;
}

export function UserDashboard({ user, onLogout }: UserDashboardProps) {
  const [activePage, setActivePage] = useState<'home' | 'books' | 'about'>('home');

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* User Navigation */}
      <Navbar bg="white" expand="lg" className="shadow-sm" style={{ borderBottom: '1px solid #dee2e6' }}>
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => setActivePage('home')}>
            <Logo size={45} />
            <span style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2b6cb0' }}>
              Center
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="user-navbar-nav" />
          <Navbar.Collapse id="user-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link 
                active={activePage === 'home'}
                onClick={() => setActivePage('home')}
                style={{ fontWeight: activePage === 'home' ? '600' : '400' }}
              >
                Home
              </Nav.Link>
              <Nav.Link 
                active={activePage === 'books'}
                onClick={() => setActivePage('books')}
                style={{ fontWeight: activePage === 'books' ? '600' : '400' }}
              >
                Books
              </Nav.Link>
              <Nav.Link 
                active={activePage === 'about'}
                onClick={() => setActivePage('about')}
                style={{ fontWeight: activePage === 'about' ? '600' : '400' }}
              >
                About Us
              </Nav.Link>
            </Nav>
            <Dropdown align="end">
              <Dropdown.Toggle variant="outline-primary" id="dropdown-user">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ verticalAlign: 'middle' }}>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {user.name}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item disabled>
                  <small className="text-muted">{user.email}</small>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={onLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content */}
      {activePage === 'home' && <UserHomePage onNavigate={setActivePage} />}
      {activePage === 'books' && <UserBooksPage user={user} />}
      {activePage === 'about' && <UserAboutPage />}
    </div>
  );
}
