import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { Search, XCircleFill, ArrowCounterclockwise } from 'react-bootstrap-icons';

/**
 * UserSearch Component
 * This component encapsulates all search logic and UI.
 * It receives the full list of users and a callback function to return the filtered list.
 * It also handles responsive display, showing as a floating component on mobile.
 *
 * Props:
 * - users (Array): The full, unfiltered list of users.
 * - onFilteredUsersChange (Function): Callback to pass the filtered users back to the parent.
 */
function UserSearch({ users, onFilteredUsersChange }) {
    // State to control visibility of search input fields (toggle button vs. inputs)
    const [showSearchInput, setShowSearchInput] = useState(false);

    // State to hold the current search filter values for each field
    const [searchFilters, setSearchFilters] = useState({
        fullName: "",
        role: "",
        yearsOfExperience: "",
    });

    // State to detect if the device is mobile (for responsive floating behavior)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Bootstrap's 'md' breakpoint

    // Effect to handle window resize and update isMobile state
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /**
     * Toggles the visibility of the search input fields.
     * This function now ONLY toggles the visibility and DOES NOT clear filters.
     */
    const handleSearchToggle = () => {
        setShowSearchInput(prev => !prev);
    };

    /**
     * Handles changes in individual search input fields.
     * Updates the corresponding filter value in the searchFilters state.
     * @param {string} filterName - The name of the filter field (e.g., "fullName", "role").
     * @param {string} value - The new value for the filter field.
     */
    const handleSearchFilterChange = (filterName, value) => {
        setSearchFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    /**
     * Clears all search filters.
     * This is a dedicated function for a "Clear All" button.
     */
    const handleClearAllFilters = () => {
        setSearchFilters({
            fullName: "",
            role: "",
            yearsOfExperience: "",
        });
    };

    /**
     * Memoized function to perform filtering whenever 'users' data or 'searchFilters' change.
     * It then calls the 'onFilteredUsersChange' callback to update the parent component.
     */
    const filterAndNotifyParent = useCallback(() => {
        const filtered = users.filter(user => {
            // Check if no filters are applied at all
            const noFiltersApplied = Object.values(searchFilters).every(filterValue => !filterValue);
            if (noFiltersApplied) {
                return true; // If no filters, show all users
            }

            // Check if user's full name matches the search filter (case-insensitive)
            const matchesFullName = searchFilters.fullName
                ? user.fullName.toLowerCase().includes(searchFilters.fullName.toLowerCase())
                : true; // If no full name filter, always matches

            // Check if user's role matches the search filter (case-insensitive)
            const matchesRole = searchFilters.role
                ? user.role.toLowerCase().includes(searchFilters.role.toLowerCase())
                : true; // If no role filter, always matches

            // Check if user's years of experience matches the search filter (string comparison for partial matches)
            const matchesYearsOfExperience = searchFilters.yearsOfExperience
                ? String(user.yearsOfExperience || '').includes(searchFilters.yearsOfExperience) // Handle undefined/null yearsOfExperience
                : true; // If no years of experience filter, always matches

            // A user passes the filter only if they match ALL applied filters
            return matchesFullName && matchesRole && matchesYearsOfExperience;
        });

        // Call the callback function to send the filtered users back to the parent
        onFilteredUsersChange(filtered);

    }, [users, searchFilters, onFilteredUsersChange]); // Dependencies for useEffect

    // Effect to trigger filtering when dependencies change
    useEffect(() => {
        filterAndNotifyParent();
    }, [filterAndNotifyParent]); // Dependencies for useEffect

    // Render the search UI
    return (
        <div className="d-flex align-items-center">
            {showSearchInput && isMobile ? (
                // Floating search component for mobile
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', // Semi-transparent overlay
                    zIndex: 1050, // Ensure it's above other content
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                        width: '90%', // Take up most of the screen width
                        maxWidth: '500px', // Max width for larger mobile devices
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        position: 'relative'
                    }}>
                        {/* Close button for the floating modal */}
                        <Button
                            variant="light"
                            className="position-absolute top-0 end-0 m-2"
                            onClick={handleSearchToggle} // This now only closes the modal
                            aria-label="Close search"
                        >
                            <XCircleFill size={24} />
                        </Button>
                        <h5 className="mb-3 text-primary">Search Members</h5>
                        <div className="d-flex flex-column align-items-stretch"> {/* flex-column for stacking inputs */}
                            {/* Input for Full Name search */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small mb-1">Full Name</Form.Label>
                                <InputGroup> {/* Added InputGroup for the clear button */}
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Name..."
                                        value={searchFilters.fullName}
                                        onChange={(e) => handleSearchFilterChange("fullName", e.target.value)}
                                        aria-label="Search by full name"
                                    />
                                    {searchFilters.fullName && ( // Show clear button only if filter has value
                                        <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("fullName", "")}>
                                            <XCircleFill size={16} />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>

                            {/* Input for Role search */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small mb-1">Role</Form.Label>
                                <InputGroup> {/* Added InputGroup for the clear button */}
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Role..."
                                        value={searchFilters.role}
                                        onChange={(e) => handleSearchFilterChange("role", e.target.value)}
                                        aria-label="Search by role"
                                    />
                                    {searchFilters.role && ( // Show clear button only if filter has value
                                        <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("role", "")}>
                                            <XCircleFill size={16} />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>

                            {/* Input for Years of Experience search */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small mb-1">Years Experience</Form.Label>
                                <InputGroup> {/* Added InputGroup for the clear button */}
                                    <Form.Control
                                        type="number"
                                        placeholder="Years Exp..."
                                        value={searchFilters.yearsOfExperience}
                                        onChange={(e) => handleSearchFilterChange("yearsOfExperience", e.target.value)}
                                        min="0"
                                        aria-label="Search by years of experience"
                                    />
                                    {searchFilters.yearsOfExperience && ( // Show clear button only if filter has value
                                        <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("yearsOfExperience", "")}>
                                            <XCircleFill size={16} />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>

                            {/* Clear All Filters Button */}
                            <Button variant="outline-secondary" className="mt-3" onClick={handleClearAllFilters}>
                                <ArrowCounterclockwise size={18} className="me-2" /> Clear All Filters
                            </Button>
                        </div>
                    </div>
                </div>
            ) : showSearchInput && !isMobile ? (
                // Inline search component for desktop
                <div className="d-flex flex-wrap align-items-center me-2 flex-grow-1">
                    {/* Input for Full Name search */}
                    <InputGroup className="mb-2 mb-md-0 me-2" style={{ maxWidth: '200px' }}>
                        <Form.Control
                            type="text"
                            placeholder="Search Name..."
                            value={searchFilters.fullName}
                            onChange={(e) => handleSearchFilterChange("fullName", e.target.value)}
                            aria-label="Search by full name"
                        />
                        {searchFilters.fullName && ( // Show clear button only if filter has value
                            <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("fullName", "")}>
                                <XCircleFill size={16} />
                            </Button>
                        )}
                    </InputGroup>

                    {/* Input for Role search */}
                    <InputGroup className="mb-2 mb-md-0 me-2" style={{ maxWidth: '150px' }}>
                        <Form.Control
                            type="text"
                            placeholder="Search Role..."
                            value={searchFilters.role}
                            onChange={(e) => handleSearchFilterChange("role", e.target.value)}
                            aria-label="Search by role"
                        />
                        {searchFilters.role && ( // Show clear button only if filter has value
                            <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("role", "")}>
                                <XCircleFill size={16} />
                            </Button>
                        )}
                    </InputGroup>

                    {/* Input for Years of Experience search */}
                    <InputGroup className="mb-2 mb-md-0 me-2" style={{ maxWidth: '150px' }}>
                        <Form.Control
                            type="number"
                            placeholder="Years Exp..."
                            value={searchFilters.yearsOfExperience}
                            onChange={(e) => handleSearchFilterChange("yearsOfExperience", e.target.value)}
                            min="0"
                            aria-label="Search by years of experience"
                        />
                        {searchFilters.yearsOfExperience && ( // Show clear button only if filter has value
                            <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("yearsOfExperience", "")}>
                                <XCircleFill size={16} />
                            </Button>
                        )}
                    </InputGroup>

                    {/* Clear All Filters Button for desktop */}
                    <Button variant="outline-secondary" className="ms-2" onClick={handleClearAllFilters}>
                        <ArrowCounterclockwise size={18} className="me-2" /> Clear All
                    </Button>

                    {/* Button to close/clear search (only closes the inline search, filters remain) */}
                    <Button variant="outline-danger" onClick={handleSearchToggle} aria-label="Close search">
                        <XCircleFill size={18} />
                    </Button>
                </div>
            ) : (
                // Display the search toggle button when search is not active
                <Button variant="outline-secondary" size="sm" onClick={handleSearchToggle} className="me-2" aria-label="Open search">
                    <Search size={15} /> Search
                </Button>
            )}
        </div>
    );
}

export default UserSearch;