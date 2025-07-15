import React from 'react';
import { Container } from 'react-bootstrap';
import DashboardCards from './DashboardCards';
import logo from '../../assets/logo.png';

function DashboardHeader({ totalMembers }) {
    return (
        <header>
            <Container fluid className="p-4 bg-light">
                <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', borderBottom: '1px solid #eee', marginBottom: '20px' }}>
                    <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Home" style={{ height: '40px', marginRight: '10px' }} />
                    </a>
                    <h2 className="mb-0 text-primary">Dashboard</h2>
                </div>

                <DashboardCards totalMembers={totalMembers} />
            </Container>
        </header>
    );
}

export default DashboardHeader;