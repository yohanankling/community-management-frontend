import React, {useState} from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Badge,
    Alert,
    Button
} from 'react-bootstrap';
import {
    PersonCircle,
    Envelope,
    Calendar3Fill,
    Linkedin,
    Plug, // Added for connections table
} from 'react-bootstrap-icons';
// Assuming BottomNavbar and mockUsers are in the correct relative paths
import BottomNavbar from "../components/layout/BottomNavbar";
import mockUsers from '../data/mockUsers';
import {Link} from 'react-router-dom'; // Import Link for navigation

// Mock Data for all connections (example for community manager view)
const mockAllConnections = [
    {id: 'c1', user1: 'Oren Levi', user2: 'Shira Cohen', date: '2023-01-15', type: 'Introduction'},
    {id: 'c2', user1: 'Dudu Golan', user2: 'Yossi Alon', date: '2023-03-20', type: 'Collaboration'},
    {id: 'c3', user1: 'Shira Cohen', user2: 'Yael David', date: '2023-07-01', type: 'Recommendation'},
    {id: 'c4', user1: 'Oren Levi', user2: 'Dudu Golan', date: '2023-02-10', type: 'Networking'},
    {id: 'c5', user1: 'Yael David', user2: 'Amit Geva', date: '2024-05-10', type: 'Mentorship'},
    {id: 'c6', user1: 'Noa Bar', user2: 'Chen Israeli', date: '2024-06-01', type: 'Introduction'},
    {id: 'c7', user1: 'Lior Katz', user2: 'Maya Levy', date: '2024-06-15', type: 'Collaboration'},
];

function ConnectionsHistory() {
    const connections = mockAllConnections;
    const users = mockUsers; // Assuming you use mockUsers for the member count for consistency

    // Placeholder for onImport functionality for BottomNavbar, even if not used on this page
    const handleExcelImportOnConnectionsPage = (data) => {
        console.log("Excel data imported on Connections page (placeholder):", data);
        // You might want to do something with this data or ignore it on this page.
    };

    return (
        <div className="d-flex flex-column vh-100"> {/* Full height container */}
            <Container
                fluid
                className="p-4 bg-light flex-grow-1 dashboard-main-content"
                style={{
                    overflowY: 'auto',
                }}
            >
                {/* Main Dashboard Title (can be adjusted for this page) */}
                <h2 className="mb-4 text-primary">Community Connections Overview</h2>

                {/* Top Cards - Now wrapped with Link components */}
                <Row className="g-4">
                    <Col md={4}>
                        {/* Members Card - Links to Dashboard */}
                        <Link to="/dashboard" style={{textDecoration: 'none'}}>
                            <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                                <Card.Body className="text-center">
                                    <Card.Title className="text-muted">
                                        <PersonCircle size={30}/> Members
                                    </Card.Title>
                                    <Card.Text className="display-4 fw-bold text-primary">
                                        {users.length} {/* Using mockUsers count for consistency */}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    <Col md={4}>
                        {/* Connections Card - Links to Connections page (current page) */}
                        <Link to="/connections" style={{textDecoration: 'none'}}>
                            <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                                <Card.Body className="text-center">
                                    <Card.Title className="text-muted">
                                        <Linkedin size={30}/> Connections
                                    </Card.Title>
                                    <Card.Text className="display-4 fw-bold text-success">
                                        {connections.length} {/* Now reflects actual connections count */}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    <Col md={4}>
                        {/* Requests Card - Links to Requests page */}
                        <Link to="/requests" style={{textDecoration: 'none'}}>
                            <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                                <Card.Body className="text-center">
                                    <Card.Title className="text-muted">
                                        <Envelope size={30}/> Requests
                                    </Card.Title>
                                    {/* Placeholder for requests count */}
                                    <Card.Text className="display-4 fw-bold text-warning">
                                        0
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>

                {/* Main Table Card - Now showing Connections instead of Users */}
                <Card className="mt-4 shadow-sm border-0 rounded-3">
                    {/* Centering the Card Header content */}
                    <Card.Header className="bg-white d-flex justify-content-start align-items-center">
                        <h5 className="mb-0 d-flex align-items-center"> {/* Removed text-center from h5 */}
                            <Plug size={20} className="me-2"/> All Community Connections
                        </h5>
                        {/* Optional: Add a button here if needed, consistent with Dashboard style */}
                        {/* <Button variant="outline-primary" size="sm">
        Export
    </Button> */}
                    </Card.Header>
                    <Card.Body className="p-0"
                               style={{minHeight: '300px'}}
                    >
                        {connections.length > 0 ? (
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="table-light">
                                <tr>
                                    {/* Each th content is already centered using d-flex and align-items-center */}
                                    <th className="text-center">
                                        <div className="d-flex flex-column align-items-center">
                                            <PersonCircle size={20}/>
                                            <span>User 1</span>
                                        </div>
                                    </th>
                                    <th className="text-center">
                                        <div className="d-flex flex-column align-items-center">
                                            <PersonCircle size={20}/>
                                            <span>User 2</span>
                                        </div>
                                    </th>
                                    <th className="text-center">
                                        <div className="d-flex flex-column align-items-center">
                                            <Calendar3Fill size={20}/>
                                            <span>Date</span>
                                        </div>
                                    </th>
                                    <th className="text-center">
                                        <div className="d-flex flex-column align-items-center">
                                            <Plug size={20}/>
                                            <span>Type</span>
                                        </div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {connections.map(conn => (
                                    <tr key={conn.id} className="align-middle">
                                        {/* Centering table data cells */}
                                        <td className="text-center">{conn.user1}</td>
                                        <td className="text-center">{conn.user2}</td>
                                        <td className="text-center">{conn.date}</td>
                                        <td className="text-center">{conn.type}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        ) : (
                            <Alert variant="info" className="text-center mb-0">
                                No connections found in the community yet.
                            </Alert>
                        )}
                    </Card.Body>
                </Card>

            </Container>

            {/* Bottom Navbar - Identical to Dashboard */}
            <BottomNavbar onImport={handleExcelImportOnConnectionsPage}/>
        </div>
    );
}

export default ConnectionsHistory;