import React from 'react';
import { Table, Alert, Badge, Card } from 'react-bootstrap';
import { QuestionCircle, PersonCircle } from 'react-bootstrap-icons';

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

function RequestsTable() {
    return (
        <Card className="mt-4 shadow-sm border-0 rounded-3">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                    <QuestionCircle size={20} className="me-2" /> All Pending Requests
                </h5>
            </Card.Header>
            <Card.Body className="p-0" style={{ minHeight: '300px' }}>
                {mockRequests.length > 0 ? (
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="table-light">
                        <tr>
                            <th className="text-center">
                                <div className="d-flex flex-column align-items-center">
                                    <PersonCircle size={20} />
                                    <span>מבקש</span>
                                </div>
                            </th>
                            <th className="text-center">סוג בקשה</th>
                            <th className="text-center">סטטוס</th>
                            <th className="text-center">תאריך בקשה</th>
                            <th className="text-center">עדיפות</th>
                            <th className="text-center">תיאור</th>
                        </tr>
                        </thead>
                        <tbody>
                        {mockRequests.map(request => (
                            <tr key={request.id}>
                                <td className="text-center">{request.requesterName}</td>
                                <td className="text-center">{request.type}</td>
                                <td className="text-center">
                                    <Badge bg={
                                        request.status === 'ממתין' ? 'warning' :
                                            request.status === 'בטיפול' ? 'info' :
                                                'success'
                                    }>
                                        {request.status}
                                    </Badge>
                                </td>
                                <td className="text-center">{request.requestDate}</td>
                                <td className="text-center">
                                    <Badge bg={
                                        request.priority === 'גבוהה' ? 'danger' :
                                            request.priority === 'בינונית' ? 'primary' :
                                                'secondary'
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
                    <div className="p-3">
                        <Alert variant="info" className="text-center mb-0">
                            אין בקשות ממתינות כרגע.
                        </Alert>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
}

export default RequestsTable;