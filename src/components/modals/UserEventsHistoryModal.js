// src/components/UserEventsHistoryModal.js
import React from 'react';
import { Modal, Button, Table, Badge, Alert } from 'react-bootstrap';
import { CalendarEvent, GeoAlt } from 'react-bootstrap-icons';

// Mock Data for user events
const mockEvents = {
    '1': [ // Assuming user ID 1
        { id: 'e1', name: 'Monthly Networking Meetup', date: '2023-01-20', location: 'Tel Aviv', role: 'Participant' },
        { id: 'e2', name: 'Personal Development Workshop', date: '2023-04-10', location: 'Zoom', role: 'Lecturer' },
        { id: 'e3', name: 'Technology Conference 2023', date: '2023-09-05', location: 'Binyanei HaUma', role: 'Participant' },
    ],
    '3': [ // Assuming user ID 3
        { id: 'e4', name: 'Young Entrepreneurs Meetup', date: '2023-06-01', location: 'Haifa', role: 'Organizer' },
    ],
    // Add more mock data as needed for other users
};

function UserEventsHistoryModal({ show, onHide, user }) {
    if (!user) {
        return null;
    }

    const events = mockEvents[user.id] || [];

    return (
        <Modal show={show} onHide={onHide} centered className="modal-lg">
            <Modal.Header closeButton className="bg-secondary text-white">
                <Modal.Title><CalendarEvent size={20} /> Event History for {user.fullName}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {events.length > 0 ? (
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
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.name}</td>
                                <td>{event.date}</td>
                                <td><GeoAlt size={15} /> {event.location}</td>
                                <td><Badge bg={event.role === 'Lecturer' ? 'primary' : (event.role === 'Organizer' ? 'warning' : 'info')}>{event.role}</Badge></td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    <Alert variant="info" className="text-center">
                        No event history found for this user.
                    </Alert>
                )}
            </Modal.Body>
            <Modal.Footer className="bg-light">
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UserEventsHistoryModal;