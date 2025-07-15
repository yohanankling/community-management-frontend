// src/pages/ConnectionsDashboard.jsx (or wherever you prefer your page components)
import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import BottomNavbar from '../layout/BottomNavbar';
import DashboardCards from '../dashboard/DashboardCards';
import ConnectionsTable from './ConnectionsTable.jsx'; // Import the new connections table
import mockUsers from '../../data/mockUsers'; // Assuming you still need this for totalMembers

import logo from '../../assets/logo.png'; // Import the logo from the correct path

function ConnectionsDashboard() {
    // You'll likely need the total number of users for DashboardCards
    const [users, setUsers] = useState(mockUsers);

    // This function would be passed to BottomNavbar if it has Excel import functionality
    const handleExcelImportOnConnectionsDashboard = (data) => {
        // Handle import logic if needed for this dashboard
        console.log("Importing data to Connections Dashboard (placeholder):", data);
        // If importing connections, you'd update connection-related state here.
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
                {/* Home Page Button with Logo */}
                <header style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                    <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Home" style={{ height: '40px', marginRight: '10px' }} />
                    </a>
                    <h2 className="mb-0 text-primary">Connections Table</h2>
                </header>

                {/* The original title is replaced by the home button or can be adjusted */}
                {/* <h2 className="mb-4 text-primary">Community Connections Overview</h2> */}

                {/* Dashboard Cards at the top */}
                <DashboardCards totalMembers={users.length} />

                {/* Connections Table replacing the Users Table */}
                <ConnectionsTable />

            </Container>
            <BottomNavbar onImport={handleExcelImportOnConnectionsDashboard} />
        </div>
    );
}

export default ConnectionsDashboard;