import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { PersonCircle, Envelope, Linkedin } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

// UserDashboardCards component displays a set of summary cards for a user dashboard.
// It receives 'totalMembers' as a prop, representing the total number of community members.
function UserDashboardCards({ totalMembers }) {
    return (
        // Renders a Bootstrap Row component with a gutter (spacing) between columns
        // and a bottom margin for separation from other elements.
        <Row className="g-4 mb-4">
            {/* Column for the "Members" card. */}
            <Col md={4}>
                {/* A React Router Link component that makes the entire card clickable,
                    navigating to the "/user-dashboard" route.
                    Text decoration is removed for a cleaner card appearance. */}
                <Link to="/user-dashboard" style={{ textDecoration: 'none' }}>
                    {/* The Card component itself, styled for height, shadow, border,
                    background color, and rounded corners. */}
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3">
                        {/* The body of the card, with centered text. */}
                        <Card.Body className="text-center">
                            {/* Card title displaying "Members" with a PersonCircle icon. */}
                            <Card.Title className="text-muted">
                                <PersonCircle size={30} />Members
                            </Card.Title>
                            {/* The main text displaying the total number of members.
                            Styled as a large, bold, primary-colored number. */}
                            <Card.Text className="display-4 fw-bold text-primary">
                                {totalMembers}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>

            {/* Column for the "My Connections" card. */}
            <Col md={4}>
                {/* Link component making the "My Connections" card clickable,
                    navigating to the "/connections" route. */}
                <Link to="/connections" style={{ textDecoration: 'none' }}>
                    {/* Card component with similar styling, marked as clickable. */}
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        <Card.Body className="text-center">
                            {/* Card title displaying "My Connections" with a Linkedin icon. */}
                            <Card.Title className="text-muted">
                                <Linkedin size={30} /> My Connections
                            </Card.Title>
                            {/* Hardcoded number '3' for "My Connections", styled as success text. */}
                            <Card.Text className="display-4 fw-bold text-success">3</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>

            {/* Column for the "My Requests" card. */}
            <Col md={4}>
                {/* Link component making the "My Requests" card clickable,
                    navigating to the "/requests" route. */}
                <Link to="/requests" style={{ textDecoration: 'none' }}>
                    {/* Card component with similar styling, marked as clickable. */}
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        <Card.Body className="text-center">
                            {/* Card title displaying "My Requests" with an Envelope icon. */}
                            <Card.Title className="text-muted">
                                <Envelope size={30} /> My Requests
                            </Card.Title>
                            {/* Hardcoded number '0' for "My Requests", styled as warning text. */}
                            <Card.Text className="display-4 fw-bold text-warning">0</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        </Row>
    );
}

export default UserDashboardCards;