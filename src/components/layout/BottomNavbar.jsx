import React, { useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    HouseFill,
    PeopleFill,
    ChatDotsFill
} from 'react-bootstrap-icons';
import { handleExcelImport } from '../../services/excelService';

const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <HouseFill size={25} /> },
    { to: '/connections', label: 'Connections', icon: <ChatDotsFill size={25} /> },
    { to: '/import', label: 'Import', icon: <PeopleFill size={25} />, isImport: true },
];

function BottomNavbar({ onImport }) {
    const location = useLocation();
    const fileInputRef = useRef();
    const [importMessage, setImportMessage] = useState('');

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (file) {
            handleExcelImport(
                file,
                (data) => {
                    setImportMessage(`Imported ${data.length} users`);
                    onImport?.(data); // Pass data up to parent (Dashboard)
                    event.target.value = null;
                },
                (err) => setImportMessage(err)
            );
        }
    };

    return (
        <>
            {importMessage && <div className="text-center text-success small py-1" style={{ position: 'fixed', bottom: '60px', width: '100%', zIndex: 1000, backgroundColor: 'rgba(255,255,255,0.9)' }}>{importMessage}</div>}

            <Nav
                className="justify-content-around align-items-center bg-white border-top shadow-lg"
                style={{
                    position: 'fixed',
                    bottom: 0,
                    width: '100%',
                    height: '60px',
                    zIndex: 1020
                }}
            >
                {menuItems.map(({ to, label, icon, isImport }) => (
                    <Nav.Link
                        // Conditionally apply Link props for non-import items
                        {...(isImport ? {} : { as: Link, to: to })}
                        key={to}
                        className={`d-flex flex-column align-items-center justify-content-center p-0 ${
                            location.pathname === to ? 'text-primary' : 'text-secondary'
                        }`}
                        style={{ flex: 1, minWidth: 0, height: '100%', textDecoration: 'none' }}
                        onClick={isImport ? () => fileInputRef.current?.click() : undefined}
                    >
                        {React.cloneElement(icon, {
                            color: location.pathname === to ? "#0d6efd" : "#6c757d"
                        })}
                        <span className="small mt-1 d-none d-sm-block">{label}</span>
                        <span className="small mt-1 d-block d-sm-none">{label.split(' ')[0]}</span>
                    </Nav.Link>
                ))}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleImport}
                    style={{ display: 'none' }}
                />
            </Nav>
        </>
    );
}

export default BottomNavbar;