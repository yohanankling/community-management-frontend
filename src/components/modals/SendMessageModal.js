// src/components/SendMessageModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { ChatText } from "react-bootstrap-icons";

function SendMessageModal({ show, onHide, user, onSendMessage }) {
    const [messageContent, setMessageContent] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [alertVariant, setAlertVariant] = useState("success");
    const [alertMessage, setAlertMessage] = useState("");

    // Reset state when modal is shown or user changes
    useEffect(() => {
        if (show) {
            setMessageContent("");
            setShowAlert(false);
            setAlertVariant("success");
            setAlertMessage("");
        }
    }, [show, user]); // Depend on 'show' and 'user'

    // Don't render if no user is passed (safety check)
    if (!user) {
        return null;
    }

    const handleSendMessageInternal = () => {
        if (!messageContent.trim()) {
            setAlertVariant("danger");
            setAlertMessage("An empty message cannot be sent.");
            setShowAlert(true);
            return;
        }

        // Call the parent's onSendMessage function
        onSendMessage(user.id, messageContent);

        setAlertVariant("success");
        setAlertMessage(`Message sent successfully to ${user.fullName}!`);
        setShowAlert(true);
        setMessageContent(""); // Clear message input

        // Optionally close modal after a short delay
        setTimeout(() => {
            setShowAlert(false);
            onHide();
        }, 1500);
    };

    return (
        <Modal show={show} onHide={onHide} centered className="modal-md">
            <Modal.Header closeButton className="bg-light">
                <Modal.Title>
                    <ChatText size={20} /> Send Message to {user.fullName}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {showAlert && (
                    <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>
                        {alertMessage}
                    </Alert>
                )}
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Message Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            placeholder="Write your message here..."
                            value={messageContent}
                            onChange={(e) => setMessageContent(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
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