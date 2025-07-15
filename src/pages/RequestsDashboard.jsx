import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import BottomNavbar from '../components/layout/BottomNavbar';
import DashboardCards from '../components/dashboard/DashboardCards';
import RequestsTable from '../components/RequestsTable';
import mockUsers from '../data/mockUsers';

import logo from '../assets/logo.png';

function RequestsDashboard() {
    const [users, setUsers] = useState(mockUsers);

    const handleExcelImportOnRequestsDashboard = (data) => {
        console.log("Importing data to Requests Dashboard (placeholder):", data);
    };

    return (
        <div className="d-flex flex-column vh-100">
            <Container
                fluid
                className="p-4 bg-light flex-grow-1 dashboard-main-content"
                style={{
                    overflowY: 'auto',
                }}
            >
                <header style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                    <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Home" style={{ height: '40px', marginRight: '10px' }} />
                    </a>
                    <h2 className="mb-0 text-primary">Requests</h2>
                </header>

                <DashboardCards totalMembers={users.length} />

                <RequestsTable />

            </Container>
            <BottomNavbar onImport={handleExcelImportOnRequestsDashboard} />
        </div>
    );
}

export default RequestsDashboard;