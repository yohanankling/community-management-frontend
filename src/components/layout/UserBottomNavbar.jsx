import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {
    HouseFill,
    ChatDotsFill // עבור היסטוריית חיבורים
} from 'react-bootstrap-icons';

// הגדרת פריטי התפריט עבור המשתמש הרגיל
const menuItems = [
    // מפנה לדשבורד המשתמש (My Profile)
    { to: '/user-dashboard', label: 'My Profile', icon: <HouseFill size={25} /> },
    // מפנה לחיבורים של המשתמש
    { to: '/connections', label: 'My Connections', icon: <ChatDotsFill size={25} /> },
    // הסרנו את האפשרות לייבוא קבצים (Import)
];

function UserBottomNavbar() {
    const location = useLocation();

    return (
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
            {menuItems.map(({ to, label, icon }) => (
                <Nav.Link
                    as={Link} // תמיד נשתמש ב-Link עבור פריטים אלו
                    to={to}
                    key={to}
                    className={`d-flex flex-column align-items-center justify-content-center p-0 ${
                        location.pathname === to ? 'text-primary' : 'text-secondary'
                    }`}
                    style={{ flex: 1, minWidth: 0, height: '100%', textDecoration: 'none' }}
                    // הסרנו את ה-onClick הקשור לייבוא
                >
                    {React.cloneElement(icon, {
                        color: location.pathname === to ? "#0d6efd" : "#6c757d"
                    })}
                    <span className="small mt-1 d-none d-sm-block">{label}</span>
                    <span className="small mt-1 d-block d-sm-none">{label.split(' ')[0]}</span>
                </Nav.Link>
            ))}
            {/* הסרנו את ה-input של הקובץ */}
        </Nav>
    );
}

export default UserBottomNavbar;