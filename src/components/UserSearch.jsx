import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { Search, XCircleFill, ArrowCounterclockwise } from 'react-bootstrap-icons';

function UserSearch({ users, onFilteredUsersChange }) {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        fullName: "",
        role: "", // This will still be used for text search within roles
        yearsOfExperienceMin: "",
        yearsOfExperienceMax: "",
    });
    // New state for selected role tags
    const [selectedRoleTags, setSelectedRoleTags] = useState([]);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Extract unique roles from the users list
    const uniqueRoles = useMemo(() => {
        const roles = new Set();
        users.forEach(user => {
            if (user.role) {
                roles.add(user.role);
            }
        });
        return Array.from(roles).sort();
    }, [users]);

    const handleSearchToggle = () => {
        setShowSearchInput(prev => !prev);
    };

    const handleSearchFilterChange = (filterName, value) => {
        setSearchFilters(prevFilters => ({
            ...prevFilters,
            [filterName]: value
        }));
    };

    // New handler for role tag selection
    const handleRoleTagToggle = (role) => {
        setSelectedRoleTags(prevTags => {
            if (prevTags.includes(role)) {
                return prevTags.filter(tag => tag !== role);
            } else {
                return [...prevTags, role];
            }
        });
    };

    const handleClearAllFilters = () => {
        setSearchFilters({
            fullName: "",
            role: "",
            yearsOfExperienceMin: "",
            yearsOfExperienceMax: "",
        });
        setSelectedRoleTags([]); // Clear selected role tags
    };

    const filterAndNotifyParent = useCallback(() => {
        const filtered = users.filter(user => {
            const noTextFiltersApplied = Object.values(searchFilters).every(filterValue => !filterValue);
            const noRoleTagsApplied = selectedRoleTags.length === 0;

            if (noTextFiltersApplied && noRoleTagsApplied) {
                return true;
            }

            const matchesFullName = searchFilters.fullName
                ? user.fullName.toLowerCase().includes(searchFilters.fullName.toLowerCase())
                : true;

            const matchesRoleTextSearch = searchFilters.role
                ? user.role.toLowerCase().includes(searchFilters.role.toLowerCase())
                : true;

            // New: Check if user's role is in the selectedRoleTags array
            const matchesRoleTags = selectedRoleTags.length > 0
                ? selectedRoleTags.includes(user.role)
                : true;

            const minExp = parseInt(searchFilters.yearsOfExperienceMin, 10);
            const maxExp = parseInt(searchFilters.yearsOfExperienceMax, 10);

            const matchesYearsOfExperience = (
                (isNaN(minExp) || user.yearsOfExperience >= minExp) &&
                (isNaN(maxExp) || user.yearsOfExperience <= maxExp)
            );

            return matchesFullName && matchesRoleTextSearch && matchesRoleTags && matchesYearsOfExperience;
        });

        onFilteredUsersChange(filtered);
    }, [users, searchFilters, selectedRoleTags, onFilteredUsersChange]); // Add selectedRoleTags to dependencies

    useEffect(() => {
        filterAndNotifyParent();
    }, [filterAndNotifyParent]);

    return (
        <div className="d-flex align-items-center">
            {showSearchInput && isMobile ? (
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
                                    {searchFilters.fullName && (
                                        <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("fullName", "")}>
                                            <XCircleFill size={16} />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>

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
                                    {searchFilters.role && (
                                        <Button variant="outline-secondary" onClick={() => handleSearchFilterChange("role", "")}>
                                            <XCircleFill size={16} />
                                        </Button>
                                    )}
                                </InputGroup>
                            </Form.Group>

                            {/* New: Role Tag Filter for Mobile */}
                            <Form.Group className="mb-3">
                                <Form.Label className="small mb-1">Filter by Role (Tags)</Form.Label>
                                <div className="d-flex flex-wrap gap-2">
                                    {uniqueRoles.map(role => (
                                        <Button
                                            key={role}
                                            variant={selectedRoleTags.includes(role) ? "primary" : "outline-primary"}
                                            size="sm"
                                            onClick={() => handleRoleTagToggle(role)}
                                        >
                                            {role}
                                        </Button>
                                    ))}
                                </div>
                            </Form.Group>

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

                            <Button variant="outline-secondary" className="mt-3" onClick={handleClearAllFilters}>
                                <ArrowCounterclockwise size={18} className="me-2" /> Clear All Filters
                            </Button>
                        </div>
                    </div>
                </div>
            ) : showSearchInput && !isMobile ? (
                <div className="d-flex flex-wrap align-items-center me-2 flex-grow-1">
                    <InputGroup className="mb-2 mb-md-0 me-2" style={{ maxWidth: '200px' }}>
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

                    <InputGroup className="mb-2 mb-md-0 me-2" style={{ maxWidth: '150px' }}>
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

                    {/* New: Role Tag Filter for Desktop */}
                    <div className="d-flex flex-wrap gap-1 me-2 mb-2 mb-md-0">
                        {uniqueRoles.map(role => (
                            <Button
                                key={role}
                                variant={selectedRoleTags.includes(role) ? "primary" : "outline-primary"}
                                size="sm"
                                onClick={() => handleRoleTagToggle(role)}
                            >
                                {role}
                            </Button>
                        ))}
                    </div>

                    <InputGroup className="mb-2 mb-md-0 me-2" style={{ maxWidth: '200px' }}>
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
                            placeholder="Max Exp"
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

                    <Button variant="outline-secondary" className="ms-2" onClick={handleClearAllFilters}>
                        <ArrowCounterclockwise size={18} className="me-2" /> Clear All
                    </Button>

                    <Button variant="outline-danger" onClick={handleSearchToggle} aria-label="Close search">
                        <XCircleFill size={18} />
                    </Button>
                </div>
            ) : (
                <Button variant="outline-secondary" size="sm" onClick={handleSearchToggle} className="me-2" aria-label="Open search">
                    <Search size={15} /> Search
                </Button>
            )}
        </div>
    );
}

export default UserSearch;