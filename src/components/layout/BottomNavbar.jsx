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
    const [isUploading, setIsUploading] = useState(false);

    const handleImport = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true);
            setImportMessage('Uploading and processing file...');
            
            try {
                await handleExcelImport(
                    file,
                    (data) => {
                        setImportMessage(`Successfully imported ${data.length} users`);
                        onImport?.(data); // Pass data up to parent
                        event.target.value = null;
                        setIsUploading(false);
                        
                        // Clear message after 3 seconds
                        setTimeout(() => setImportMessage(''), 3000);
                    },
                    (err) => {
                        setImportMessage(`Error: ${err}`);
                        setIsUploading(false);
                        
                        // Clear error message after 5 seconds
                        setTimeout(() => setImportMessage(''), 5000);
                    }
                );
            } catch (error) {
                setImportMessage(`Error: ${error.message}`);
                setIsUploading(false);
                setTimeout(() => setImportMessage(''), 5000);
            }
        }
    };

    return (
        <>
            {importMessage && (
                <div 
                    className={`text-center small py-2 ${
                        isUploading ? 'text-info' : 
                        importMessage.includes('Error') ? 'text-danger' : 'text-success'
                    }`} 
                    style={{ 
                        position: 'fixed', 
                        bottom: '60px', 
                        width: '100%', 
                        zIndex: 1000, 
                        backgroundColor: 'rgba(255,255,255,0.95)',
                        borderTop: '1px solid #dee2e6'
                    }}
                >
                    {importMessage}
                </div>
            )}

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
                        } ${isImport && isUploading ? 'opacity-50' : ''}`}
                        style={{ flex: 1, minWidth: 0, height: '100%', textDecoration: 'none' }}
                        onClick={isImport ? (isUploading ? undefined : () => fileInputRef.current?.click()) : undefined}
                    >
                        {React.cloneElement(icon, {
                            color: location.pathname === to ? "#0d6efd" : "#6c757d"
                        })}
                        <span className="small mt-1 d-none d-sm-block">
                            {isImport && isUploading ? 'Uploading...' : label}
                        </span>
                        <span className="small mt-1 d-block d-sm-none">
                            {isImport && isUploading ? 'Wait...' : label.split(' ')[0]}
                        </span>
                    </Nav.Link>
                ))}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleImport}
                    disabled={isUploading}
                    style={{ display: 'none' }}
                />
            </Nav>
        </>
    );
}

export default BottomNavbar;