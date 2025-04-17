"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import EligibilityChecker from "@/components/EligibilityChecker";

const Page = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate assets loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Loading screen animation variants
  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      {/* Loading Screen */}
      {isLoading && (
        <motion.div
          className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={loadingVariants}
        >
          <motion.img
            src="/AirdropImage.png"
            alt="Airdrop Bear"
            className="w-32 h-32 object-contain mb-6"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="bg-[#F59855] h-2 rounded-full w-64 overflow-hidden mt-4"
            initial={{ width: 0 }}
            animate={{ width: "16rem" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          <p
            className="text-white mt-4"
            style={{ fontFamily: "MinecraftRegular" }}
          >
            Loading MoniSwap...
          </p>
        </motion.div>
      )}

      <div
        className="relative min-h-screen w-full overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="container max-w-6xl px-8 md:px-12 lg:px-16 py-20 flex flex-col md:flex-row items-center justify-center md:gap-4 lg:gap-8">
          {/* Left Section - Text Content */}
          <motion.div
            className="z-20 mb-8 md:mb-0"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isLoaded ? 1 : 0, x: isLoaded ? 0 : -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1
              className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-8"
              style={{ fontFamily: "MinecraftRegular" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              MoniSwap Airdrop
              <br />
              Checker
            </motion.h1>
            <motion.div
              className="bg-black p-6 w-full md:w-[500px] lg:w-[600px]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {/* Eligibility checker component will handle all states */}
              <EligibilityChecker />
            </motion.div>
          </motion.div>

          {/* Right Section - Images */}
          <div className="relative z-10">
            <motion.img
              src="/AirdropImage.png"
              alt="Airdrop Bear"
              className="max-w-xs md:max-w-sm lg:max-w-md h-auto -ml-12 md:-ml-24 lg:-ml-32 -mt-8 md:-mt-12 lg:-mt-16"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: isLoaded ? 1 : 0,
                y: [0, -15, 0],
              }}
              transition={{
                opacity: { duration: 0.8, delay: 0.3 },
                y: {
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
