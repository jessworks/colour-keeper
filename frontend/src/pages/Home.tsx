import { WelcomeMsg } from "../components/Welcome";


export const Home = () => {
    return (
        <div className="home-page">
            <div className="welcome-container">
                <WelcomeMsg />
            </div>
        </div>
    )
}