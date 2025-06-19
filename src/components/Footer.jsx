
const Footer = () => {
  return (
    <div className="bg-blue-800 text-white py-4 text-center fixed bottom-0 left-0 w-full">
      <p>&copy; {new Date().getFullYear()} WordSphere. All rights reserved.</p>
    </div>
  );
};

export default Footer;