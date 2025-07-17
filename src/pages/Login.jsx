import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Linkedin as LinkedinIcon } from 'react-bootstrap-icons';
import { loginUser } from '../services/authService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserProvider';

// Define the Login component.
function Login() {
    // Hook for programmatic navigation.
    const navigate = useNavigate();
    // Hook to access the current URL's location object.
    const location = useLocation();
    // Custom hook to access user authentication context.
    const { login } = useUser();

    // State variables for email and password input fields.
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State variables for managing loading status, errors, and success messages.
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // useEffect hook to handle URL parameters on component mount or location change.
    useEffect(() => {
        // Parse URL search parameters.
        const params = new URLSearchParams(location.search);
        const errorMessage = params.get('error');
        const userIdFromUrl = params.get('userId');

        // If an error message is present in the URL, display it.
        if (errorMessage) {
            setError(decodeURIComponent(errorMessage));
        }

        // If a user ID is present (e.g., after a successful LinkedIn login),
        // store it in local storage, navigate to the user dashboard, and show a success message.
        if (userIdFromUrl) {
            localStorage.setItem('currentUserId', userIdFromUrl);
            navigate('/user-dashboard');
            setSuccess('Logged in successfully with LinkedIn!');
        }

        // If either an error or user ID was present in the URL, clean them from the URL.
        if (errorMessage || userIdFromUrl) {
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('error');
            newUrl.searchParams.delete('userId');
            window.history.replaceState({}, document.title, newUrl.pathname);
        }
    }, [location.search, navigate]); // Dependencies for this effect are URL search params and the navigate function.

    // Handles the submission of the standard login form.
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevents default form submission behavior (page reload).
        setError(null); // Clear any previous error messages.
        setSuccess(null); // Clear any previous success messages.
        setLoading(true); // Set loading state to true.

        // Basic validation: check if email or password fields are empty.
        if (!email || !password) {
            setError('Please enter your email and password.');
            setLoading(false);
            return;
        }

        try {
            // Call the loginUser service with provided email and password.
            const authData = await loginUser({ email, password });
            // Call the login function from the user context to update application state.
            login(authData.user);
            // If an authentication token is received, store it in local storage.
            if (authData.token) {
                localStorage.setItem('userToken', authData.token);
            }
            // If a user ID is received, store it in local storage.
            if (authData.user && authData.user.id) {
                localStorage.setItem('currentUserId', authData.user.id);
            }

            // Navigate based on user role: admin to dashboard, others to user dashboard.
            if (authData.user && authData.user.email === 'admin@admin.com') {
                navigate('/dashboard');
            } else {
                navigate('/user-dashboard');
            }

            setSuccess('Logged in successfully!'); // Display a success message.
        } catch (err) {
            // Catch and display any login errors.
            setError(err.response?.message || err.message || 'Login failed.');
        } finally {
            setLoading(false); // Always set loading to false after the operation completes.
        }
    };

    // Handles the initiation of the LinkedIn login process.
    const handleLinkedInLogin = () => {
        setError(null); // Clear previous errors.
        setSuccess(null); // Clear previous success messages.
        setLoading(true); // Set loading state.
        // Redirect the user to the backend's LinkedIn authentication endpoint.
        window.location.href = 'http://localhost:5000/auth/linkedin';
    };

    // Render the login component's UI.
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Card className="p-4" style={{ width: '100%', maxWidth: '400px' }}>
                <Card.Title className="text-center mb-4">
                    <h3>Login</h3>
                </Card.Title>

                {/* Display error messages if 'error' state is not null. */}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}
                {/* Display success messages if 'success' state is not null. */}
                {success && <Alert variant="success" className="text-center">{success}</Alert>}

                {/* Login Form */}
                <Form onSubmit={handleSubmit}>
                    {/* Email input field */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Password input field */}
                    <Form.Group className="mb-4" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>

                    {/* Submit button for login */}
                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100"
                        disabled={loading} // Disable button when loading
                    >
                        {loading && !error && !success ? 'Logging in...' : 'Login'}
                    </Button>
                </Form>

                {/* Link to registration page */}
                <div className="text-center mt-3">
                    <small>Don't have an account? <a href="/register">Sign Up</a></small>
                </div>

                <hr className="my-4" />

                {/* LinkedIn Login Button */}
                <Button
                    variant="info"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={handleLinkedInLogin}
                    disabled={loading} // Disable button when loading
                >
                    <LinkedinIcon size={20} className="me-2" /> Login with LinkedIn
                </Button>
            </Card>
        </Container>
    );
}

export default Login;