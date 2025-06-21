import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminUsersPage = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Need to create this endpoint and service method
        const fetchUsers = async () => {
            // const response = await api.getUsers();
            // setUsers(response.data);
            console.log("Fetch users to be implemented");
        };
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Manage Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.email} - {user.role}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminUsersPage; 