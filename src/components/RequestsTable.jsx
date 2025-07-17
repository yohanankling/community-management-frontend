import React from 'react';
import { Table, Alert, Badge, Card } from 'react-bootstrap';
import { QuestionCircle, PersonCircle } from 'react-bootstrap-icons';

// mockRequests provides sample data for various user requests.
// In a real application, this data would typically be fetched from a backend API.
const mockRequests = [
    {
        id: 'req1',
        requesterName: 'נועה לוי',
        type: 'חיבור למומחה',
        status: 'ממתין',
        requestDate: '2024-06-10',
        priority: 'גבוהה',
        description: 'צריכה עזרה בחיבור למומחה שיווק דיגיטלי'
    },
    {
        id: 'req2',
        requesterName: 'יוסי כהן',
        type: 'בקשה למידע',
        status: 'בטיפול',
        requestDate: '2024-06-12',
        priority: 'בינונית',
        description: 'מידע על אירועי נטוורקינג קרובים'
    },
    {
        id: 'req3',
        requesterName: 'שרה אלון',
        type: 'תמיכה טכנית',
        status: 'נסגר',
        requestDate: '2024-06-08',
        priority: 'נמוכה',
        description: 'בעיה בהתחברות למערכת הפורום'
    },
    {
        id: 'req4',
        requesterName: 'דודו גולן',
        type: 'הצעת שיתוף פעולה',
        status: 'ממתין',
        requestDate: '2024-07-01',
        priority: 'גבוהה',
        description: 'מעוניין להציע שיתוף פעולה בפרויקט חדש'
    },
];

// RequestsTable component displays a table of pending user requests.
// It uses mock data to illustrate the structure and functionality.
function RequestsTable() {
    return (
        // Card component provides a styled container for the table, including a header and body.
        <Card className="mt-4 shadow-sm border-0 rounded-3">
            {/* Card header for the table title and icon. */}
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                    <QuestionCircle size={20} className="me-2" /> All Pending Requests
                </h5>
            </Card.Header>
            {/* Card body contains the table or an alert if no requests are found. */}
            <Card.Body className="p-0" style={{ minHeight: '300px' }}>
                {/* Conditionally renders the table if there are requests, otherwise shows an alert. */}
                {mockRequests.length > 0 ? (
                    // Table component from react-bootstrap, styled for hover effect and responsiveness.
                    <Table hover responsive className="mb-0 align-middle">
                        {/* Table header defines the columns for the requests. */}
                        <thead className="table-light">
                        <tr>
                            <th className="text-center">
                                <div className="d-flex flex-column align-items-center">
                                    <PersonCircle size={20} />
                                    <span>מבקש</span> {/* Requester */}
                                </div>
                            </th>
                            <th className="text-center">סוג בקשה</th> {/* Request Type */}
                            <th className="text-center">סטטוס</th> {/* Status */}
                            <th className="text-center">תאריך בקשה</th> {/* Request Date */}
                            <th className="text-center">עדיפות</th> {/* Priority */}
                            <th className="text-center">תיאור</th> {/* Description */}
                        </tr>
                        </thead>
                        {/* Table body maps through the mockRequests array to render each request as a row. */}
                        <tbody>
                        {mockRequests.map(request => (
                            <tr key={request.id}>
                                <td className="text-center">{request.requesterName}</td>
                                <td className="text-center">{request.type}</td>
                                <td className="text-center">
                                    {/* Badge component visually indicates the status with different colors. */}
                                    <Badge bg={
                                        request.status === 'ממתין' ? 'warning' : // Pending
                                            request.status === 'בטיפול' ? 'info' : // In Progress
                                                'success' // Closed
                                    }>
                                        {request.status}
                                    </Badge>
                                </td>
                                <td className="text-center">{request.requestDate}</td>
                                <td className="text-center">
                                    {/* Badge component visually indicates the priority with different colors. */}
                                    <Badge bg={
                                        request.priority === 'גבוהה' ? 'danger' : // High
                                            request.priority === 'בינונית' ? 'primary' : // Medium
                                                'secondary' // Low
                                    }>
                                        {request.priority}
                                    </Badge>
                                </td>
                                <td className="text-start">{request.description}</td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                ) : (
                    // Displays an alert if there are no requests to show.
                    <div className="p-3">
                        <Alert variant="info" className="text-center mb-0">
                            אין בקשות ממתינות כרגע. {/* No pending requests at the moment. */}
                        </Alert>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default RequestsTable;