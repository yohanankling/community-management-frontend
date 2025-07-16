// src/components/DashboardTable.jsx
import React from 'react';
import {
    Card,
    Table,
    Button,
    Alert,
} from 'react-bootstrap';
import {
    PersonCircle,
    BriefcaseFill,
    Calendar3Fill,
    Linkedin,
    ThreeDotsVertical,
} from 'react-bootstrap-icons';
import UserSearch from '../UserSearch'; // Assuming UserSearch is in the same components folder

function DashboardTable({
                            users, // Original full list of users for UserSearch
                            displayUsers, // Filtered list of users to display in the table
                            onFilteredUsersChange, // Callback from Dashboard for UserSearch
                            onShowAddUserModal,
                            onRowClick,
                        }) {
    return (
        <Card className="mt-4 shadow-sm border-0 rounded-3">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                    <PersonCircle size={20} className="me-2" /> Community Members
                </h5>
                <div className="d-flex align-items-center">
                    <UserSearch
                        users={users}
                        onFilteredUsersChange={onFilteredUsersChange}
                    />
                    <Button variant="outline-primary" size="sm" onClick={onShowAddUserModal}>
                        Add <PersonCircle size={15} />
                    </Button>
                </div>
            </Card.Header>
            <Card.Body className="p-0" style={{ minHeight: '300px' }}>
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="table-light">
                    <tr>
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <PersonCircle size={20} />
                                <span>Name</span>
                            </div>
                        </th>
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <BriefcaseFill size={20} />
                                <span>Role</span>
                            </div>
                        </th>
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <Calendar3Fill size={20} />
                                <span>Years</span>
                            </div>
                        </th>
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <Linkedin size={20} />
                                <span>LinkedIn</span>
                            </div>
                        </th>
                        <th className="text-center"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayUsers.length > 0 ? (
                        displayUsers.map((user) => (
                            <tr
                                key={user.id || user.fullName}
                                className="align-middle"
                            >
                                <td className="text-center">{user.fullName}</td>
                                <td className="text-center">{user.role}</td>
                                <td className="text-center">{user.yearsOfExperience || Math.floor(Math.random() * 15) + 1}</td>
                                <td className="text-center">
                                    {/* Modified line: If linkedin is falsy, generate a random LinkedIn URL */}
                                    {user.linkedin ? (
                                        <Button variant="link" className="p-0 text-primary" href={user.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Linkedin size={25} />
                                        </Button>
                                    ) : (
                                        <Button variant="link" className="p-0 text-primary" href={`https://www.linkedin.com/in/yohanan-kling/`} target="_blank" rel="noopener noreferrer">
                                            <Linkedin size={25} />
                                        </Button>
                                    )}
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRowClick(user);
                                        }}
                                        className="p-1"
                                    >
                                        <ThreeDotsVertical size={20} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-3">
                                <Alert variant="info" className="mb-0">
                                    No users found matching your search criteria.
                                </Alert>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}

export default DashboardTable;