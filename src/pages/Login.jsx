// Login.jsx
import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Linkedin as LinkedinIcon } from 'react-bootstrap-icons';
import { loginUser } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const errorMessage = params.get('error');
        const userIdFromUrl = params.get('userId');

        if (errorMessage) {
            setError(decodeURIComponent(errorMessage));
        }

        if (userIdFromUrl) {
            localStorage.setItem('currentUserId', userIdFromUrl);
            navigate('/user-dashboard');
            setSuccess('התחברת בהצלחה עם לינקדאין!');
        }

        if (errorMessage || userIdFromUrl) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('error');
            newUrl.searchParams.delete('userId');
            window.history.replaceState({}, document.title, newUrl.pathname);
        }
    }, [location.search, navigate]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        if (!email || !password) {
            setError('Please enter your email and password.');
            setLoading(false);
            return;
        }

        try {
            const authData = await loginUser({ email, password });
            login(authData.user);
            if (authData.token) {
                localStorage.setItem('userToken', authData.token);
            }
            if (authData.user && authData.user.id) {
                localStorage.setItem('currentUserId', authData.user.id);
            }
            navigate('/user-dashboard');
            setSuccess('התחברת בהצלחה!');
        } catch (err) {
            setError(err.response?.message || err.message || 'שגיאת התחברות.');
        } finally {
            setLoading(false);
        }
    };

    const handleLinkedInLogin = () => {
        setError(null);
        setSuccess(null);
        setLoading(true);
        window.location.href = 'http://localhost:5000/auth/linkedin';
    };

    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Title className="text-center mb-4">
                    <h3>התחברות</h3>
                </Card.Title>

                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {success && <Alert variant="success" className="text-center">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>אימייל</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="הזן אימייל"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicPassword">
                        <Form.Label>סיסמה</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="הזן סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading}
                    >
                        {loading && !error && !success ? 'מתחבר...' : 'התחבר'}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <small>אין לך חשבון? <a href="/register">להרשמה</a></small>
                </div>

                <hr className="my-4" />

                <Button
                    variant="info"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={handleLinkedInLogin}
                    disabled={loading}
                >
                    <LinkedinIcon size={20} className="me-2" /> התחבר עם לינקדאין
                </Button>
            </Card>
        </Container>
    );
}

export default Login;