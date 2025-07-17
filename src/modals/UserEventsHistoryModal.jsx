// src/components/UserEventsHistoryModal.js
import React from 'react';
import { Modal, Button, Table, Badge, Alert } from 'react-bootstrap';
import { CalendarEvent, GeoAlt } from 'react-bootstrap-icons';

// Mock Data for user events.
// In a real-world application, this data would typically be fetched from a backend API
// based on the `user.id` prop passed to the component.
const mockEvents = {
    '1': [ // Sample events for a user with ID '1'
        { id: 'e1', name: 'Monthly Networking Meetup', date: '2023-01-20', location: 'Tel Aviv', role: 'Participant' },
        { id: 'e2', name: 'Personal Development Workshop', date: '2023-04-10', location: 'Zoom', role: 'Lecturer' },
        { id: 'e3', name: 'Technology Conference 2023', date: '2023-09-05', location: 'Binyanei HaUma', role: 'Participant' },
    ],
    '3': [ // Sample events for a user with ID '3'
        { id: 'e4', name: 'Young Entrepreneurs Meetup', date: '2023-06-01', location: 'Haifa', role: 'Organizer' },
    ],
    // Additional mock data for other user IDs can be added here
};

/**
 * UserEventsHistoryModal component displays a user's past event participation in a modal dialog.
 * It fetches and presents mock event data for the specified user.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.show - Controls the visibility of the modal.
 * @param {function} props.onHide - Callback function to invoke when the modal is closed.
 * @param {object} props.user - The user object whose event history is to be displayed.
 * It's expected to have an `id` and `fullName` property.
 * @returns {JSX.Element|null} The modal component if a user is provided, otherwise null.
 */
function UserEventsHistoryModal({ show, onHide, user }) {
    // Render nothing if no user object is provided. This is a crucial safety check
    // to prevent errors if the modal is opened without a valid user.
    if (!user) {
        return null;
    }

    // Retrieve events for the current user from the mock data.
    // If no events are found for the user's ID, an empty array is used.
    const events = mockEvents[user.id] || [];

    return (
        // Bootstrap's Modal component provides the dialog structure.
        // `show` and `onHide` props manage the modal's open/close state.
        // `centered` ensures the modal is vertically centered on the screen.
        // `className="modal-lg"` sets the modal to a large size.
        <Modal show={show} onHide={onHide} centered className="modal-lg">
            {/* Modal header with a title indicating the user and a close button. */}
            <Modal.Header closeButton className="bg-secondary text-white">
                <Modal.Title>
                    <CalendarEvent size={20} /> Event History for {user.fullName}
                </Modal.Title>
            </Modal.Header>

            {/* Modal body, containing the event table or an alert message. */}
            <Modal.Body className="p-4">
                {/* Conditionally render the table if events exist, otherwise show an informative alert. */}
                {events.length > 0 ? (
                    // Bootstrap's Table component for displaying event details.
                    // `striped`, `bordered`, `hover`, and `responsive` add styling and responsiveness.
                    <Table striped bordered hover responsive className="mb-0">
                        <thead>
                        <tr>
                            <th>Event Name</th>
                            <th>Date</th>
                            <th>Location</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {/* Map through the `events` array to render each event as a table row. */}
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.name}</td>
                                <td>{event.date}</td>
                                <td><GeoAlt size={15} /> {event.location}</td>
                                <td>
                                    {/* Badge component to visually highlight the user's role in the event */}
                                    <Badge bg={
                                        event.role === 'Lecturer' ? 'primary' :
                                            (event.role === 'Organizer' ? 'warning' : 'info')
                                    }>
                                        {event.role}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    // Display an informational alert when no event history is found.
                    <Alert variant="info" className="text-center">
                        No event history found for this user.
                    </Alert>
                )}
            </Modal.Body>

            {/* Modal footer with a single "Close" button. */}
            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserEventsHistoryModal;