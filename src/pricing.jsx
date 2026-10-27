import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from './header.jsx'

function Pricing() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [payment, setPayment] = useState({
        name: "",
        cardNumber: "",
        expiry: "",
        cvv: ""
    });

    // Get the user's current membership from Firestore via the backend.
    async function getPlan() {
        const token = localStorage.getItem("token");

        if (!token) {
            setPlan(null);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/my-plan", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (response.ok) {
                setPlan(result.plan || "Free");
            } else {
                setPlan(null);
            }
        } catch (error) {
            console.error("Error loading membership:", error);
            setMessage("Unable to load your membership.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getPlan();
    }, []);

    // Open the upgrade modal only for logged-in Free users.
    function handleUpgrade() {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Please log in before upgrading your plan.");
            navigate("/login");
            return;
        }

        if (plan === "Paid") {
            alert("You are already on the Paid plan!");
            return;
        }

        if (loading) {
            alert("Please wait while your membership loads.");
            return;
        }

        setMessage("");
        setShowModal(true);
    }

    // Validate the card number using the Luhn checksum.
    function validCardNumber(number) {
        const digits = number.replace(/\s/g, "");

        if (!/^\d{13,19}$/.test(digits)) {
            return false;
        }

        let sum = 0;
        let doubleDigit = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = Number(digits[i]);

            if (doubleDigit) {
                digit *= 2;

                if (digit > 9) digit -= 9;
            }

            sum += digit;
            doubleDigit = !doubleDigit;
        }

        return sum % 10 === 0;
    }

    function handleChange(event) {
        const { name, value } = event.target;

        setPayment((previous) => ({
            ...previous,
            [name]: value
        }));
    }

    // Validate the form and request the upgrade.
    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");

        if (!payment.name.trim()) {
            setMessage("Please enter the cardholder's name.");
            return;
        }

        if (!validCardNumber(payment.cardNumber)) {
            setMessage("Please enter a valid card number.");
            return;
        }

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry)) {
            setMessage("Enter the expiry date in MM/YY format.");
            return;
        }

        const [month, year] = payment.expiry.split("/");
        const expiryDate = new Date(
            2000 + Number(year),
            Number(month)
        );

        if (expiryDate <= new Date()) {
            setMessage("Your card has expired.");
            return;
        }

        if (!/^\d{3,4}$/.test(payment.cvv)) {
            setMessage("Enter a valid 3 or 4 digit CVV.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setShowModal(false);
            alert("Please log in before upgrading.");
            navigate("/login");
            return;
        }

        try {
            setSubmitting(true);

            const response = await fetch(
                "http://localhost:3000/upgrade-plan",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({})
                }
            );

            const result = await response.json();

            if (!response.ok) {
                setMessage(result.message || "Upgrade failed.");
                await getPlan();
                return;
            }

            setPlan(result.plan);
            setShowModal(false);
            setMessage("Congratulations! Your plan is now Paid.");

            setPayment({
                name: "",
                cardNumber: "",
                expiry: "",
                cvv: ""
            });
        } catch (error) {
            console.error("Upgrade error:", error);
            setMessage("Unable to connect to the server. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <>
            <Header />
            <div className="pricing-page">
            <h1>Choose Your Plan</h1>

            {loading ? (
                <p>Loading your membership...</p>
            ) : (
                <>
                    {plan ? (
                        <div className="current-plan">
                            Your current membership: <strong>{plan}</strong>
                        </div>
                    ) : (
                        <p>Please <Link className="sign-up" to="/login">log in</Link> to view your current membership.</p>
                    )}

                    <div className="pricing-container">
                        {/* Free Plan */}
                        <div className="pricing-card">
                            <h2>Free Plan</h2>
                            <h3>₹0</h3>

                            <ul>
                                <li>Basic website access</li>
                                <li>Create and explore posts</li>
                                <li>Standard features</li>
                            </ul>

                            {plan === "Free" ? (
                                <button disabled className="current-plan-button">
                                    Current Plan
                                </button>
                            ) : (
                                <p>Basic access for everyone.</p>
                            )}
                        </div>

                        {/* Paid Plan */}
                        <div className="pricing-card paid-card">
                            <h2>Paid Plan</h2>
                            <h3>₹499 / month</h3>
                            <p>One-time demo price</p>

                            <ul>
                                <li>Everything in the Free Plan</li>
                                <li>Access to premium features</li>
                                <li>Enhanced user experience</li>
                            </ul>

                            {plan === "Paid" ? (
                                <button disabled className="current-plan-button">
                                    Your Current Plan
                                </button>
                            ) : (
                                <button
                                    className="upgrade-button"
                                    onClick={handleUpgrade}
                                    disabled={loading}
                                >
                                    Upgrade Plan
                                </button>
                            )}
                        </div>
                    </div>
                </>
            )}

            {message && (
                <p className="pricing-message" role="status">
                    {message}
                </p>
            )}

            {/* Payment Modal */}
            {showModal && (
                <div className="modal-overlay"
                    onClick={() => {
                        if (!submitting) setShowModal(false);
                    }}
                >
                    <div className="payment-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="payment-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button type="button"
                            className="close-modal"
                            onClick={() => setShowModal(false)}
                            disabled={submitting}
                            aria-label="Close modal"
                        >
                            &times;
                        </button>

                        <h2 id="payment-title">Upgrade to Paid</h2>
                        <p>Demo price: ₹499</p>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="payment-name">
                                Cardholder Name
                            </label>

                            <input id="payment-name"
                                type="text"
                                name="name"
                                value={payment.name}
                                onChange={handleChange}
                                autoComplete="cc-name"
                                required
                            />

                            <label htmlFor="payment-card">
                                Card Number
                            </label>

                            <input id="payment-card"
                                type="text"
                                name="cardNumber"
                                value={payment.cardNumber}
                                onChange={handleChange}
                                inputMode="numeric"
                                autoComplete="cc-number"
                                placeholder="Enter card number"
                                maxLength={23}
                                required
                            />

                            <div className="payment-row">
                                <div>
                                    <label htmlFor="payment-expiry">
                                        Expiry (MM/YY)
                                    </label>

                                    <input id="payment-expiry"
                                        type="text"
                                        name="expiry"
                                        value={payment.expiry}
                                        onChange={handleChange}
                                        autoComplete="cc-exp"
                                        placeholder="MM/YY"
                                        maxLength={5}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="payment-cvv">
                                        CVV
                                    </label>

                                    <input id="payment-cvv"
                                        type="password"
                                        name="cvv"
                                        value={payment.cvv}
                                        onChange={handleChange}
                                        inputMode="numeric"
                                        autoComplete="cc-csc"
                                        maxLength={4}
                                        required
                                    />
                                </div>
                            </div>

                            {message && (
                                <p className="form-error" role="alert">
                                    {message}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="upgrade-button"
                                disabled={submitting}
                            >
                                {submitting
                                    ? "Processing..."
                                    : "Confirm Upgrade"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
            </div>
        </>
    );
}

export default Pricing;
