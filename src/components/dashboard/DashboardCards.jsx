import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { PersonCircle, Envelope, Linkedin } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

function DashboardCards({ totalMembers }) {
    return (
        <Row className="g-4">
            <Col md={4}>
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        <Card.Body className="text-center">
                            <Card.Title className="text-muted">
                                <PersonCircle size={30} /> Members
                            </Card.Title>
                            <Card.Text className="display-4 fw-bold text-primary">
                                {totalMembers}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
            <Col md={4}>
                <Link to="/connections" style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        <Card.Body className="text-center">
                            <Card.Title className="text-muted">
                                <Linkedin size={30} /> Connections
                            </Card.Title>
                            <Card.Text className="display-4 fw-bold text-success">3</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
            <Col md={4}>
                <Link to="/requests" style={{ textDecoration: 'none' }}>
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        <Card.Body className="text-center">
                            <Card.Title className="text-muted">
                                <Envelope size={30} /> Requests
                            </Card.Title>
                            <Card.Text className="display-4 fw-bold text-warning">0</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        </Row>
    );
}

export default DashboardCards;