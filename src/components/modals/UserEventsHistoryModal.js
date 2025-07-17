import React from 'react';
import { Modal, Button, Table, Badge, Alert } from 'react-bootstrap';
import { CalendarEvent, GeoAlt } from 'react-bootstrap-icons';

// mockEvents provides sample data for user events, keyed by user ID.
// In a real application, this data would be fetched from a backend API.
const mockEvents = {
    '1': [ // Events for a user with ID '1'.
        { id: 'e1', name: 'Monthly Networking Meetup', date: '2023-01-20', location: 'Tel Aviv', role: 'Participant' },
        { id: 'e2', name: 'Personal Development Workshop', date: '2023-04-10', location: 'Zoom', role: 'Lecturer' },
        { id: 'e3', name: 'Technology Conference 2023', date: '2023-09-05', location: 'Binyanei HaUma', role: 'Participant' },
    ],
    '3': [ // Events for a user with ID '3'.
        { id: 'e4', name: 'Young Entrepreneurs Meetup', date: '2023-06-01', location: 'Haifa', role: 'Organizer' },
    ],
};

// UserEventsHistoryModal component displays a user's past event participation in a modal.
// It receives 'show' (boolean to control visibility), 'onHide' (callback to close modal),
// and 'user' (the user object whose event history is to be displayed) as props.
function UserEventsHistoryModal({ show, onHide, user }) {
    // If no user object is provided, the modal should not render.
    // This is a safety check to prevent errors when no user is selected.
    if (!user) {
        return null;
    }

    // Retrieves the events for the given user ID from mock data, or an empty array if none are found.
    const events = mockEvents[user.id] || [];

    return (
        // Bootstrap Modal component controls the display and behavior of the modal dialog.
        // 'show' and 'onHide' props manage its visibility, and 'centered' positions it in the middle.
        <Modal show={show} onHide={onHide} centered className="modal-lg">
            {/* Modal header with a close button and title indicating the user's event history. */}
            <Modal.Header closeButton className="bg-secondary text-white">
                <Modal.Title><CalendarEvent size={20} /> Event History for {user.fullName}</Modal.Title>
            </Modal.Header>
            {/* Modal body contains the main content, which is either a table of events or an alert. */}
            <Modal.Body className="p-4">
                {/* Conditionally renders either the events table or an alert message. */}
                {events.length > 0 ? (
                    // Renders a responsive Bootstrap table if events are available.
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
                        {/* Maps through the events array to render each event as a table row. */}
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.name}</td>
                                <td>{event.date}</td>
                                <td><GeoAlt size={15} /> {event.location}</td>
                                <td>
                                    {/* Displays a colored badge based on the user's role in the event. */}
                                    <Badge bg={event.role === 'Lecturer' ? 'primary' : (event.role === 'Organizer' ? 'warning' : 'info')}>
                                        {event.role}
                                    </Badge>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    // Displays an informative alert if no event history is found for the user.
                    <Alert variant="info" className="text-center">
                        No event history found for this user.
                    </Alert>
                )}
            </Modal.Body>
            {/* Modal footer with a close button. */}
            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserEventsHistoryModal;