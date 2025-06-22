
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const IntroPage = () => {
  const [showCurtain, setShowCurtain] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (hasVisited) {
      navigate('/home');
    }

    document.body.style.overflowX = 'hidden';
    return () => {
      document.body.style.overflowX = 'auto';
    };
  }, [navigate]);

  const handleEnter = () => {
    sessionStorage.setItem('hasVisited', 'true');
    setShowCurtain(false);
    setTimeout(() => {
      navigate('/home');
    }, 1500);
  };



  return (
    <div className="relative min-h-screen w-full overflow-x-hidden overflow-y-hidden bg-white">

      {showCurtain && (
        <>

          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '-100%' }}
            transition={{ duration: 1.5 }}
            className="fixed top-0 left-0 w-1/2 h-full bg-blue-600 z-50"
          />

          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '100%' }}
            transition={{ duration: 1.5 }}
            className="fixed top-0 right-0 w-1/2 h-full bg-blue-600 z-50"
          />


          <div className="absolute inset-0 flex items-center justify-center z-40 px-4 text-center">
            <div className="flex flex-col items-center justify-center max-w-[90%] w-full h-full mx-auto">
              <img
                src="/logo.png"
                alt="WordSphere Logo"
                className="w-32 sm:w-36 md:w-40 lg:w-44 xl:w-48 mb-4"
              />

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mb-4">
                Welcome to WordSphere
              </h1>

              <p className="text-blue-600 mb-6 max-w-xl text-sm sm:text-base md:text-lg flex flex-wrap gap-2 justify-center">
                Dive into the world of words. Share your stories, ideas, and inspirations!
              </p>

              <motion.button
                onClick={handleEnter}
                whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(255,255,255,0.6)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white text-blue-600 font-semibold text-lg px-8 py-3 rounded-full shadow-xl hover:bg-gray-100 transition duration-300"
              >
                Enter
              </motion.button>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default IntroPage;


