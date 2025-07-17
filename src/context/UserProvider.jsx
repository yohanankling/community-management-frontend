import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext.jsx';

// UserProvider is a React component that makes user authentication state and functions
// available to all components nested within it. It uses React's Context API.
export const UserProvider = ({ children }) => {
    // `user` state holds the current authenticated user's data.
    // It is initialized to `null`, indicating no user is logged in.
    const [user, setUser] = useState(null);

    // `login` function updates the `user` state with the provided `userData`,
    // effectively logging a user in.
    const login = (userData) => {
        setUser(userData);
    };

    // `logout` function resets the `user` state to `null`,
    // effectively logging out the current user.
    const logout = () => {
        setUser(null);
    };

    return (
        // UserContext.Provider makes the `user` state, `login`, and `logout` functions
        // available to any descendant component that consumes `UserContext`.
        <UserContext.Provider value={{ user, login, logout }}>
            {children} {/* Renders all child components wrapped by this provider. */}
        </UserContext.Provider>
    );
};

// useUser is a custom React Hook that provides a convenient way to access
// the `UserContext`. It ensures that the hook is only used within a `UserProvider`.
export const useUser = () => {
    // useContext hook consumes the `UserContext` to get the current context value.
    const context = useContext(UserContext);
    // Throws an error if `useUser` is called outside of a `UserProvider` component,
    // which helps in debugging by indicating incorrect usage.
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context; // Returns the context value containing user data and authentication functions.
};