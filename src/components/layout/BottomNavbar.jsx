import React, { useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    HouseFill,
    PeopleFill,
    ChatDotsFill
} from 'react-bootstrap-icons';
import { handleExcelImport } from '../../services/excelService';

// Defines the navigation items for the bottom navigation bar.
// Each item includes a path ('to'), a display label, an icon,
// and an optional 'isImport' flag to indicate an import action.
const menuItems = [
    { to: '/dashboard', label: 'Dashboard', icon: <HouseFill size={25} /> },
    { to: '/connections', label: 'Connections', icon: <ChatDotsFill size={25} /> },
    { to: '/import', label: 'Import', icon: <PeopleFill size={25} />, isImport: true },
];

// BottomNavbar component renders a fixed bottom navigation bar.
// It receives an 'onImport' prop, which is a callback function
// to be executed when an Excel file is successfully imported.
function BottomNavbar({ onImport }) {
    // `useLocation` hook from React Router to get the current URL path,
    // which helps in highlighting the active navigation item.
    const location = useLocation();
    // `useRef` hook to create a direct reference to the hidden file input element.
    const fileInputRef = useRef();
    // State to store messages related to the import process (e.g., success, error, uploading status).
    const [importMessage, setImportMessage] = useState('');
    // State to track whether a file upload/processing is currently in progress.
    const [isUploading, setIsUploading] = useState(false);

    // Asynchronous function to handle the Excel file import.
    const handleImport = async (event) => {
        // Gets the first selected file from the input event.
        const file = event.target.files[0];
        if (file) {
            setIsUploading(true); // Set uploading state to true.
            setImportMessage('Uploading and processing file...'); // Display an initial message.

            try {
                // Calls the `handleExcelImport` service function, passing the file
                // and success/error callback functions.
                await handleExcelImport(
                    file,
                    (data) => {
                        // On successful import, set a success message,
                        // call the parent's `onImport` callback with the imported data,
                        // reset the file input, and set uploading to false.
                        setImportMessage(`Successfully imported ${data.length} users`);
                        onImport?.(data); // Safely call onImport if it's provided.
                        event.target.value = null; // Clear the input so the same file can be selected again.
                        setIsUploading(false);

                        // Clear the success message after 3 seconds.
                        setTimeout(() => setImportMessage(''), 3000);
                    },
                    (err) => {
                        // On error, set an error message and set uploading to false.
                        setImportMessage(`Error: ${err}`);
                        setIsUploading(false);

                        // Clear the error message after 5 seconds.
                        setTimeout(() => setImportMessage(''), 5000);
                    }
                );
            } catch (error) {
                // Catch any uncaught errors during the import process.
                setImportMessage(`Error: ${error.message}`);
                setIsUploading(false);
                setTimeout(() => setImportMessage(''), 5000);
            }
        }
    };

    return (
        <>
            {/* Conditionally renders an import message bar. */}
            {importMessage && (
                <div
                    className={`text-center small py-2 ${
                        // Dynamically apply text color based on message type (uploading, error, success).
                        isUploading ? 'text-info' :
                            importMessage.includes('Error') ? 'text-danger' : 'text-success'
                    }`}
                    style={{
                        position: 'fixed', // Fixed position at the bottom of the viewport.
                        bottom: '60px', // Just above the navigation bar.
                        width: '100%',
                        zIndex: 1000,
                        backgroundColor: 'rgba(255,255,255,0.95)', // Semi-transparent white background.
                        borderTop: '1px solid #dee2e6'
                    }}
                >
                    {importMessage}
                </div>
            )}

            {/* Main navigation bar container. */}
            <Nav
                className="justify-content-around align-items-center bg-white border-top shadow-lg"
                style={{
                    position: 'fixed', // Fixed position at the very bottom of the viewport.
                    bottom: 0,
                    width: '100%',
                    height: '60px', // Fixed height for the navigation bar.
                    zIndex: 1020 // Ensures it's above other content.
                }}
            >
                {/* Maps over the `menuItems` array to render each navigation link. */}
                {menuItems.map(({ to, label, icon, isImport }) => (
                    <Nav.Link
                        // Conditionally apply `as={Link}` and `to` props for navigation items
                        // (not for the import item, which uses an onClick handler).
                        {...(isImport ? {} : { as: Link, to: to })}
                        key={to}
                        className={`d-flex flex-column align-items-center justify-content-center p-0 ${
                            // Apply 'text-primary' if the current path matches the item's path, otherwise 'text-secondary'.
                            location.pathname === to ? 'text-primary' : 'text-secondary'
                        } ${isImport && isUploading ? 'opacity-50' : ''}`} // Reduce opacity if import is in progress.
                        style={{ flex: 1, minWidth: 0, height: '100%', textDecoration: 'none' }}
                        // Define onClick behavior: for import item, trigger file input click; otherwise, undefined.
                        // Disable click if an upload is in progress.
                        onClick={isImport ? (isUploading ? undefined : () => fileInputRef.current?.click()) : undefined}
                    >
                        {/* Clones the icon element and sets its color based on the active state. */}
                        {React.cloneElement(icon, {
                            color: location.pathname === to ? "#0d6efd" : "#6c757d"
                        })}
                        {/* Display the full label for larger screens. */}
                        <span className="small mt-1 d-none d-sm-block">
                            {isImport && isUploading ? 'Uploading...' : label}
                        </span>
                        {/* Display a shortened label for smaller screens (e.g., 'Wait...' for upload). */}
                        <span className="small mt-1 d-block d-sm-none">
                            {isImport && isUploading ? 'Wait...' : label.split(' ')[0]}
                        </span>
                    </Nav.Link>
                ))}

                {/* Hidden file input element that is programmatically clicked. */}
                <input
                    ref={fileInputRef} // Associates the ref with this input.
                    type="file"
                    accept=".xlsx, .xls" // Specifies accepted file types (Excel files).
                    onChange={handleImport} // Calls `handleImport` when a file is selected.
                    disabled={isUploading} // Disables the input if an upload is in progress.
                    style={{ display: 'none' }} // Hides the actual input element.
                />
            </Nav>
        </>
    );
}

export default BottomNavbar;