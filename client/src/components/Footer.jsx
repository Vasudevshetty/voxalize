function Footer() {
  return (
    <footer className="bg-[#0e0e0e] text-gray-400 py-6 mt-10 w-full border-t-2 border-[#1e1e1e]">
      <div className="max-w-4xl mx-auto text-center space-y-4">
        <p className="text-sm sm:text-base">
          © {new Date().getFullYear()} Voxalize. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6">
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
