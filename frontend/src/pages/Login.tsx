import { Register }  from '../components/authentication/Register';
import { Login } from '../components/authentication/Login';
import { Logout } from '../components/authentication/Logout';
import { useLoggedInUser } from '../hooks/useLoggedInUser';

export const UserCredentials = () => {
    const { user, loading } = useLoggedInUser();

    if (loading) return <div>Loading...</div>; // Prevent flickering

    return (
        <div className="login-page">
            {!user ? (
                <>
                    <Login />
                    <p>OR</p>
                    <Register />
                </>
            ) : (
                <Logout />
            )}
        </div>
    );
};
