import React, { useState } from "react";
import BottomNavbar from "../components/layout/BottomNavbar";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardMainContent from "../components/dashboard/DashboardMainContent";

import mockUsers from "../data/mockUsers";

function Dashboard() {
    const [users, setUsers] = useState(mockUsers);


    const handleExcelImportOnDashboard = (data) => {
        setUsers((prevUsers) => [...prevUsers, ...data]);
    };

    return (
        <div className="d-flex flex-column vh-100">
            <DashboardHeader totalMembers={users.length} /> {}

            <DashboardMainContent onExcelImport={handleExcelImportOnDashboard} />

            <BottomNavbar onImport={handleExcelImportOnDashboard} />
        </div>
    );
}

export default Dashboard;