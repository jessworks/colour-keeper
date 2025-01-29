import { Register }  from '../components/authentication/Register';
import { Login } from '../components/authentication/Login';
import { Logout } from '../components/authentication/Logout';


export const UserCredentials = () => {
    return (
        <div className="login-page">
            <Register />
            <Login />
            <Logout />
        </div>
    )
}