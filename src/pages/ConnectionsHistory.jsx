import React, { useState } from 'react';
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
    Plug,
} from 'react-bootstrap-icons';
import BottomNavbar from "../components/layout/BottomNavbar";
import mockUsers from '../data/mockUsers';
import { Link } from 'react-router-dom';

// mockAllConnections provides sample data representing connections within the community.
// In a production environment, this data would typically be fetched from a backend service.
const mockAllConnections = [
    { id: 'c1', user1: 'Oren Levi', user2: 'Shira Cohen', date: '2023-01-15', type: 'Introduction' },
    { id: 'c2', user1: 'Dudu Golan', user2: 'Yossi Alon', date: '2023-03-20', type: 'Collaboration' },
    { id: 'c3', user1: 'Shira Cohen', user2: 'Yael David', date: '2023-07-01', type: 'Recommendation' },
    { id: 'c4', user1: 'Oren Levi', user2: 'Dudu Golan', date: '2023-02-10', type: 'Networking' },
    { id: 'c5', user1: 'Yael David', user2: 'Amit Geva', date: '2024-05-10', type: 'Mentorship' },
    { id: 'c6', user1: 'Noa Bar', user2: 'Chen Israeli', date: '2024-06-01', type: 'Introduction' },
    { id: 'c7', user1: 'Lior Katz', user2: 'Maya Levy', date: '2024-06-15', type: 'Collaboration' },
];

/**
 * ConnectionsHistory component displays an overview of community connections.
 * It features summary cards for members, connections, and requests,
 * along with a detailed table of all recorded connections.
 * This component is designed for a community manager's view.
 */
function ConnectionsHistory() {
    // `connections` holds the data for all community connections.
    const connections = mockAllConnections;
    // `users` is used here to provide a count for the "Members" card, leveraging existing mock data.
    const users = mockUsers;

    /**
     * handleExcelImportOnConnectionsPage is a placeholder function for handling Excel imports.
     * It's passed to the `BottomNavbar` but its specific implementation for this page is not defined here.
     * @param {Array} data - The data parsed from the Excel file.
     */
    const handleExcelImportOnConnectionsPage = (data) => {
        console.log("Excel data imported on Connections page (placeholder):", data);
    };

    return (
        // Main container for the page, ensuring it takes full viewport height and enables flex layout.
        <div className="d-flex flex-column vh-100">
            {/* Main content area, configured to grow and allow vertical scrolling. */}
            <Container
                fluid
                className="p-4 bg-light flex-grow-1 dashboard-main-content"
                style={{
                    overflowY: 'auto',
                }}
            >
                {/* Page title. */}
                <h2 className="mb-4 text-primary">Community Connections Overview</h2>

                {/* Row for displaying summary cards (Members, Connections, Requests). */}
                <Row className="g-4">
                    {/* Members Card: Links to the main dashboard. */}
                    <Col md={4}>
                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                            <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                                <Card.Body className="text-center">
                                    <Card.Title className="text-muted">
                                        <PersonCircle size={30} /> Members
                                    </Card.Title>
                                    <Card.Text className="display-4 fw-bold text-primary">
                                        {users.length} {/* Displays the total count of mock users. */}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    {/* Connections Card: Links to the current connections page. */}
                    <Col md={4}>
                        <Link to="/connections" style={{ textDecoration: 'none' }}>
                            <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                                <Card.Body className="text-center">
                                    <Card.Title className="text-muted">
                                        <Linkedin size={30} /> Connections
                                    </Card.Title>
                                    <Card.Text className="display-4 fw-bold text-success">
                                        {connections.length} {/* Displays the total count of mock connections. */}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    {/* Requests Card: Links to the requests page. */}
                    <Col md={4}>
                        <Link to="/requests" style={{ textDecoration: 'none' }}>
                            <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                                <Card.Body className="text-center">
                                    <Card.Title className="text-muted">
                                        <Envelope size={30} /> Requests
                                    </Card.Title>
                                    <Card.Text className="display-4 fw-bold text-warning">
                                        0 {/* Placeholder for requests count. */}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>

                {/* Card containing the main table of community connections. */}
                <Card className="mt-4 shadow-sm border-0 rounded-3">
                    <Card.Header className="bg-white d-flex justify-content-start align-items-center">
                        <h5 className="mb-0 d-flex align-items-center">
                            <Plug size={20} className="me-2" /> All Community Connections
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0" style={{ minHeight: '300px' }}>
                        {/* Conditionally renders the connections table if connections exist, otherwise an alert. */}
                        {connections.length > 0 ? (
                            <Table hover responsive className="mb-0 align-middle">
                                <thead className="table-light">
                                <tr>
                                    <th className="text-center">
                                        <div className="d-flex flex-column align-items-center">
                                            <PersonCircle size={20} />
                                            <span>User 1</span>
                                        </div>
                                    </th>
                                    <th className="text-center">
                                        <div className="d-flex flex-column align-items-center">
                                            <PersonCircle size={20} />
                                            <span>User 2</span>
                                        </div>
                                    </th>
                                    <th className="text-center">
                                        <div className="d-flex flex-column align-items-center">
                                            <Calendar3Fill size={20} />
                                            <span>Date</span>
                                        </div>
                                    </th>
                                    <th className="text-center">
                                        <div className="d-flex flex-column align-items-center">
                                            <Plug size={20} />
                                            <span>Type</span>
                                        </div>
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {/* Maps through the connections array to render each connection as a table row. */}
                                {connections.map(conn => (
                                    <tr key={conn.id} className="align-middle">
                                        <td className="text-center">{conn.user1}</td>
                                        <td className="text-center">{conn.user2}</td>
                                        <td className="text-center">{conn.date}</td>
                                        <td className="text-center">{conn.type}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </Table>
                        ) : (
                            // Displays an informational alert if no connections are found.
                            <Alert variant="info" className="text-center mb-0">
                                No connections found in the community yet.
                            </Alert>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Bottom navigation bar, providing consistent navigation and functionality across pages. */}
            <BottomNavbar onImport={handleExcelImportOnConnectionsPage} />
        </div>
    );
}

export default ConnectionsHistory;