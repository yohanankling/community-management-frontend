import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { registerUser } from '../services/authService'; // Import the authentication service for user registration.
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for programmatic navigation.

// Register component provides a user registration form.
function Register() {
    // useNavigate hook for navigating between routes after registration.
    const navigate = useNavigate();

    // State variables to store the values of the form input fields.
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State variables to manage UI feedback during the registration process.
    const [loading, setLoading] = useState(false); // Controls the loading state of the submit button.
    const [error, setError] = useState(null);     // Stores and displays any error messages.
    const [success, setSuccess] = useState(false); // Indicates successful registration.

    // handleSubmit function is called when the registration form is submitted.
    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior (page reload).
        setError(null);         // Clear any previous error messages.
        setSuccess(false);      // Reset success status.
        setLoading(true);       // Activate loading state for the button.

        // Client-side validation: Check if all required fields are filled.
        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            setLoading(false); // Deactivate loading state.
            return;            // Stop further execution.
        }

        // Client-side validation: Check if password and confirm password match.
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false); // Deactivate loading state.
            return;            // Stop further execution.
        }

        try {
            // Call the registerUser service function with the form data.
            const response = await registerUser({ fullName, email, password });
            console.log('Registration successful:', response); // Log successful response.
            setSuccess(true); // Set success state to true.
            // Redirect to the login page after a short delay to show the success message.
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            // Catch and handle any errors during the registration process (e.g., network issues, server errors).
            setError(err.message || 'An unexpected error occurred during registration.');
            console.error('Registration error:', err); // Log the error for debugging.
        } finally {
            setLoading(false); // Always deactivate loading state, regardless of success or failure.
        }
    };

    // Render the registration form UI.
    return (
        <Container fluid className="d-flex align-items-center justify-content-center auth-background vh-100">
            <Card style={{ width: '100%', maxWidth: '400px' }} className="shadow p-4">
                <h2 className="text-center mb-4">הרשמה</h2>

                {/* Conditional rendering for success and error messages. */}
                {success && <Alert variant="success" className="text-center">הרשמה בוצעה בהצלחה! מועבר לדף התחברות...</Alert>}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                {/* Registration Form */}
                <Form onSubmit={handleSubmit}> {/* Attach the handleSubmit function to the form's onSubmit event. */}
                    {/* Full Name Input Field */}
                    <Form.Group className="mb-3" controlId="formFullName">
                        <Form.Label>שם מלא</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="הזן את שמך המלא"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)} // Update fullName state on change.
                            required // HTML5 validation attribute.
                        />
                    </Form.Group>

                    {/* Email Input Field */}
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>אימייל</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="הזן אימייל"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state on change.
                            required
                        />
                    </Form.Group>

                    {/* Password Input Field */}
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>סיסמה</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="הזן סיסמה"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // Update password state on change.
                            required
                        />
                    </Form.Group>

                    {/* Confirm Password Input Field */}
                    <Form.Group className="mb-4" controlId="formConfirmPassword">
                        <Form.Label>אימות סיסמה</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="הזן שוב את הסיסמה"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state on change.
                            required
                        />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                        {loading ? 'מרשם...' : 'הרשם'} {/* Change button text based on loading state. */}
                    </Button>
                </Form>

                {/* Link to Login Page */}
                <div className="text-center mt-3">
                    <small>כבר יש לך חשבון? <a href="/login">התחבר כאן</a></small>
                </div>
            </Card>
        </Container>
    );
}

export default Register;
