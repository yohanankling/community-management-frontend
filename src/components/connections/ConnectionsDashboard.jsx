import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import BottomNavbar from '../layout/BottomNavbar';
import DashboardCards from '../dashboard/DashboardCards';
import ConnectionsTable from './ConnectionsTable.jsx';
import mockUsers from '../../data/mockUsers';

import logo from '../../assets/logo.png';

function ConnectionsDashboard() {
    // Initializes the 'users' state with data from 'mockUsers'.
    // This state likely holds the data displayed or used for calculations within the dashboard.
    const [users, setUsers] = useState(mockUsers);

    // Defines a function to handle data imported from an Excel file.
    // This function is intended to be passed down to the `BottomNavbar` component,
    // which presumably contains the functionality for initiating Excel imports.
    const handleExcelImportOnConnectionsDashboard = (data) => {
        // Placeholder for the actual import logic.
        // In a real application, this would process the 'data'
        // and update the component's state or trigger further actions
        // related to connections.
        console.log("Importing data to Connections Dashboard (placeholder):", data);
    };

    return (
        // Establishes a flex container that occupies the full viewport height,
        // arranging its children in a column.
        <div className="d-flex flex-column vh-100">
            {/* Main content container for the dashboard. */}
            {/* It's fluid, has padding, a light background, and allows vertical scrolling */}
            {/* if content overflows. */}
            <Container
                fluid
                className="p-4 bg-light flex-grow-1 dashboard-main-content"
                style={{
                    overflowY: 'auto',
                }}
            >
                {/* Header section including a home button with a logo and a title. */}
                {/* It's styled with flexbox for alignment and has visual separation */}
                {/* at the bottom. */}
                <header style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                    {/* Link acting as a home button, navigating to the dashboard route. */}
                    <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        {/* Displays the application logo. */}
                        <img src={logo} alt="Home" style={{ height: '40px', marginRight: '10px' }} />
                    </a>
                    {/* Title for the connections table, indicating the current view. */}
                    <h2 className="mb-0 text-primary">Connections Table</h2>
                </header>

                {/* Renders a component that displays key metrics or summaries for the dashboard. */}
                {/* It receives the total number of users as a prop, derived from the 'users' state. */}
                <DashboardCards totalMembers={users.length} />

                {/* Renders the main table displaying connections data. */}
                <ConnectionsTable />

            </Container>
            {/* Renders the bottom navigation bar. */}
            {/* The 'onImport' prop passes the `handleExcelImportOnConnectionsDashboard` function, */}
            {/* allowing the navbar to trigger import actions when necessary. */}
            <BottomNavbar onImport={handleExcelImportOnConnectionsDashboard} />
        </div>
    );
}

export default ConnectionsDashboard;