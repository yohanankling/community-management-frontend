import React, { useState, useEffect } from 'react';
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
import { sendAiPrompt } from '../../services/aiService'; // Import sendAiPrompt

function DashboardTable({
                            users,
                            onFilteredUsersChange, // Keep this if UserSearch still filters the original 'users'
                            onShowAddUserModal,
                            onRowClick,
                        }) {
    const [aiSearchInput, setAiSearchInput] = useState('');
    const [aiSearchResults, setAiSearchResults] = useState([]); // Initialize as empty array
    const [aiSearchLoading, setAiSearchLoading] = useState(false);
    const [currentDisplayUsers, setCurrentDisplayUsers] = useState(users); // New state for users displayed in table

    // Update currentDisplayUsers when 'users' prop changes or when AI search results are available
    useEffect(() => {
        if (aiSearchResults.length > 0) {
            setCurrentDisplayUsers(aiSearchResults);
        } else {
            setCurrentDisplayUsers(users); // Revert to original users if AI results are cleared
        }
    }, [users, aiSearchResults]);


    const handleAiSearch = async () => {
        if (!aiSearchInput.trim()) {
            console.log('AI search input is empty. Displaying all users.');
            setAiSearchResults([]); // Clear AI search results to display all users
            return;
        }

        setAiSearchLoading(true);
        try {
            const result = await sendAiPrompt(aiSearchInput); // Send prompt to AI service
            console.log('AI Search Results:', result);
            // Assuming 'result' is an array of user objects directly
            setAiSearchResults(result);
        } catch (error) {
            console.error('Error sending AI prompt:', error);
            setAiSearchResults([]); // Clear results on error
            // Optionally, you might want to show an alert on the UI for the error
        } finally {
            setAiSearchLoading(false);
        }
    };

    return (
        <Card className="mt-4 shadow-sm border-0 rounded-3">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                    <PersonCircle size={20} className="me-2" /> Community Members
                </h5>
                <InputGroup className="w-25 me-2">
                    <FormControl
                        type="text"
                        placeholder="AI SEARCH"
                        aria-label="AI search input"
                        value={aiSearchInput}
                        onChange={(e) => setAiSearchInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleAiSearch();
                            }
                        }}
                    />
                    <Button variant="outline-info" onClick={handleAiSearch} disabled={aiSearchLoading}>
                        {aiSearchLoading ? <Spinner animation="border" size="sm" /> : <Stars size={15} />} AI
                    </Button>
                </InputGroup>
                <div className="d-flex align-items-center">
                    {/* UserSearch might need adjustment if you want it to filter AI results too */}
                    <UserSearch
                        users={users} // UserSearch still operates on the original full list
                        onFilteredUsersChange={onFilteredUsersChange}
                    />
                    <Button variant="outline-primary" size="sm" onClick={onShowAddUserModal}>
                        Add <PersonCircle size={15} />
                    </Button>
                </div>
            </Card.Header>
            <Card.Body className="p-0" style={{ minHeight: '300px' }}>
                <Table hover responsive className="mb-0 align-middle">
                    <thead className="table-light">
                    <tr>
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <PersonCircle size={20} />
                                <span>Name</span>
                            </div>
                        </th>
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <BriefcaseFill size={20} />
                                <span>Role</span>
                            </div>
                        </th>
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <Calendar3Fill size={20} />
                                <span>Years</span>
                            </div>
                        </th>
                        <th className="text-center">
                            <div className="d-flex flex-column align-items-center">
                                <Linkedin size={20} />
                                <span>LinkedIn</span>
                            </div>
                        </th>
                        <th className="text-center"></th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentDisplayUsers.length > 0 ? (
                        currentDisplayUsers.map((user) => (
                            <tr
                                key={user.user_id || user.id}
                                className="align-middle"
                            >
                                <td className="text-center">
                                    {user.english_name || user.fullName}
                                    {user.score !== undefined && ` (${user.score})`} {/* Display score if it exists */}
                                </td>
                                <td className="text-center">{user.role}</td>
                                <td className="text-center">{user.years_of_xp || user.yearsOfExperience}</td>
                                <td className="text-center">
                                    {user.linkedin_url || user.linkedin ? (
                                        <Button variant="link" className="p-0 text-primary" href={user.linkedin_url || user.linkedin} target="_blank" rel="noopener noreferrer">
                                            <Linkedin size={25} />
                                        </Button>
                                    ) : (
                                        <Button variant="link" className="p-0 text-primary" href={`https://www.linkedin.com/in/${(user.english_name || user.fullName).replace(/\s/g, '-').toLowerCase()}`} target="_blank" rel="noopener noreferrer">
                                            <Linkedin size={25} />
                                        </Button>
                                    )}
                                </td>
                                <td className="text-center">
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRowClick(user);
                                        }}
                                        className="p-1"
                                    >
                                        <ThreeDotsVertical size={20} />
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-3">
                                <Alert variant="info" className="mb-0">
                                    No users found matching your search criteria.
                                </Alert>
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