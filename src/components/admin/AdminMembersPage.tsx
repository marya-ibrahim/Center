import { useState } from 'react';
import { Container, Row, Col, Card, Form, InputGroup, Button, Table, Badge } from 'react-bootstrap';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  booksCheckedOut: number;
  status: 'active' | 'inactive';
}

const initialMembers: Member[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '555-0101',
    memberSince: '2024-01-15',
    booksCheckedOut: 0,
    status: 'active'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '555-0102',
    memberSince: '2024-03-22',
    booksCheckedOut: 0,
    status: 'active'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'mbrown@email.com',
    phone: '555-0103',
    memberSince: '2025-06-10',
    booksCheckedOut: 0,
    status: 'active'
  }
];

export function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.phone.includes(searchQuery)
  );

  const handleToggleStatus = (memberId: string) => {
    setMembers(members.map(member => 
      member.id === memberId 
        ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
        : member
    ));
  };

  const handleDeleteMember = (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      setMembers(members.filter(member => member.id !== memberId));
    }
  };

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Manage Members</h2>
          <p className="text-muted mb-0">{members.length} registered members</p>
        </div>
      </div>

      {/* Search */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <InputGroup>
            <InputGroup.Text>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </InputGroup.Text>
            <Form.Control
              placeholder="Search members by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Card.Body>
      </Card>

      {/* Members Table */}
      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead style={{ backgroundColor: '#f8f9fa' }}>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Member Since</th>
                  <th>Books Out</th>
                  <th>Status</th>
                  <th style={{ width: '200px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map(member => (
                  <tr key={member.id}>
                    <td className="align-middle">
                      <strong>{member.name}</strong>
                    </td>
                    <td className="align-middle">{member.email}</td>
                    <td className="align-middle">{member.phone}</td>
                    <td className="align-middle">{member.memberSince}</td>
                    <td className="align-middle">
                      <Badge bg={member.booksCheckedOut > 0 ? 'primary' : 'secondary'}>
                        {member.booksCheckedOut}
                      </Badge>
                    </td>
                    <td className="align-middle">
                      <Badge bg={member.status === 'active' ? 'success' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </td>
                    <td className="align-middle">
                      <div className="d-flex gap-2">
                        <Button
                          variant={member.status === 'active' ? 'outline-warning' : 'outline-success'}
                          size="sm"
                          onClick={() => handleToggleStatus(member.id)}
                        >
                          {member.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-5 text-muted">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-3">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <p>No members found</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}
