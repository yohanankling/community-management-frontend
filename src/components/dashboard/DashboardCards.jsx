import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { PersonCircle, Envelope, Linkedin } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../services/authService';

function DashboardCards() {
    // Initializes state variables for the total number of members,
    // a loading indicator, and an error message.
    const [totalMembers, setTotalMembers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Effect hook to fetch the total members count when the component mounts.
    // It runs only once due to the empty dependency array `[]`.
    useEffect(() => {
        // Defines an asynchronous function to retrieve the count of all users.
        const getMembersCount = async () => {
            try {
                // Calls the `getAllUsers` service to fetch user data.
                const data = await getAllUsers();
                // Checks if the API call was successful.
                if (data.success) {
                    // Updates the 'totalMembers' state with the fetched count.
                    setTotalMembers(data.count);
                } else {
                    // Sets an error message if the API call was not successful.
                    setError(data.message || 'Failed to fetch users count.');
                }
            } catch (err) {
                // Logs and sets an error message if an exception occurs during the fetch.
                console.error("Failed to fetch members count:", err);
                setError(err.message || "Error fetching members count. Please try again later.");
            } finally {
                // Sets loading to false regardless of success or failure.
                setLoading(false);
            }
        };

        // Calls the function to fetch members count.
        getMembersCount();
    }, []);

    // Determines the content to display for the "Members" card based on loading and error states.
    let membersContent;
    if (loading) {
        membersContent = "Loading...";
    } else if (error) {
        membersContent = "Error";
    } else {
        membersContent = totalMembers;
    }

    return (
        // Renders a row of cards using Bootstrap's Row and Col components.
        // 'g-4' adds a gutter (spacing) between columns.
        <Row className="g-4">
            {/* Column for the "Members" card. */}
            <Col md={4}>
                {/* Link to the dashboard page. */}
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                    {/* Card component for displaying member count. */}
                    {/* It includes styling for shadow, border, background, and responsiveness. */}
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        {/* Card body containing the title and the member count. */}
                        <Card.Body className="text-center">
                            {/* Card title with a "PersonCircle" icon and "Members" text. */}
                            <Card.Title className="text-muted">
                                <PersonCircle size={30} /> Members
                            </Card.Title>
                            {/* Displays the member count, styled as a large, bold primary text. */}
                            {/* Currently hardcoded to 5, but could be dynamic with `membersContent`. */}
                            <Card.Text className="display-4 fw-bold text-primary">
                                {5}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
            {/* Column for the "Connections" card. */}
            <Col md={4}>
                {/* Link to the connections page. */}
                <Link to="/connections" style={{ textDecoration: 'none' }}>
                    {/* Card component for displaying connections count. */}
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        {/* Card body containing the title and the connections count. */}
                        <Card.Body className="text-center">
                            {/* Card title with a "Linkedin" icon and "Connections" text. */}
                            <Card.Title className="text-muted">
                                <Linkedin size={30} /> Connections
                            </Card.Title>
                            {/* Displays the connections count, hardcoded to 5, styled as a large, bold success text. */}
                            <Card.Text className="display-4 fw-bold text-success">5</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
            {/* Column for the "Requests" card. */}
            <Col md={4}>
                {/* Link to the requests page. */}
                <Link to="/requests" style={{ textDecoration: 'none' }}>
                    {/* Card component for displaying requests count. */}
                    <Card className="h-100 shadow-sm border-0 bg-white rounded-3 clickable-card">
                        {/* Card body containing the title and the requests count. */}
                        <Card.Body className="text-center">
                            {/* Card title with an "Envelope" icon and "Requests" text. */}
                            <Card.Title className="text-muted">
                                <Envelope size={30} /> Requests
                            </Card.Title>
                            {/* Displays the requests count, hardcoded to 4, styled as a large, bold warning text. */}
                            <Card.Text className="display-4 fw-bold text-warning">4</Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
        </Row>
    );
}

export default DashboardCards;