import { FaInstagram, FaTiktok, FaYoutube, FaTwitter, FaFacebook, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-white py-10 w-screen">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-8">
                    {/* About Us */}
                    <nav aria-label="About Us">
                        <h4 className="text-lg font-semibold mb-4">About us</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">About Homescape</a></li>
                            <li><a href="#" className="hover:underline">Why use Homescape</a></li>
                            <li><a href="#" className="hover:underline">How Homescape Works</a></li>
                        </ul>
                    </nav>
                    {/* Our Services */}
                    <nav aria-label="Our Services">
                        <h4 className="text-lg font-semibold mb-4">Our services</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Letting a residential</a></li>
                            <li><a href="#" className="hover:underline">Finding a Residential</a></li>
                            <li><a href="#" className="hover:underline">Blogs</a></li>
                            <li><a href="#" className="hover:underline">Reviews</a></li>
                        </ul>
                    </nav>
                    {/* Contact Us */}
                    <nav aria-label="Contact Us">
                        <h4 className="text-lg font-semibold mb-4">Contact us</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Contact us</a></li>
                            <li><a href="#" className="hover:underline">Help center</a></li>
                            <li><a href="#" className="hover:underline">FAQ</a></li>
                        </ul>
                        {/* Social Media */}
                        <h4 className="text-lg font-semibold mt-4">Follow us:</h4>
                        <div className="flex space-x-4 mt-2">
                            <a href="#" aria-label="Instagram" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><FaInstagram /></a>
                            <a href="#" aria-label="TikTok" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><FaTiktok /></a>
                            <a href="#" aria-label="YouTube" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><FaYoutube /></a>
                            <a href="#" aria-label="Twitter" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><FaTwitter /></a>
                            <a href="#" aria-label="Facebook" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><FaFacebook /></a>
                            <a href="#" aria-label="LinkedIn" className="p-2 bg-gray-700 rounded-full hover:bg-gray-600"><FaLinkedin /></a>
                        </div>
                    </nav>
                    {/* Terms & Privacy */}
                    <nav aria-label="Terms & Privacy">
                        <h4 className="text-lg font-semibold mb-4">Terms & Privacy</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Terms and Conditions</a></li>
                            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
                        </ul>
                    </nav>
                </div>
                {/* Footer Bottom */}
                <div className="text-center mt-8 border-t border-gray-700 pt-4">
                    <p>&copy; {currentYear} Designed by <span className="font-bold">Sikha Gajmer as FYP Project</span></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;