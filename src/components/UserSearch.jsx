import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Form, Button, InputGroup, Dropdown } from 'react-bootstrap';
import { Search, XCircleFill, ArrowCounterclockwise } from 'react-bootstrap-icons';

const dropdownToggleStyle = {
    backgroundColor: '#dee2e6',
    color: '#495057',
    border: '1px solid #ced4da',
    fontSize: '0.9em',
};

const dropdownMenuStyle = {
    maxHeight: '200px',
    overflowY: 'auto',
    width: 'auto',
    minWidth: '200px',
};

const dropdownItemStyle = {
    padding: '0.5em 1em',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5em',
    backgroundColor: '#ffffff !important',
    color: '#495057 !important',
};

const dropdownItemCheckedStyle = {
    ...dropdownItemStyle,
    backgroundColor: '#e7f1ff !important',
    color: '#007bff !important',
};

function UserSearch({ users, onFilteredUsersChange }) {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [searchFilters, setSearchFilters] = useState({
        fullName: "",
        role: "",
        yearsOfExperienceMin: "",
        yearsOfExperienceMax: "",
    });
    const [selectedRoleTags, setSelectedRoleTags] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const uniqueRoles = useMemo(() => {
        const roles = new Set();
        users.forEach(user => {
            if (user.role) {
                const userRoles = Array.isArray(user.role)
                    ? user.role
                    : user.role.split(',').map(r => r.trim()).filter(r => r);

                userRoles.forEach(r => roles.add(r));
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

    const handleRoleTagToggle = (role, event) => {
        if (event) {
            event.stopPropagation();
        }
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
        setSelectedRoleTags([]);
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

            const userRolesForTextSearch = Array.isArray(user.role)
                ? user.role.join(', ').toLowerCase()
                : (user.role ? user.role.toLowerCase() : '');

            const matchesRoleTextSearch = searchFilters.role
                ? userRolesForTextSearch.includes(searchFilters.role.toLowerCase())
                : true;

            const userRolesAsArray = Array.isArray(user.role)
                ? user.role
                : (user.role ? user.role.split(',').map(r => r.trim()).filter(r => r) : []);

            const matchesRoleTags = selectedRoleTags.length === 0 || (
                selectedRoleTags.every(selectedTag => userRolesAsArray.includes(selectedTag))
            );

            const minExp = parseInt(searchFilters.yearsOfExperienceMin, 10);
            const maxExp = parseInt(searchFilters.yearsOfExperienceMax, 10);

            const matchesYearsOfExperience = (
                (isNaN(minExp) || user.yearsOfExperience >= minExp) &&
                (isNaN(maxExp) || user.yearsOfExperience <= maxExp)
            );

            return matchesFullName && matchesRoleTextSearch && matchesRoleTags && matchesYearsOfExperience;
        });

        onFilteredUsersChange(filtered);
    }, [users, searchFilters, selectedRoleTags, onFilteredUsersChange]);

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
                <div className="d-flex flex-row align-items-center flex-wrap flex-grow-1 me-2">
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

                    <Button variant="outline-secondary" className="me-2" onClick={handleClearAllFilters}>
                        <ArrowCounterclockwise size={18} className="me-1" /> Clear All
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