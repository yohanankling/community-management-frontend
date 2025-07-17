import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    Table,
    Button,
    Alert,
    FormControl,
    InputGroup,
    Spinner
} from 'react-bootstrap';
import {
    PersonCircle,
    BriefcaseFill,
    Calendar3Fill,
    Linkedin,
    ThreeDotsVertical,
    Stars,
} from 'react-bootstrap-icons';
import UserSearch from '../UserSearch';
import { sendAiPrompt } from '../../services/aiService';

// DashboardTable component displays a table of community members with search and AI search functionalities.
// It receives 'users' (all users), 'onShowAddUserModal' (callback to open add user modal),
// and 'onRowClick' (callback for clicking on a user row) as props.
function DashboardTable({
                            users,
                            onShowAddUserModal,
                            onRowClick,
                        }) {
    // State for the AI search input field.
    const [aiSearchInput, setAiSearchInput] = useState('');
    // State to store the results from the AI search.
    const [aiSearchResults, setAiSearchResults] = useState([]);
    // State to indicate if an AI search is currently in progress.
    const [aiSearchLoading, setAiSearchLoading] = useState(false);
    // State to store users filtered by the regular (non-AI) user search component.
    const [userSearchFilteredUsers, setUserSearchFilteredUsers] = useState(users);
    // State to store the final list of users currently displayed in the table.
    const [currentDisplayUsers, setCurrentDisplayUsers] = useState(users);

    // useEffect hook to update 'currentDisplayUsers' whenever 'userSearchFilteredUsers' or 'aiSearchResults' change.
    // This logic ensures the table displays the correct set of users based on search states.
    useEffect(() => {
        let finalUsersToDisplay;
        // If AI search has results, those results are the base for further filtering.
        // Otherwise, the original 'users' list (or a filtered version by regular search) is used.
        if (aiSearchResults.length > 0) {
            finalUsersToDisplay = aiSearchResults; // When AI results are present, they override other filters for display.
        } else {
            finalUsersToDisplay = userSearchFilteredUsers; // Otherwise, use the results from the regular user search.
        }
        setCurrentDisplayUsers(finalUsersToDisplay);
    }, [userSearchFilteredUsers, aiSearchResults, users]); // Added 'users' to dependency array to ensure initial load.

    // Asynchronous function to handle AI search queries.
    const handleAiSearch = async () => {
        // If the AI search input is empty, clear AI search results and reset to regular filtered users.
        if (!aiSearchInput.trim()) {
            setAiSearchResults([]);
            setUserSearchFilteredUsers(users); // Resetting to the original users list filtered by regular search.
            return;
        }

        setAiSearchLoading(true); // Set loading state to true.
        try {
            // Send the AI prompt to the backend service.
            const result = await sendAiPrompt(aiSearchInput);
            // Update AI search results and then use them as the base for display.
            setAiSearchResults(result);
            setUserSearchFilteredUsers(result); // Update userSearchFilteredUsers with AI results for consistent display logic.
        } catch (error) {
            // Log error and clear AI search results if the call fails.
            console.error('Error sending AI prompt:', error);
            setAiSearchResults([]);
            setUserSearchFilteredUsers(users); // Revert to original users on error.
        } finally {
            setAiSearchLoading(false); // Set loading state to false.
        }
    };

    // Callback function to update the list of users filtered by the `UserSearch` component.
    // Memoized with `useCallback` to prevent unnecessary re-renders of child components.
    const handleUserSearchFilteredUsersChange = useCallback((filteredList) => {
        setUserSearchFilteredUsers(filteredList);
    }, []);

    return (
        // Main card container for the dashboard table, with styling for shadow and rounded corners.
        <Card className="mt-4 shadow-sm border-0 rounded-3">
            {/* Card header containing the title, AI search input, and add user button. */}
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                {/* Table title with a PersonCircle icon. */}
                <h5 className="mb-0 d-flex align-items-center">
                    <PersonCircle size={20} className="me-2" /> Community Members
                </h5>
                {/* Input group for AI search. */}
                <InputGroup className="w-25 me-2">
                    <FormControl
                        type="text"
                        placeholder="AI SEARCH"
                        aria-label="AI search input"
                        value={aiSearchInput}
                        onChange={(e) => setAiSearchInput(e.target.value)}
                        onKeyPress={(e) => {
                            // Trigger AI search when Enter key is pressed.
                            if (e.key === 'Enter') {
                                handleAiSearch();
                            }
                        }}
                    />
                    {/* Button to trigger AI search. Displays a spinner when loading. */}
                    <Button variant="outline-info" onClick={handleAiSearch} disabled={aiSearchLoading}>
                        {aiSearchLoading ? <Spinner animation="border" size="sm" /> : <Stars size={15} />} AI
                    </Button>
                </InputGroup>
                {/* Container for the regular user search and add user button. */}
                <div className="d-flex align-items-center">
                    {/* UserSearch component for regular filtering of users. */}
                    {/* It receives either AI search results or the full user list as its data source. */}
                    <UserSearch
                        users={aiSearchResults.length > 0 ? aiSearchResults : users}
                        onFilteredUsersChange={handleUserSearchFilteredUsersChange}
                    />
                    {/* Button to open the Add User modal. */}
                    <Button variant="outline-primary" size="sm" onClick={onShowAddUserModal}>
                        Add <PersonCircle size={15} />
                    </Button>
                </div>
            </Card.Header>
            {/* Card body containing the main user table. */}
            <Card.Body className="p-0" style={{ minHeight: '300px' }}>
                {/* Bootstrap Table component with hover effect and responsive design. */}
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="table-light">
                    <tr>
                        {/* Table header for Name column with an icon. */}
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <PersonCircle size={20} />
                                <span>Name</span>
                            </div>
                        </th>
                        {/* Table header for Role column with an icon. */}
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <BriefcaseFill size={20} />
                                <span>Role</span>
                            </div>
                        </th>
                        {/* Table header for Years of Experience column with an icon. */}
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <Calendar3Fill size={20} />
                                <span>Years</span>
                            </div>
                        </th>
                        {/* Table header for LinkedIn column with an icon. */}
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <Linkedin size={20} />
                                <span>LinkedIn</span>
                            </div>
                        </th>
                        {/* Empty header for the actions column. */}
                        <th className="text-center"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {/* Conditional rendering: if there are users to display. */}
                    {currentDisplayUsers.length > 0 ? (
                        // Map over `currentDisplayUsers` to render each user as a table row.
                        currentDisplayUsers.map((user) => (
                            <tr
                                key={user.user_id || user.id} // Use user_id or id as key for uniqueness.
                                className="align-middle"
                            >
                                {/* Display user's name, potentially with an AI score. */}
                                <td className="text-center">
                                    {user.english_name || user.fullName}
                                    {user.score !== undefined && ` (${user.score})`}
                                </td>
                                {/* Display user's role. */}
                                <td className="text-center">{user.role}</td>
                                {/* Display user's years of experience. */}
                                <td className="text-center">{user.years_of_xp || user.yearsOfExperience}</td>
                                {/* Display LinkedIn link. */}
                                <td className="text-center">
                                    {user.linkedin_url || user.linkedin ? (
                                        // If a LinkedIn URL is provided, use it.
                                        <Button variant="link" className="p-0 text-primary" href={user.linkedin_url || user.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Linkedin size={25} />
                                        </Button>
                                    ) : (
                                        // Otherwise, try to construct a LinkedIn URL from the user's name.
                                        <Button variant="link" className="p-0 text-primary" href={`https://www.linkedin.com/in/${(user.english_name || user.fullName).replace(/\s/g, '-').toLowerCase()}`} target="_blank" rel="noopener noreferrer">
    <Linkedin size={25} />
</Button>
)}
</td>
{/* Action button for each row, opens user details modal. */}
<td className="text-center">
    <Button
        variant="light"
        size="sm"
        onClick={(e) => {
            e.stopPropagation(); // Prevent row click from firing when button is clicked.
            onRowClick(user); // Call the onRowClick prop with the current user.
        }}
        className="p-1"
    >
        <ThreeDotsVertical size={20} />
    </Button>
</td>
</tr>
))
) : (
    // If no users are found, display a loading spinner for AI search or an alert.
    <tr>
        <td colSpan="5" className="text-center py-3">
            {aiSearchLoading ? (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading AI search...</span>
                </Spinner>
            ) : (
                <Alert variant="info" className="mb-0">
                    No users found matching your criteria.
                </Alert>
            )}
        </td>
    </tr>
)}
</tbody>
</Table>
</Card.Body>
</Card>
);
}

export default DashboardTable;