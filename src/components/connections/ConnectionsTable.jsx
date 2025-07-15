// src/components/ConnectionsTable.jsx
import React from 'react';
import { Table, Alert, Badge } from 'react-bootstrap';
import { PersonCircle, Plug } from 'react-bootstrap-icons';

// Mock Data for all connections (if ConnectionsTable is used as a standalone dashboard view)
// For the modal, we'll pass specific connections via props.
const mockAllConnections = [
    { id: 'c1', connectedUser: 'Oren Levi', date: '2023-01-15', type: 'Introduction', status: 'Active', userFullName: 'John Doe' },
    { id: 'c2', connectedUser: 'Shira Cohen', date: '2023-03-20', type: 'Collaboration', status: 'Active', userFullName: 'John Doe' },
    { id: 'c3', connectedUser: 'Dudu Golan', date: '2023-07-01', type: 'Recommendation', status: 'Active', userFullName: 'John Doe' },
    { id: 'c4', connectedUser: 'Yossi Alon', date: '2023-02-10', type: 'Networking', status: 'Active', userFullName: 'Jane Smith' },
    { id: 'c5', connectedUser: 'Michael Brown', date: '2024-01-05', type: 'Mentorship', status: 'Active', userFullName: 'Jane Smith' },
    { id: 'c6', connectedUser: 'Sarah Green', date: '2024-03-12', type: 'Project', status: 'Active', userFullName: 'Bob Johnson' },
];

// Add 'connections' prop and 'isModal' prop to ConnectionsTable
function ConnectionsTable({ connections, isModal = false }) {
    // If 'connections' prop is provided, use it; otherwise, use mockAllConnections
    const displayConnections = connections || mockAllConnections;

    return (
        // Remove the Card wrapper if it's used inside a modal, or make it conditional
        <div className={!isModal ? "mt-4 shadow-sm border-0 rounded-3 card" : ""}>
            {!isModal && ( // Only show header if not in modal
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 d-flex align-items-center">
                        <Plug size={20} className="me-2" /> All Community Connections
                    </h5>
                </div>
            )}
            <div className={!isModal ? "card-body p-0" : "p-0"} style={{ minHeight: '150px' }}> {/* Adjust minHeight for modal */}
                {displayConnections.length > 0 ? (
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="table-light">
                        <tr>
                            {/* Only show 'User' column if not in modal context */}
                            {!isModal && (
                                <th className="text-center">
                                    <div className="d-flex flex-column align-items-center">
                                        <PersonCircle size={20} />
                                        <span>User</span>
                                    </div>
                                </th>
                            )}
                            <th className="text-center">
                                <div className="d-flex flex-column align-items-center">
                                    <PersonCircle size={20} />
                                    <span>Connected With</span>
                                </div>
                            </th>
                            <th className="text-center">Date</th>
                            <th className="text-center">Type</th>
                            <th className="text-center">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayConnections.map(conn => (
                            <tr key={conn.id}>
                                {!isModal && ( // Only show 'User' cell if not in modal context
                                    <td className="text-center">{conn.userFullName}</td>
                                )}
                                <td className="text-center">{conn.connectedUser}</td>
                                <td className="text-center">{conn.date}</td>
                                <td className="text-center">{conn.type}</td>
                                <td className="text-center">
                                    <Badge bg={conn.status === 'Active' ? 'success' : 'secondary'}>{conn.status}</Badge>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    <div className="p-3">
                        <Alert variant="info" className="text-center mb-0">
                            No connections found for this user.
                        </Alert>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConnectionsTable;