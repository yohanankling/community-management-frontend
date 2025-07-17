import React, { useState } from "react";
import BottomNavbar from "../components/layout/BottomNavbar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardMainContent from "../components/dashboard/DashboardMainContent";

import mockUsers from "../data/mockUsers";

/**
 * The main Dashboard component serves as the landing page for the application.
 * It orchestrates the display of various dashboard sections, including a header,
 * main content area, and a bottom navigation bar.
 *
 * This component manages the overall user data (though `setUsers` is currently unused
 * beyond the import functionality) and passes down necessary handlers for data operations
 * like Excel imports.
 */
function Dashboard() {
    // `users` state is initialized with `mockUsers`.
    // The `setUsers` function is primarily used here for demonstration of adding
    // imported Excel data to the existing users.
    const [, setUsers] = useState(mockUsers);


    /**
     * handleExcelImportOnDashboard is a callback function passed to child components
     * (like DashboardMainContent and BottomNavbar) to handle data imported from an Excel file.
     * When new user data is imported, it appends this data to the existing `users` state.
     * @param {Array} data - An array of user objects parsed from the Excel file.
     */
    const handleExcelImportOnDashboard = (data) => {
        // Updates the `users` state by appending the newly imported data.
        setUsers((prevUsers) => [...prevUsers, ...data]);
    };

    return (
        // The main container for the dashboard, using Bootstrap's flex utilities
        // to ensure it takes up the full viewport height and its children are arranged vertically.
        <div className="d-flex flex-column vh-100">
            {/* Renders the DashboardHeader component. This typically contains
                elements like the page title or user profile summary. */}
            <DashboardHeader />

            {/* Renders the DashboardMainContent component. This is the primary area
                where the dashboard's core features and data visualizations are displayed.
                The `onExcelImport` handler is passed down to allow content components
                to trigger an Excel import. */}
            <DashboardMainContent onExcelImport={handleExcelImportOnDashboard} />

            {/* Renders the BottomNavbar component. This acts as a persistent navigation bar
                at the bottom of the screen, often including quick actions or main navigation links.
                The `onImport` handler is passed to enable Excel import functionality directly from the navbar. */}
            <BottomNavbar onImport={handleExcelImportOnDashboard} />
        </div>
    );
}

export default Dashboard;