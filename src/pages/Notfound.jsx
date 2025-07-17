import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

// NotFoundPage component displays a custom 404 error page.
function NotFoundPage() {

    return (
        // Main container div for the entire page, providing styling for centering and background.
        <div
            className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-4">
            {/* Inner container for the content, applying responsive sizing and positioning. */}
            <div
                className="flex flex-col items-center text-center relative transform -translate-x-1/4 min-w-[320px] md:min-w-[400px]">
                {/* SVG for the target graphic. */}
                <svg width="400" height="400" viewBox="0 0 400 400" className="mb-6">
                    {/* Outer red circle */}
                    <circle cx="200" cy="200" r="190" fill="#fecaca" stroke="#f87171" strokeWidth="8"/>
                    {/* Middle red circle */}
                    <circle cx="200" cy="200" r="130" fill="#f87171" stroke="#ef4444" strokeWidth="8"/>
                    {/* Inner red circle */}
                    <circle cx="200" cy="200" r="70" fill="#ef4444" stroke="#b91c1c" strokeWidth="8"/>
                </svg>

                {/* SVG for the diagonal arrow, positioned to appear as if it missed the target. */}
                <svg
                    width="200"
                    height="200"
                    viewBox="0 0 100 100"
                    className="absolute top-[-50px] left-[-50px] transform rotate-[300deg]"
                >
                    {/* Arrowhead polygon */}
                    <polygon points="90,10 78,27 102,27" fill="#374151" transform="rotate(-75 80 20)"/>
                    {/* Arrow shaft line */}
                    <line x1="0" y1="100" x2="85" y2="10" stroke="#374151" strokeWidth="8" strokeLinecap="round"/>
                </svg>

                {/* Heading indicating the error. */}
                <h1 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                    TARGET NOT FOUND
                </h1>
                {/* Descriptive paragraph for the error. */}
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4 max-w-xs">
                    Looks like the arrow missed. The page you're looking for doesn’t exist.
                </p>
                {/* Button linking back to a specific external target site. */}
                <a
                    href="https://site.target.co.il/"
                    className="btn btn-primary font-semibold py-2 px-4 rounded-full transition duration-300 mb-3"
                >
                    Back to Target
                </a>
                <br/>
                {/* Link component from react-router-dom for internal navigation to the memory game. */}
                <Link
                    to="/memory-game" // Specifies the internal path to navigate to.
                    className="btn btn-primary font-semibold py-2 px-4 rounded-full transition duration-300 mb-3"
                >
                    or spend some time with us
                </Link>
            </div>
        </div>
    );
}

export default NotFoundPage;
