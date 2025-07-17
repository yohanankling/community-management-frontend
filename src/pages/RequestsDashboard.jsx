import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import BottomNavbar from '../components/layout/BottomNavbar';
import DashboardCards from '../components/dashboard/DashboardCards';
import RequestsTable from '../components/RequestsTable';
import mockUsers from '../data/mockUsers';

import logo from '../assets/logo.png';

// The RequestsDashboard component displays a dashboard for managing requests.
function RequestsDashboard() {
    // State variable to store user data, initialized with mock data.
    // This variable is used to determine the total number of members displayed in the dashboard cards.
    const [users, setUsers] = useState(mockUsers);

    // Placeholder function to handle data imported from an Excel file.
    // This function currently logs the imported data to the console.
    const handleExcelImportOnRequestsDashboard = (data) => {
        console.log("Importing data to Requests Dashboard (placeholder):", data);
    };

    // Render the dashboard's user interface.
    return (
        // Main container div that sets up a flexible column layout to occupy the full viewport height.
        <div className="d-flex flex-column vh-100">
            {/* The main content area of the dashboard, configured to grow and allow vertical scrolling. */}
            <Container
                fluid
                className="p-4 bg-light flex-grow-1 dashboard-main-content"
                style={{
                    overflowY: 'auto', // Enables vertical scrolling if content overflows.
                }}
            >
                {/* The header section of the dashboard, including the logo and page title. */}
                <header style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                    {/* Link to the main dashboard page, displaying the application logo. */}
                    <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Home" style={{ height: '40px', marginRight: '10px' }} />
                    </a>
                    {/* The title of the current dashboard page. */}
                    <h2 className="mb-0 text-primary">Requests</h2>
                </header>

                {/* The DashboardCards component, which displays summary cards.
                    It receives the total number of members from the 'users' state. */}
                <DashboardCards totalMembers={users.length} />

                {/* The RequestsTable component, which displays a table of requests. */}
                <RequestsTable />

            </Container>
            {/* The BottomNavbar component, which includes an import functionality.
                The handleExcelImportOnRequestsDashboard function is passed as a prop to handle import operations. */}
            <BottomNavbar onImport={handleExcelImportOnRequestsDashboard} />
        </div>
    );
}

export default RequestsDashboard;
