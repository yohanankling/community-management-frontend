import React from 'react';
import { Container } from 'react-bootstrap';
import DashboardCards from './DashboardCards';
import logo from '../../assets/logo.png';

// Defines the DashboardHeader functional component, which receives 'totalMembers' as a prop.
function DashboardHeader({ totalMembers }) {
    return (
        // The main header element for the dashboard.
        <header>
            {/* A fluid Bootstrap Container component providing padding and a light background. */}
            <Container fluid className="p-4 bg-light">
                {/* A flex container for the home button (logo) and the dashboard title. */}
                {/* It includes styling for alignment, bottom padding, and a border. */}
                <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                    {/* A link that acts as a home button, navigating to the /dashboard route. */}
                    {/* It's styled to ensure the link text is invisible and only the logo is interactive. */}
                    <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        {/* Displays the application logo. */}
                        <img src={logo} alt="Home" style={{ height: '40px', marginRight: '10px' }} />
                    </a>
                    {/* The main title for the dashboard. */}
                    <h2 className="mb-0 text-primary">Dashboard</h2>
                </div>

                {/* Renders the DashboardCards component, passing the 'totalMembers' prop to it. */}
                {/* This component is responsible for displaying summary cards like total members, connections, and requests. */}
                <DashboardCards totalMembers={totalMembers} />
            </Container>
        </header>
    );
}

export default DashboardHeader;