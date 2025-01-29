import { Register }  from '../components/authentication/Register';
import { Login } from '../components/authentication/Login';
import { Logout } from '../components/authentication/Logout';


export const UserCredentials = () => {
    return (
        <>
            <Register />
            <Login />
            <Logout />
        </>
    )
}