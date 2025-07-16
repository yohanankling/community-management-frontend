// src/NotFoundPage.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function NotFoundPage() {

    return (
        <div
            className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4">
            <div
                className="flex flex-col items-center text-center relative transform -translate-x-1/4 min-w-[320px] md:min-w-[400px]">
                {/* 🎯 Target */}
                <svg width="400" height="400" viewBox="0 0 400 400" className="mb-6">
                    <circle cx="200" cy="200" r="190" fill="#fecaca" stroke="#f87171" strokeWidth="8"/>
                    <circle cx="200" cy="200" r="130" fill="#f87171" stroke="#ef4444" strokeWidth="8"/>
                    <circle cx="200" cy="200" r="70" fill="#ef4444" stroke="#b91c1c" strokeWidth="8"/>
                </svg>

                {/* 🏹 Diagonal Arrow - Clearly missing the target */}
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 100 100"
                    className="absolute top-[-50px] left-[-50px] transform rotate-[300deg]"
                >
                    <polygon points="90,10 78,27 102,27" fill="#374151" transform="rotate(-75 80 20)"/>
                    <line x1="0" y1="100" x2="85" y2="10" stroke="#374151" strokeWidth="8" strokeLinecap="round"/>
                </svg>

                {/* Text */}
                <h1 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    TARGET NOT FOUND
                </h1>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 max-w-xs">
                    Looks like the arrow missed. The page you're looking for doesn’t exist.
                </p>
                {/* כפתור חדש להצגת התראה */}
                <a
                    href="https://site.target.co.il/"
                    className="btn btn-primary font-semibold py-2 px-4 rounded-full transition duration-300 mb-3"
                >
                    Back to Target
                </a>
                <br/>
                <Link // Use Link instead of <a>
                    to="/memory-game" // Point to the exact path defined in App.js
                    className="btn btn-primary font-semibold py-2 px-4 rounded-full transition duration-300 mb-3"
                >
                    or spend some time with us
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
