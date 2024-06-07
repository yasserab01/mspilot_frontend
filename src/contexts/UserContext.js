import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from 'api'; // Adjust the path to your actual API file
import { ACCESS_TOKEN } from '../constants';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (token) {
            try {
                const response = await api.get('/api/users/current/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.status === 200) {
                    setUser(response.data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
                console.error('Error fetching user data:', error);
            }
        } else {
            console.log('No token found');
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        fetchUser().catch((error) => {
            if (isMounted) {
                console.error(error);
                setUser(null);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [fetchUser]);

    const updateUser = (newUser) => {
        setUser(newUser);
    };

    return (
        <UserContext.Provider value={{ user, setUser: updateUser, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};
