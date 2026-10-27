import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareFacebook, faSquareXTwitter, faSquareInstagram } from '@fortawesome/free-brands-svg-icons';
function Footer() {
    return (
        <footer>
            <div className="footer-column">
                <div className="footer-column1">
                    <h2 style={{ fontWeight: "bolder" }}>Explore</h2>
                    <p>Home</p>
                    <p>Questions</p>
                    <p>Articles</p>
                    <p>Tutorials</p>
                </div>

                <div className="footer-column2">
                    <h2>Support</h2>
                    <p>FAQs</p>
                    <p>Help</p>
                    <p>Contact Us</p>
                </div>
                <div className="footer-column3">
                    <h2>Stay connected</h2>
                    <div className='icons'>
                    <FontAwesomeIcon icon={faSquareFacebook} />
                    <FontAwesomeIcon icon={faSquareXTwitter} />
                    <FontAwesomeIcon icon={faSquareInstagram} />
                    </div>
                </div>
            </div>
            
            <div className="legal-block">
                <h2>DEV@Deakin 2022</h2> 
            </div>

            <div className="legal-block2">
                <div className="legal-links">
                    <p>Privacy Policy</p>
                    <p>Terms and Conditions</p>
                    <p>Code of Conduct</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;