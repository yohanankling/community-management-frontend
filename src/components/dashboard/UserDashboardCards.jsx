// src/components/UserDashboardCards.jsx
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { PersonCircle, Envelope, Linkedin } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom'; // ייבא את Link

function UserDashboardCards({ totalMembers }) {
    return (
        <Row className="g-4 mb-4">
            <Col md={4}>
                <Link to="/user-dashboard" style={{ textDecoration: 'none' }}>
                <Card className="h-100 shadow-sm border-0 bg-white rounded-3">
                    <Card.Body className="text-center">
                        <Card.Title className="text-muted">
                            <PersonCircle size={30} />Members
                        </Card.Title>
                        <Card.Text className="display-4 fw-bold text-primary">
                            {totalMembers}
                        </Card.Text>
                    </Card.Body>
                </Card>
                </Link>
            </Col>

            {/* כרטיס "My Connections" */}
            <Col md={4}>
                {/* לחיץ - מקשר ל-`/connections` */}
                <Link to="/connections" style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        <Card.Body className="text-center">
                            <Card.Title className="text-muted">
                                <Linkedin size={30} /> My Connections
                            </Card.Title>
                            <Card.Text className="display-4 fw-bold text-success">3</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>

            {/* כרטיס "My Requests" */}
            <Col md={4}>
                {/* לחיץ - מקשר ל-`/requests` */}
                <Link to="/requests" style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        <Card.Body className="text-center">
                            <Card.Title className="text-muted">
                                <Envelope size={30} /> My Requests
                            </Card.Title>
                            <Card.Text className="display-4 fw-bold text-warning">0</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        </Row>
    );
}

export default UserDashboardCards;