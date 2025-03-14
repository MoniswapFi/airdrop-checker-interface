"use client";
import { useState, useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import {
  checkBeraPacksEligibility,
  getLastFullResult,
} from "@/components/Calculations/Bera_Pack";
import {
  checkBeraFrensEligibility,
  getLastFullFrensResult,
} from "@/components/Calculations/Bera_Frens";

import { ConnectButton } from "@/components/ConnectButton";
import { useAccount } from "wagmi";

// Define all airdrop items to check
const airdropItems = [
  {
    id: "bera-pack",
    name: "Bera Pack",
    checkEligibility: checkBeraPacksEligibility,
    getFullResult: getLastFullResult,
  },
  {
    id: "bera-frens",
    name: "Bera Frens",
    checkEligibility: checkBeraFrensEligibility,
    getFullResult: getLastFullFrensResult,
  },
];

export default function EligibilityChecker() {
  const { address, isConnected } = useAccount();
  // const address = "0xf96Be336D78294633A04b10b97fA78DbFA8841C0";
  // const isConnected = true;
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check eligibility automatically when address changes
  useEffect(() => {
    const checkEligibility = async () => {
      if (!address) return;
      setLoading(true);
      setIsLoaded(false);

      try {
        const eligibilityResults = [];

        // Check each item
        for (const item of airdropItems) {
          const count = await item.checkEligibility(address);
          const fullResult = item.getFullResult();

          eligibilityResults.push({
            id: item.id,
            name: item.name,
            count,
            fullResult,
          });
        }

        setResults(eligibilityResults);
        setIsLoaded(true);

        // Log the total count for airdrop
        const totalCount = eligibilityResults.reduce(
          (sum, item) => sum + item.count,
          0,
        );
        console.log("Total Eligible Items:", totalCount);
      } catch (error) {
        console.error("Error checking eligibility:", error);
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
  if (!isLoaded) {
    return (
      <p className="text-white" style={{ fontFamily: "MinecraftRegular" }}>
        Checking your wallet...
      </p>
    );
  }

  // Calculate total eligible items
  const totalEligibleItems = results.reduce((sum, item) => sum + item.count, 0);

  // Result available - show eligibility status
  return (
    <>
      <p className="text-white mb-6" style={{ fontFamily: "MinecraftRegular" }}>
        {totalEligibleItems > 0
          ? "Congratulations! You're eligible for the following:"
          : "Sorry, you are not eligible for any items."}
      </p>

      {/* Map out each eligible item */}
      <div className="space-y-4 mb-6">
        {results.map((item) => {
          if (item.count <= 0) return null;

          const result = item.fullResult;

          return (
            <div
              key={item.id}
              className="flex justify-between items-center text-white mb-4"
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center p-1 bg-gradient-to-r from-amber-500 to-pink-500 rounded-full">
                  <FaCheck className="w-3 h-3" />
                </span>
                <span>Holder of {result.tokenName || item.name}</span>
              </div>
              <div>
                <span>{result.balance} $MONI</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show warning if not eligible */}
      {totalEligibleItems <= 0 && (
        <div className="flex items-center gap-2 text-white mb-4">
          <span className="inline-flex items-center justify-center p-1 bg-red-500 rounded-full">
            <FaTimes className="w-3 h-3" />
          </span>
          <span>You are not eligible for an Airdrop reward! Sorry!</span>
        </div>
      )}

      {/* Total allocation section (only show if eligible) */}
      {totalEligibleItems > 0 && (
        <div className="border-t border-gray-700 pt-4 mb-4">
          <div className="flex justify-between items-center text-white">
            <span className="text-lg py-4">TOTAL ALLOCATION</span>
            <span className="text-3xl font-bold">
              $
              {results
                .reduce((sum, item) => {
                  if (item.count <= 0) return sum;
                  return sum + (item.fullResult?.usdValue || 0);
                }, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Redeem button if eligible */}
      {totalEligibleItems > 0 && (
        <motion.button
          className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold rounded-lg shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            // Log total count when redeeming
            console.log("Redeeming total items:", totalEligibleItems);
            // Add your redeem logic here
          }}
        >
          REDEEM AIRDROP
        </motion.button>
      )}
    </>
  );
}
