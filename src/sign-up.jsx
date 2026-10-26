import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faUser as faUserSolid, faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Header from './header.jsx'
import { faAddressCard } from '@fortawesome/free-regular-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';

function SignUp() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            alert("Password must contain at least 8 characters.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    password
                })
            });

            const result = await response.json();

            if (!response.ok) {
                alert(result.message || "Registration failed.");
                return;
            }

            alert("Account created successfully! You can now log in.");

            navigate("/login");

        } catch (error) {
            console.error("Registration error:", error);
            alert("Unable to connect to the server. Please try again.");
        }
    }
    return (
        <div>
            <div className="home">
                <Header />
            </div>
            <form className="login" onSubmit={handleSubmit}>
                <label className="sign-up-heading">
                    Create a DEV@Deakin Account
                </label>
                <div className='search-box-block-1'>
                    <FontAwesomeIcon icon={faAddressCard} className='name-icon' />
                    <input className="search-box-1" placeholder="Enter your Name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className='search-box-block-2'>
                    <FontAwesomeIcon icon={faUserSolid} className='pass-icon' />
                    <input className="search-box-2" type="email" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className='search-box-block-2'>
                    <FontAwesomeIcon icon={faKey} className='pass-icon' />
                    <input className="search-box-2" type="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className='search-box-block-2'>
                    <FontAwesomeIcon icon={faKey} className='pass-icon' />
                    <input className="search-box-2" type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <label className="sign-up-block">
                    Already have an account? <Link className="sign-up" to="/login">
                        Login Here
                    </Link>
                </label>
                <button className="log-in" type='submit'>
                    Create
                </button>
            </form>
        </div>

    )
}

export default SignUp