import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Linkedin as LinkedinIcon } from 'react-bootstrap-icons';
import { loginUser } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

function Login() {
    const navigate = useNavigate();
    const { login } = useUser();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
            const response = await loginUser({ email, password });
            console.log('Login successful:', response);

            if (response && response.user) {
                login(response.user);
                console.log('User ID saved to context:', response.user.id);
            } else {
                console.warn('Login response did not contain user data.');
                setError('Login successful, but user data not found in response.');
            }

            let pathToGo;
            if (email === 'ADMIN@ADMIN.COM' || email === 'admin@admin.com') {
                pathToGo = '/dashboard';
            } else {
                pathToGo = '/user-dashboard';
            }

            setSuccess('התחברות בוצעה בהצלחה! ממתין לניתוב...');

            setTimeout(() => {
                navigate(pathToGo);
            }, 100);

        } catch (err) {
            setError(err.message || 'An unexpected error occurred during login.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkedInLogin = () => {
        window.location.href = 'http://localhost:5000/auth/linkedin';
    };

    return (
        <Container className="d-flex align-items-center justify-content-center vh-100">
            <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow p-4">
                <h2 className="text-center mb-4">התחברות</h2>

                {success && <Alert variant="success" className="text-center">{success}</Alert>}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

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
                        {loading ? 'מתחבר...' : 'התחבר'}
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