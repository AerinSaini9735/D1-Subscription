import { useNavigate } from "react-router-dom";

function Logout() {
    const navigate = useNavigate();

    function handleLogout() {
        // Remove authentication data
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("authChange"));

        // Redirect to login page
        navigate("/login");
    }

    return (
        <p className="logout-button" onClick={handleLogout}>
            Logout
        </p>
    );
}

export default Logout;