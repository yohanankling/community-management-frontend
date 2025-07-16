import React, { useState, useEffect } from 'react'; // ייבוא useState ו-useEffect
import { Card, Col, Row } from 'react-bootstrap';
import { PersonCircle, Envelope, Linkedin } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../services/authService'; // ייבוא שירות ה-API

function DashboardCards() { // הסרנו את totalMembers מ-props, כי נשלוף אותו כאן
    const [totalMembers, setTotalMembers] = useState(0); // מצב פנימי לכמות החברים
    const [loading, setLoading] = useState(true); // מצב לטעינה
    const [error, setError] = useState(null);   // מצב לשגיאות

    useEffect(() => {
        const getMembersCount = async () => {
            try {
                const data = await getAllUsers(); // קריאה ל-API ישירות מכאן
                if (data.success) {
                    setTotalMembers(data.count); // עדכון המצב
                } else {
                    setError(data.message || 'Failed to fetch users count.');
                }
            } catch (err) {
                console.error("Failed to fetch members count:", err);
                setError(err.message || "Error fetching members count. Please try again later.");
            } finally {
                setLoading(false); // סיום טעינה
            }
        };

        getMembersCount();
    }, []); // ריצה רק פעם אחת בטעינת הקומפוננטה

    // הצגת מצבי טעינה/שגיאה בתוך הכרטיס עצמו
    let membersContent;
    if (loading) {
        membersContent = "Loading...";
    } else if (error) {
        membersContent = "Error"; // אפשר גם להציג אייקון שגיאה קטן
    } else {
        membersContent = totalMembers;
    }

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
                                {membersContent} {/* שימוש בערך הנסחף */}
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