import React from 'react';
import { Table, Alert, Badge } from 'react-bootstrap';
import { PersonCircle, Plug } from 'react-bootstrap-icons';

// Defines mock data to be used when the component is not provided with specific connection data.
// This data represents a list of community connections, each with an ID, connected user,
// date of connection, type, status, and the full name of the user who made the connection.
const mockAllConnections = [
    { id: 'c1', connectedUser: 'Oren Levi', date: '2023-01-15', type: 'Introduction', status: 'Active', userFullName: 'John Doe' },
    { id: 'c2', connectedUser: 'Shira Cohen', date: '2023-03-20', type: 'Collaboration', status: 'Active', userFullName: 'John Doe' },
    { id: 'c3', connectedUser: 'Dudu Golan', date: '2023-07-01', type: 'Recommendation', status: 'Active', userFullName: 'John Doe' },
    { id: 'c4', connectedUser: 'Yossi Alon', date: '2023-02-10', type: 'Networking', status: 'Active', userFullName: 'Jane Smith' },
    { id: 'c5', connectedUser: 'Michael Brown', date: '2024-01-05', type: 'Mentorship', status: 'Active', userFullName: 'Jane Smith' },
    { id: 'c6', connectedUser: 'Sarah Green', date: '2024-03-12', type: 'Project', status: 'Active', userFullName: 'Bob Johnson' },
];

// ConnectionsTable functional component receives 'connections' and 'isModal' as props.
// 'connections' is an optional array of connection objects to display.
// 'isModal' is a boolean flag, defaulting to false, which adjusts the component's
// rendering for use within a modal versus a standalone page.
function ConnectionsTable({ connections, isModal = false }) {
    // Determines which set of connections to display. If 'connections' prop is provided,
    // it uses that; otherwise, it falls back to the 'mockAllConnections' data.
    const displayConnections = connections || mockAllConnections;

    return (
        // Renders a div that acts as a container for the table.
        // It conditionally applies styling (shadow, border, rounded corners, card class)
        // based on whether the component is being used within a modal.
        <div className={!isModal ? "mt-4 shadow-sm border-0 rounded-3 card" : ""}>
            {/* Conditionally renders the table header. The header is shown only if the */}
            {/* component is NOT in modal mode, providing a title and an icon for the table. */}
            {!isModal && (
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 d-flex align-items-center">
                        <Plug size={20} className="me-2" /> All Community Connections
                    </h5>
                </div>
            )}
            {/* Renders the body of the card, containing either the table or an alert message. */}
            {/* Padding is adjusted based on whether it's in modal mode, and a minimum height is set. */}
            <div className={!isModal ? "card-body p-0" : "p-0"} style={{ minHeight: '150px' }}>
                {/* Conditionally renders the table if there are connections to display. */}
                {displayConnections.length > 0 ? (
                    // Bootstrap Table component with hover effect and responsive behavior.
                    // 'align-middle' vertically aligns content in table cells.
                    <Table hover responsive className="mb-0 align-middle">
                        {/* Table header section. */}
                        <thead className="table-light">
                        <tr>
                            {/* Conditionally renders the 'User' column. This column is only */}
                            {/* shown when the component is NOT in modal mode. */}
                            {!isModal && (
                                <th className="text-center">
                                    <div className="d-flex flex-column align-items-center">
                                        <PersonCircle size={20} />
                                        <span>User</span>
                                    </div>
                                </th>
                            )}
                            {/* Table header for 'Connected With' column, including an icon. */}
                            <th className="text-center">
                                <div className="d-flex flex-column align-items-center">
                                    <PersonCircle size={20} />
                                    <span>Connected With</span>
                                </div>
                            </th>
                            {/* Table headers for 'Date', 'Type', and 'Status' columns. */}
                            <th className="text-center">Date</th>
                            <th className="text-center">Type</th>
                            <th className="text-center">Status</th>
                        </tr>
                        </thead>
                        {/* Table body section, mapping over the 'displayConnections' array */}
                        {/* to render a row for each connection. */}
                        <tbody>
                        {displayConnections.map(conn => (
                            <tr key={conn.id}>
                                {/* Conditionally renders the 'User' data cell, aligning with the */}
                                {/* conditional 'User' column header. */}
                                {!isModal && (
                                    <td className="text-center">{conn.userFullName}</td>
                                )}
                                {/* Data cells for 'Connected With', 'Date', and 'Type'. */}
                                <td className="text-center">{conn.connectedUser}</td>
                                <td className="text-center">{conn.date}</td>
                                <td className="text-center">{conn.type}</td>
                                {/* Data cell for 'Status', using a Bootstrap Badge component. */}
                                {/* The badge's background color changes based on the connection's status. */}
                                <td className="text-center">
                                    <Badge bg={conn.status === 'Active' ? 'success' : 'secondary'}>{conn.status}</Badge>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    // Renders an alert message if there are no connections to display.
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