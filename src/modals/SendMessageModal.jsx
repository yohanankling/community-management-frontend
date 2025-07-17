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
    // alertVariant determines the styling (e.g., 'success', 'danger') of the alert.
    const [alertVariant, setAlertVariant] = useState("success");
    // alertMessage stores the actual text content displayed in the alert.
    const [alertMessage, setAlertMessage] = useState("");

    // useEffect hook to reset the modal's internal state when it is shown or the target user changes.
    // This ensures a clean input field and no lingering alerts for each new message composition.
    useEffect(() => {
        if (show) {
            setMessageContent("");    // Clears the message input field.
            setShowAlert(false);      // Hides any previously displayed alerts.
            setAlertVariant("success"); // Resets the alert variant to default.
            setAlertMessage("");      // Clears any previous alert messages.
        }
    }, [show, user]); // Dependencies: `show` (modal visibility) and `user` (recipient change).

    // If no user object is provided, the modal should not be rendered.
    // This is a crucial safety check to prevent errors when a recipient is not defined.
    if (!user) {
        return null;
    }

    // handleSendMessageInternal is triggered when the "Send Message" button is clicked.
    // It performs validation on the message content and then calls the `onSendMessage` callback.
    // It also manages the display of feedback alerts and clears the input field.
    const handleSendMessageInternal = () => {
        // Validates that the message content is not empty or consists only of whitespace.
        if (!messageContent.trim()) {
            setAlertVariant("danger");
            setAlertMessage("An empty message cannot be sent.");
            setShowAlert(true); // Displays an error alert.
            return; // Stops the function execution if validation fails.
        }

        // Calls the `onSendMessage` callback provided by the parent component,
        // passing the recipient's ID and the message content.
        onSendMessage(user.id, messageContent);

        setAlertVariant("success");
        setAlertMessage(`Message sent successfully to ${user.fullName}!`);
        setShowAlert(true); // Displays a success alert.
        setMessageContent(""); // Clears the message input field after successful sending.

        // Sets a timeout to hide the alert and close the modal after a short delay,
        // providing visual feedback to the user before the modal disappears.
        setTimeout(() => {
            setShowAlert(false); // Hides the alert.
            onHide(); // Closes the modal.
        }, 1500);
    };

    return (
        // Bootstrap Modal component.
        // `show` and `onHide` props control its visibility and closing behavior.
        // `centered` positions it in the center of the screen, and `modal-md` sets its medium size.
        <Modal show={show} onHide={onHide} centered className="modal-md">
            {/* Modal header with a close button and title indicating the message recipient. */}
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>
                    <ChatText size={20} /> Send Message to {user.fullName}
                </Modal.Title>
            </Modal.Header>
            {/* Modal body contains the alert area and the message input form. */}
            <Modal.Body className="p-4">
                {/* Conditionally renders an alert message based on the `showAlert` state. */}
                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                {/* Form for composing the message. */}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Message Content</Form.Label>
                        <Form.Control
                            as="textarea" // Renders a multi-line text input.
                            rows={5}
                            placeholder="Write your message here..."
                            value={messageContent} // Controlled component: value is tied to state.
                            onChange={(e) => setMessageContent(e.target.value)} // Updates state on input change.
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            {/* Modal footer with "Send Message" and "Close" buttons. */}
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