import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    HouseFill,
    ChatDotsFill
} from 'react-bootstrap-icons';

// Defines the navigation items specifically for the regular user's bottom navigation bar.
// Each item includes a path ('to'), a display label, and an icon.
const menuItems = [
    // Navigates to the user's dashboard, labeled "My Profile".
    { to: '/user-dashboard', label: 'My Profile', icon: <HouseFill size={25} /> },
    // Navigates to the user's connections history, labeled "My Connections".
    { to: '/connections', label: 'My Connections', icon: <ChatDotsFill size={25} /> },
];

// UserBottomNavbar component renders a fixed bottom navigation bar tailored for regular users.
// Unlike the admin version, it does not include file import functionality.
function UserBottomNavbar() {
    // `useLocation` hook from React Router is used to get the current URL path.
    // This allows the component to highlight the navigation item that corresponds to the active route.
    const location = useLocation();

    return (
        // The main navigation container provided by React-Bootstrap.
        // It's styled to be fixed at the bottom, span full width, have a specific height,
        // and maintain a high z-index to stay above other content.
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
            {/* Iterates over the `menuItems` array to render each navigation link. */}
            {menuItems.map(({ to, label, icon }) => (
                <Nav.Link
                    as={Link} // Specifies that this Nav.Link should render as a React Router Link.
                    to={to} // The destination path for the link.
                    key={to} // Unique key for list rendering, typically the path itself.
                    // Dynamic classes for styling:
                    // - `d-flex flex-column align-items-center justify-content-center p-0`: Centers content vertically and horizontally within the link.
                    // - `text-primary` or `text-secondary`: Changes text color based on whether the link's path matches the current location.
                    className={`d-flex flex-column align-items-center justify-content-center p-0 ${
                        location.pathname === to ? 'text-primary' : 'text-secondary'
                    }`}
                    // Inline styles for flex behavior, minimum width, full height, and no text decoration.
                    style={{ flex: 1, minWidth: 0, height: '100%', textDecoration: 'none' }}
                >
                    {/* Clones the icon element and explicitly sets its color based on the active state. */}
                    {React.cloneElement(icon, {
                        color: location.pathname === to ? "#0d6efd" : "#6c757d"
                    })}
                    {/* Displays the full label for larger screens. */}
                    <span className="small mt-1 d-none d-sm-block">{label}</span>
                    {/* Displays a shortened version of the label (first word) for smaller screens. */}
                    <span className="small mt-1 d-block d-sm-none">{label.split(' ')[0]}</span>
                </Nav.Link>
            ))}
        </Nav>
    );
}

export default UserBottomNavbar;