import { createContext, useState, useEffect } from "react";
import AuthService from "../service/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);

    useEffect(() => {
        if (AuthService.isAuthenticated()) {
            setUser(true);
            setRole(AuthService.getUserRole());
        }
    }, []);

    const login = async (username, password) => {
        const response = await AuthService.login(username, password);
        setUser(true);
        setRole(AuthService.getUserRole());
    };

    const logout = () => {
        AuthService.logout();
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
