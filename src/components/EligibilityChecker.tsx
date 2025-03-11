"use client";

import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { checkBeraPacksEligibility } from "@/components/Calculations/Bera_Pack";
import { ConnectButton } from "@/components/ConnectButton";
import { useAccount } from "wagmi";

export default function EligibilityChecker() {
  const { address, isConnected } = useAccount();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check eligibility automatically when address changes
  useEffect(() => {
    const checkEligibility = async () => {
      if (!address) return;

      setLoading(true);
      setIsLoaded(false);

      try {
        const eligibilityResult = await checkBeraPacksEligibility(address);
        setResult(eligibilityResult);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error checking eligibility:", error);
        setResult({ eligible: false, message: "Error checking eligibility" });
      } finally {
        setLoading(false);
      }
    };

    if (isConnected && address) {
      checkEligibility();
    }
  }, [address, isConnected]);

  // Not connected state - show connect button
  if (!isConnected) {
    return (
      <>
        <p
          className="text-white mb-6"
          style={{ fontFamily: "MinecraftRegular" }}
        >
          Connect your ETH wallet to check if you&apos;re eligible for the $MONI
          airdrop.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ConnectButton />
        </motion.div>
      </>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-blue-500">Checking eligibility...</span>
      </div>
    );
  }

  // Connected but no result yet
  if (!result) {
    return (
      <p className="text-white" style={{ fontFamily: "MinecraftRegular" }}>
        Checking your wallet...
      </p>
    );
  }

  // Result available - show eligibility status
  return (
    <>
      <p className="text-white mb-6" style={{ fontFamily: "MinecraftRegular" }}>
        {result.eligible ? "Congratulations! You're eligible." : result.message}
      </p>

      {result.eligible && (
        <div className="flex justify-between items-center text-white mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full">
              <FaCheck className="w-3 h-3" />
            </span>
            <span>Holder of {result.tokenName}</span>
          </div>
          <div>
            <span>
              {result.balance} | $MONI Value: ${result.usdValue.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {!result.eligible && (
        <div className="flex items-center gap-2 text-white mb-4">
          <span className="inline-flex items-center justify-center p-1 bg-red-500 rounded-full">
            <FaTimes className="w-3 h-3" />
          </span>
          <span>Not eligible for MoniSwap Airdrop</span>
        </div>
      )}
    </>
  );
}
