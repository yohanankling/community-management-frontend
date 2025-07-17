import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { ChatText } from "react-bootstrap-icons";

// SendMessageModal component provides a modal interface for sending messages to a specific user.
// It receives 'show' (boolean to control visibility), 'onHide' (callback to close modal),
// 'user' (the recipient user object), and 'onSendMessage' (callback to send the message) as props.
function SendMessageModal({ show, onHide, user, onSendMessage }) {
    // messageContent stores the text entered by the user in the message input field.
    const [messageContent, setMessageContent] = useState("");
    // showAlert controls the visibility of the alert message within the modal.
    const [showAlert, setShowAlert] = useState(false);
    // alertVariant determines the styling (e.g., 'success', 'danger') of the alert message.
    const [alertVariant, setAlertVariant] = useState("success");
    // alertMessage stores the actual text displayed in the alert.
    const [alertMessage, setAlertMessage] = useState("");

    // This useEffect hook resets the modal's internal state whenever the modal is shown
    // or when a different user is selected. This ensures a clean slate for each new message.
    useEffect(() => {
        if (show) {
            setMessageContent(""); // Clears the message input field.
            setShowAlert(false);    // Hides any previous alerts.
            setAlertVariant("success"); // Resets alert variant to default.
            setAlertMessage("");    // Clears any previous alert messages.
        }
    }, [show, user]); // Dependencies: 'show' prop (modal visibility) and 'user' prop (recipient).

    // If no 'user' prop is provided, the modal should not be rendered.
    // This is a safety check to prevent rendering the modal without a valid recipient.
    if (!user) {
        return null;
    }

    // handleSendMessageInternal is triggered when the "Send Message" button is clicked.
    // It performs client-side validation to ensure the message content is not empty.
    // If valid, it calls the `onSendMessage` callback prop, passing the user's ID and message content.
    // It then displays a success or error alert and clears the input field.
    // The modal is optionally closed after a short delay.
    const handleSendMessageInternal = () => {
        // Validate that the message content is not empty or just whitespace.
        if (!messageContent.trim()) {
            setAlertVariant("danger");
            setAlertMessage("An empty message cannot be sent.");
            setShowAlert(true); // Show an error alert.
            return; // Stop the message sending process.
        }

        // Call the `onSendMessage` prop to send the message, typically handled by the parent component.
        onSendMessage(user.id, messageContent);

        setAlertVariant("success");
        setAlertMessage(`Message sent successfully to ${user.fullName}!`);
        setShowAlert(true); // Show a success alert.
        setMessageContent(""); // Clear the message input field after sending.

        // Set a timeout to clear the alert and close the modal after a short delay for user feedback.
        setTimeout(() => {
            setShowAlert(false);
            onHide(); // Close the modal.
        }, 1500);
    };

    return (
        // Bootstrap Modal component.
        // 'show' and 'onHide' props control its visibility and closing behavior.
        // 'centered' positions it in the middle of the screen, and 'modal-md' sets its size.
        <Modal show={show} onHide={onHide} centered className="modal-md">
            {/* Modal header containing the close button and title with the recipient's name. */}
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>
                    <ChatText size={20} /> Send Message to {user.fullName}
                </Modal.Title>
            </Modal.Header>
            {/* Modal body containing the message input form. */}
            <Modal.Body className="p-4">
                {/* Conditionally renders an alert message based on the `showAlert` state. */}
                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                {/* Form for message input. */}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Message Content</Form.Label>
                        <Form.Control
                            as="textarea" // Renders a textarea for multi-line input.
                            rows={5}
                            placeholder="Write your message here..."
                            value={messageContent} // Controlled component, value from state.
                            onChange={(e) => setMessageContent(e.target.value)} // Update state on change.
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            {/* Modal footer with action buttons. */}
            <Modal.Footer className="bg-light">
                <Button variant="success" onClick={handleSendMessageInternal}>
                    <ChatText size={15} /> Send Message
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default SendMessageModal;