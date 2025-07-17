import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import {
    PersonCircle,
    Envelope,
    Telephone,
    Link45deg,
    Trash,
    PencilSquare,
    ChatText,
    Plug,
    CalendarEvent,
    BriefcaseFill
} from "react-bootstrap-icons";

// UserDetailsModal component displays detailed information about a user in a modal window.
// It also provides action buttons for interacting with the user's profile.
// Props:
// - show: Boolean to control the visibility of the modal.
// - onHide: Callback function to close the modal.
// - user: The user object containing details to be displayed.
// - onEditClick: Callback function triggered when the edit button is clicked.
// - onMessageClick: Callback function triggered when the message button is clicked.
// - onDeleteClick: Callback function triggered when the delete button is clicked.
// - onViewConnectionsClick: Callback function triggered when the view connections button is clicked.
// - onViewEventsClick: Callback function triggered when the view events button is clicked.
function UserDetailsModal({
                              show,
                              onHide,
                              user,
                              onEditClick,
                              onMessageClick,
                              onDeleteClick,
                              onViewConnectionsClick,
                              onViewEventsClick,
                          }) {
    // If no user object is provided, the modal should not be rendered.
    // This prevents errors when the modal is opened without a selected user.
    if (!user) {
        return null;
    }

    return (
        // Bootstrap Modal component controls the display and behavior of the modal dialog.
        // `show` and `onHide` manage visibility, `centered` positions it in the middle.
        <Modal show={show} onHide={onHide} centered className="modal-lg">
            {/* Modal header with a close button and title. */}
            <Modal.Header closeButton className="bg-light">
                <Modal.Title><PersonCircle size={20} /> User Details</Modal.Title>
            </Modal.Header>
            {/* Modal body contains the user's details and action buttons. */}
            <Modal.Body className="p-4">
                {/* Displays basic user information with relevant icons. */}
                <p className="mb-2"><PersonCircle size={15} /> <strong>Name:</strong> {user.fullName}</p>
                <p className="mb-2"><Envelope size={15} /> <strong>Email:</strong> {user.email}</p>
                <p className="mb-2"><Telephone size={15} /> <strong>Phone:</strong> {user.phone}</p>
                <p className="mb-2">
                    <Link45deg size={15} /> <strong>LinkedIn:</strong>
                    {/* Button to open the user's LinkedIn profile in a new tab. */}
                    <Button variant="link" href={user.linkedin} target="_blank" rel="noreferrer" className="p-0 text-primary">Profile</Button>
                </p>
                <p className="mb-2">
                    <BriefcaseFill size={15} className="me-1" />
                    <strong>Role:</strong> <Badge bg="info">{user.role}</Badge> {/* Displays user's role as a badge. */}
                </p>

                <hr className="my-3" /> {/* Separator line. */}

                {/* Container for action buttons, aligned to the end and wrapping on smaller screens. */}
                <div className="d-flex justify-content-end flex-wrap">
                    {/* Button to view user's event history, triggers `onViewEventsClick` callback. */}
                    <Button
                        variant="outline-secondary"
                        className="mb-2 me-2"
                        onClick={() => onViewEventsClick(user)}
                        title="Events History"
                    >
                        <CalendarEvent size={15} />
                    </Button>

                    {/* Button to view user's connections history, triggers `onViewConnectionsClick` callback. */}
                    <Button
                        variant="outline-info"
                        className="mb-2 me-2"
                        onClick={() => onViewConnectionsClick(user)}
                        title="Connections History"
                    >
                        <Plug size={15} />
                    </Button>

                    {/* Button to send a message to the user, triggers `onMessageClick` callback. */}
                    <Button
                        variant="outline-success"
                        className="mb-2 me-2"
                        onClick={() => onMessageClick(user)}
                        title="Send Message"
                    >
                        <ChatText size={15} />
                    </Button>

                    {/* Button to edit user details, triggers `onEditClick` callback. */}
                    <Button
                        variant="outline-primary"
                        className="mb-2 me-2"
                        onClick={() => onEditClick(user)}
                        title="Edit"
                    >
                        <PencilSquare size={15} />
                    </Button>

                    {/* Button to delete the user, triggers `onDeleteClick` callback. */}
                    <Button
                        variant="danger"
                        className="mb-2"
                        onClick={() => onDeleteClick(user)}
                        title="Delete"
                    >
                        <Trash size={15} />
                    </Button>
                </div>
            </Modal.Body>
            {/* Modal footer, intentionally left empty as per requirements. */}
            <Modal.Footer className="bg-light">
            </Modal.Footer>
        </Modal>
    );
}

export default UserDetailsModal;