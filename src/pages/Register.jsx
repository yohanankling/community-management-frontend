import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from '../services/authService'; // Import the authentication service
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Register() {
    const navigate = useNavigate(); // Hook for programmatic navigation

    // State variables for form inputs
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State variables for UI feedback
    const [loading, setLoading] = useState(false); // To show loading state on button
    const [error, setError] = useState(null);     // To display error messages
    const [success, setSuccess] = useState(false); // To display success message

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior (page reload)
        setError(null);         // Clear previous errors
        setSuccess(false);      // Clear previous success messages
        setLoading(true);       // Set loading state

        // Basic client-side validation
        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }

        try {
            // Call the registerUser function from the service
            const response = await registerUser({ fullName, email, password });
            console.log('Registration successful:', response);
            setSuccess(true); // Indicate success
            // Optionally, redirect to login page after a short delay
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            // Handle errors from the service (e.g., network error, server error message)
            setError(err.message || 'An unexpected error occurred during registration.');
            console.error('Registration error:', err);
        } finally {
            setLoading(false); // Always stop loading, regardless of success or failure
        }
    };

    return (
        <Container fluid className="d-flex align-items-center justify-content-center auth-background vh-100">
            <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow p-4">
                <h2 className="text-center mb-4">הרשמה</h2>

                {/* Display success or error messages */}
                {success && <Alert variant="success" className="text-center">הרשמה בוצעה בהצלחה! מועבר לדף התחברות...</Alert>}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}> {/* Attach handleSubmit to the form */}
                    <Form.Group className="mb-3" controlId="formFullName">
                        <Form.Label>שם מלא</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="הזן את שמך המלא"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required // HTML5 validation
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>אימייל</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="הזן אימייל"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>סיסמה</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="הזן סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formConfirmPassword">
                        <Form.Label>אימות סיסמה</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="הזן שוב את הסיסמה"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'מרשם...' : 'הרשם'} {/* Change button text during loading */}
                    </Button>
                </Form>

                <div className="text-center mt-3">
                    <small>כבר יש לך חשבון? <a href="/login">התחבר כאן</a></small>
                </div>
            </Card>
        </Container>
    );
}

export default Register;
