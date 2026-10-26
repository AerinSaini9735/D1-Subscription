import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from './header.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser as faUserSolid} from '@fortawesome/free-solid-svg-icons';
import { faUser as faUserRegular } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons'; 

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleLogin(e) {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("http://localhost:3000/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"

                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                });

            const result = await response.json();

            if (!response.ok) {
                setMessage(result.message || "Login failed.");
                return;
            }

            localStorage.setItem("token", result.token);
            localStorage.setItem("user", JSON.stringify(result.user));

            setMessage("Login successful!");

            // Navigate to the homepage 
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setMessage("Unable to connect to the server. Please try again."

            );
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <div className="home">
                <Header />
            </div>
            <form className="login" onSubmit={handleLogin}>
                <div className='user-block'>
                    <FontAwesomeIcon icon={faUserSolid} className='user-logo' />
                </div>
                <label className="sign-in">
                    Sign in
                </label>
                <label className="sign-up-block">
                    Not registered? <Link className="sign-up" to="/sign-up">
                        Sign up
                    </Link>
                </label>
                <div className='search-box-block-1'>
                    <FontAwesomeIcon icon={faUserRegular} className='user-logo-2' />
                    <input className="search-box-1" type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='search-box-block-2'>
                    <FontAwesomeIcon icon={faKey} className='pass-icon' />
                    <input className="search-box-2" type="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <span className='pass-info'>

                    <input type='checkbox' />
                    <label>Remember Me</label>

                    <label className='forgot-pass'>Forgot Password?</label>

                </span>

                {message && (
                    <p role="status" aria-live="polite">
                        {message}
                    </p>
                )}
                <button className="log-in" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Log in"}
                </button>

            </form>
        </div>
    );
}

export default Login;