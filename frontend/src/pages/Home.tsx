import { Link } from 'react-router-dom';
import { useLoggedInUser } from '../hooks/useLoggedInUser';
import { WelcomeMsg } from "../components/Welcome";


/*export const Home = () => {
    return (
        <div className="home-page">
            <div className="welcome-container">
                <WelcomeMsg />
            </div>
        </div>
    )
}*/

export const Home = () => {
    const { user } = useLoggedInUser();

    return (
        <div className="home-page">
            {!user ? (
                <div className="welcome-container">
                    <WelcomeMsg />
                    <Link to="/login" className="link-as-btn">Log In</Link>
                </div>
            ) : (
                <div className="welcome-container">
                    <WelcomeMsg />
                    <Link to="/colors" className="link-as-btn">Let's Add Some Colours</Link>
                </div>
            )}
        </div>
    );
};