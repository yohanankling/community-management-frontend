import { createContext } from 'react';

// UserContext is a React Context object.
// It's created with a default value of `null`, which will be used if a component
// tries to consume the context without a corresponding Provider above it in the component tree.
// This context is intended to hold and provide user-related data (e.g., login status, user details)
// to any component in the application that needs it, without prop drilling.
export const UserContext = createContext(null);