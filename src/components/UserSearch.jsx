import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Button, InputGroup, Dropdown } from 'react-bootstrap';
import { Search, XCircleFill, ArrowCounterclockwise } from 'react-bootstrap-icons';

// Styles for the dropdown toggle button to ensure consistent appearance.
const dropdownToggleStyle = {
    backgroundColor: '#dee2e6',
    color: '#495057',
    border: '1px solid #ced4da',
    fontSize: '0.9em',
};

// Styles for the dropdown menu, including max height and overflow for scrollability.
const dropdownMenuStyle = {
    maxHeight: '200px',
    overflowY: 'auto',
    width: 'auto',
    minWidth: '200px',
};

// Default styles for individual dropdown items.
const dropdownItemStyle = {
    padding: '0.5em 1em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
    backgroundColor: '#ffffff !important',
    color: '#495057 !important',
};

// Styles for dropdown items when they are selected (checked).
const dropdownItemCheckedStyle = {
    ...dropdownItemStyle,
    backgroundColor: '#e7f1ff !important',
    color: '#007bff !important',
};

// UserSearch component provides a flexible search and filtering interface for a list of users.
// It adapts its layout for mobile and desktop views and allows filtering by name, role, and experience.
function UserSearch({ users, onFilteredUsersChange }) {
    // showSearchInput controls the visibility of the search input fields.
    const [showSearchInput, setShowSearchInput] = useState(false);
    // searchFilters stores the current values of text and number input filters.
    const [searchFilters, setSearchFilters] = useState({
        fullName: "",
        role: "",
        yearsOfExperienceMin: "",
        yearsOfExperienceMax: "",
    });
    // selectedRoleTags stores an array of roles selected from the dropdown for filtering.
    const [selectedRoleTags, setSelectedRoleTags] = useState([]);
    // isMobile determines if the current viewport width is considered mobile (less than 768px).
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // useEffect hook to update `isMobile` state on window resize.
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        // Cleanup function to remove the event listener on component unmount.
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // useMemo hook to calculate unique roles from the `users` prop.
    // This memoization prevents recalculation unless the `users` array changes.
    const uniqueRoles = useMemo(() => {
        const roles = new Set();
        users.forEach(user => {
            if (user.role) {
                // Handle both string (comma-separated) and array formats for user.role.
                const userRoles = Array.isArray(user.role)
                    ? user.role
                    : user.role.split(',').map(r => r.trim()).filter(r => r);

                userRoles.forEach(r => roles.add(r));
            }
        });
        return Array.from(roles).sort(); // Convert Set to Array and sort alphabetically.
    }, [users]); // Dependency: `users` prop.

    // handleSearchToggle toggles the visibility of the search input fields.
    const handleSearchToggle = () => {
        setShowSearchInput(prev => !prev);
    };

    // handleSearchFilterChange updates a specific search filter based on input name and value.
    const handleSearchFilterChange = (filterName, value) => {
        setSearchFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    // handleRoleTagToggle adds or removes a role from `selectedRoleTags` when a dropdown item is clicked.
    // It also prevents event propagation to keep the dropdown open if needed.
    const handleRoleTagToggle = (role, event) => {
        if (event) {
            event.stopPropagation(); // Prevents the dropdown from closing immediately.
        }
        setSelectedRoleTags(prevTags => {
            if (prevTags.includes(role)) {
                return prevTags.filter(tag => tag !== role); // Remove tag if already selected.
            } else {
                return [...prevTags, role]; // Add tag if not selected.
            }
        });
    };

    // handleClearAllFilters resets all search filters and selected role tags to their initial empty states.
    const handleClearAllFilters = () => {
        setSearchFilters({
            fullName: "",
            role: "",
            yearsOfExperienceMin: "",
            yearsOfExperienceMax: "",
        });
        setSelectedRoleTags([]);
    };

    // filterAndNotifyParent is a memoized callback function that filters the `users` array
    // based on the current `searchFilters` and `selectedRoleTags`, then calls `onFilteredUsersChange`
    // to pass the filtered results to the parent component.
    const filterAndNotifyParent = useCallback(() => {
        const filtered = users.filter(user => {
            // Check if no filters are applied to return all users.
            const noTextFiltersApplied = Object.values(searchFilters).every(filterValue => !filterValue);
            const noRoleTagsApplied = selectedRoleTags.length === 0;

            if (noTextFiltersApplied && noRoleTagsApplied) {
                return true; // Return all users if no filters are active.
            }

            // Filter logic for full name.
            const matchesFullName = searchFilters.fullName
                ? user.fullName.toLowerCase().includes(searchFilters.fullName.toLowerCase())
                : true;

            // Prepare user roles for text search (handle array or string format).
            const userRolesForTextSearch = Array.isArray(user.role)
                ? user.role.join(', ').toLowerCase()
                : (user.role ? user.role.toLowerCase() : '');

            // Filter logic for role text search.
            const matchesRoleTextSearch = searchFilters.role
                ? userRolesForTextSearch.includes(searchFilters.role.toLowerCase())
                : true;

            // Convert user roles to an array for tag-based filtering.
            const userRolesAsArray = Array.isArray(user.role)
                ? user.role
                : (user.role ? user.role.split(',').map(r => r.trim()).filter(r => r) : []);

            // Filter logic for selected role tags (user must have all selected tags).
            const matchesRoleTags = selectedRoleTags.length === 0 || (
                selectedRoleTags.every(selectedTag => userRolesAsArray.includes(selectedTag))
            );

            // Parse years of experience filters.
            const minExp = parseInt(searchFilters.yearsOfExperienceMin, 10);
            const maxExp = parseInt(searchFilters.yearsOfExperienceMax, 10);

            // Filter logic for years of experience range.
            const matchesYearsOfExperience = (
                (isNaN(minExp) || user.yearsOfExperience >= minExp) &&
                (isNaN(maxExp) || user.yearsOfExperience <= maxExp)
            );

            // A user matches if all active filters are satisfied.
            return matchesFullName && matchesRoleTextSearch && matchesRoleTags && matchesYearsOfExperience;
        });

        // Notify the parent component with the filtered list of users.
        onFilteredUsersChange(filtered);
    }, [users, searchFilters, selectedRoleTags, onFilteredUsersChange]); // Dependencies for useCallback.

    // useEffect hook to re-run the filtering logic whenever filters or users change.
    useEffect(() => {
        filterAndNotifyParent();
    }, [filterAndNotifyParent]); // Dependency: the memoized filterAndNotifyParent function.

    return (
        <div className="d-flex align-items-center">
            {/* Conditional rendering based on `showSearchInput` and `isMobile` for different layouts. */}
            {showSearchInput && isMobile ? (
                // Full-screen modal-like overlay for mobile search.
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    zIndex: 1050,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '20px',
                        width: '90%',
                        maxWidth: '500px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                        position: 'relative'
                    }}>
                        {/* Close button for the mobile search overlay. */}
                        <Button
                            variant="light"
                            className="position-absolute top-0 end-0 m-2"
                            onClick={handleSearchToggle}
                            aria-label="Close search"
                        >
                            <XCircleFill size={24} />
                        </Button>
                        <h5 className="mb-3 text-primary">Search Members</h5>
                        <div className="d-flex flex-column align-items-stretch">
                            {/* Full Name Search Input */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small mb-1">Full Name</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Name..."
                                        value={searchFilters.fullName}
                                        onChange={(e) => handleSearchFilterChange("fullName", e.target.value)}
                                        aria-label="Search by full name"
                                    />
                                    {/* Clear button for full name input. */}
                                    {searchFilters.fullName && (
                                        <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("fullName", "")}>
                                            <XCircleFill size={16} />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>

                            {/* Role Text Search Input */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small mb-1">Role (Text Search)</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search Role..."
                                        value={searchFilters.role}
                                        onChange={(e) => handleSearchFilterChange("role", e.target.value)}
                                        aria-label="Search by role text"
                                    />
                                    {/* Clear button for role text input. */}
                                    {searchFilters.role && (
                                        <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("role", "")}>
                                            <XCircleFill size={16} />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>

                            {/* Filter by Role Dropdown */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small mb-1">Filter by Role</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle
                                        variant="outline-secondary"
                                        style={dropdownToggleStyle}
                                        className="flex-grow-1"
                                    >
                                        Select Roles
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu style={dropdownMenuStyle}>
                                        {/* Map through unique roles to create dropdown items with checkboxes. */}
                                        {uniqueRoles.map(role => (
                                            <Dropdown.Item
                                                key={role}
                                                style={selectedRoleTags.includes(role) ? dropdownItemCheckedStyle : dropdownItemStyle}
                                                onClick={(e) => handleRoleTagToggle(role, e)}
                                            >
                                                <Form.Check
                                                    type="checkbox"
                                                    label={role}
                                                    checked={selectedRoleTags.includes(role)}
                                                    readOnly // Checkbox is controlled by onClick of Dropdown.Item.
                                                    className="mb-0"
                                                />
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>

                            {/* Years Experience (Min - Max) Input */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small mb-1">Years Experience (Min - Max)</Form.Label>
                                <InputGroup>
                                    <Form.Control
                                        type="number"
                                        placeholder="Min"
                                        value={searchFilters.yearsOfExperienceMin}
                                        onChange={(e) => handleSearchFilterChange("yearsOfExperienceMin", e.target.value)}
                                        min="0"
                                        aria-label="Minimum years of experience"
                                    />
                                    <Form.Control
                                        type="number"
                                        placeholder="Max"
                                        value={searchFilters.yearsOfExperienceMax}
                                        onChange={(e) => handleSearchFilterChange("yearsOfExperienceMax", e.target.value)}
                                        min="0"
                                        aria-label="Maximum years of experience"
                                    />
                                    {/* Clear button for years of experience inputs. */}
                                    {(searchFilters.yearsOfExperienceMin || searchFilters.yearsOfExperienceMax) && (
                                        <Button variant="outline-secondary" onClick={() => {
                                            handleSearchFilterChange("yearsOfExperienceMin", "");
                                            handleSearchFilterChange("yearsOfExperienceMax", "");
                                        }}>
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
                // Horizontal layout for desktop search inputs.
                <div className="d-flex flex-row align-items-center flex-wrap flex-grow-1 me-2">
                    {/* Full Name Search Input (desktop) */}
                    <InputGroup className="flex-grow-1 me-2" style={{ maxWidth: '200px', minWidth: '150px' }}>
                        <Form.Control
                            type="text"
                            placeholder="Search Name..."
                            value={searchFilters.fullName}
                            onChange={(e) => handleSearchFilterChange("fullName", e.target.value)}
                            aria-label="Search by full name"
                        />
                        {searchFilters.fullName && (
                            <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("fullName", "")}>
                                <XCircleFill size={16} />
                            </Button>
                        )}
                    </InputGroup>

                    {/* Role Text Search Input (desktop) */}
                    <InputGroup className="flex-grow-1 me-2" style={{ maxWidth: '150px', minWidth: '120px' }}>
                        <Form.Control
                            type="text"
                            placeholder="Search Role (text)..."
                            value={searchFilters.role}
                            onChange={(e) => handleSearchFilterChange("role", e.target.value)}
                            aria-label="Search by role text"
                        />
                        {searchFilters.role && (
                            <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("role", "")}>
                                <XCircleFill size={16} />
                            </Button>
                        )}
                    </InputGroup>

                    {/* Years Experience (Min - Max) Input (desktop) */}
                    <InputGroup className="flex-grow-1 me-2" style={{ maxWidth: '200px', minWidth: '150px' }}>
                        <Form.Control
                            type="number"
                            placeholder="Min Exp"
                            value={searchFilters.yearsOfExperienceMin}
                            onChange={(e) => handleSearchFilterChange("yearsOfExperienceMin", e.target.value)}
                            min="0"
                            aria-label="Minimum years of experience"
                        />
                        <Form.Control
                            type="number"
                            placeholder="Max"
                            value={searchFilters.yearsOfExperienceMax}
                            onChange={(e) => handleSearchFilterChange("yearsOfExperienceMax", e.target.value)}
                            min="0"
                            aria-label="Maximum years of experience"
                        />
                        {(searchFilters.yearsOfExperienceMin || searchFilters.yearsOfExperienceMax) && (
                            <Button variant="outline-secondary" onClick={() => {
                                handleSearchFilterChange("yearsOfExperienceMin", "");
                                handleSearchFilterChange("yearsOfExperienceMax", "");
                            }}>
                                <XCircleFill size={16} />
                            </Button>
                        )}
                    </InputGroup>

                    {/* Filter by Role Dropdown (desktop) */}
                    <Dropdown className="flex-grow-1 me-2" style={{ maxWidth: '200px', minWidth: '150px' }}>
                        <Dropdown.Toggle
                            variant="outline-secondary"
                            style={dropdownToggleStyle}
                            className="w-100"
                        >
                            Select Roles
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={dropdownMenuStyle}>
                            {uniqueRoles.map(role => (
                                <Dropdown.Item
                                    key={role}
                                    style={selectedRoleTags.includes(role) ? dropdownItemCheckedStyle : dropdownItemStyle}
                                    onClick={(e) => handleRoleTagToggle(role, e)}
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label={role}
                                        checked={selectedRoleTags.includes(role)}
                                        readOnly
                                        className="mb-0"
                                    />
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Clear All Filters Button (desktop) */}
                    <Button variant="outline-secondary" className="me-2" onClick={handleClearAllFilters}>
                        <ArrowCounterclockwise size={18} className="me-1" /> Clear All
                    </Button>

                    {/* Close Search Button (desktop) */}
                    <Button variant="outline-danger" onClick={handleSearchToggle} aria-label="Close search">
                        <XCircleFill size={18} />
                    </Button>
                </div>
            ) : (
                // Initial "Search" button when filters are hidden.
                <Button variant="outline-secondary" size="sm" onClick={handleSearchToggle} className="me-2" aria-label="Open search">
                    <Search size={15} /> Search
                </Button>
            )}
        </div>
    );
}

export default UserSearch;