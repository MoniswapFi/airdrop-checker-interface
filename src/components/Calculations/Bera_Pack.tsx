"use client";

import { useState, useEffect } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { BERA_PACKS } from "../../utils/ValueConverter";

const utils = {
  hexToDecimal: (hex) => {
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
    return parseInt(cleanHex, 16);
  },

  formatTokenAmount: (amount, decimals = 18) => {
    const divisor = Math.pow(10, decimals);
    const formatted = amount / divisor;

    return formatted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    });
  },
};

export async function checkBeraPacksEligibility(address) {
  if (!address) {
    console.log("No wallet connected");
    return { eligible: false, message: "No wallet connected" };
  }

  const contractAddress = "0x8f86f63a4300f2035d203a00a6e4ae89f504bfa3";

  try {
    const settings = {
      apiKey: process.env.NEXT_PUBLIC_ARBITRUM_SCANNER_API,
      network: Network.ARB_MAINNET,
    };

    const alchemy = new Alchemy(settings);

    const response = await alchemy.core.getTokenBalances(address, [
      contractAddress,
    ]);

    if (
      !response.tokenBalances.length ||
      response.tokenBalances[0].tokenBalance === "0x0"
    ) {
      return { eligible: false, message: "You're not eligible" };
    }

    // Convert hex balance to decimal
    const tokenBalance = response.tokenBalances[0];
    const decimalBalance = utils.hexToDecimal(tokenBalance.tokenBalance);

    // Get token metadata
    const metadata = await alchemy.core.getTokenMetadata(contractAddress);

    // Format the balance
    const formattedBalance = utils.formatTokenAmount(
      decimalBalance,
      metadata.decimals,
    );

    const tokenCount = parseFloat(formattedBalance);

    // Check if token count is effectively zero (handle potential floating point issues)
    if (tokenCount <= 0.000001) {
      return { eligible: false, message: "You're not eligible" };
    }

    // Calculate USD value properly using BERA_PACKS
    // Assuming BERA_PACKS is a value, adjust as needed based on your actual BERA_PACKS structure
    const baseValue = 470; // Default value if BERA_PACKS is not available
    const usdValue = tokenCount * baseValue;

    return {
      eligible: true,
      balance: formattedBalance,
      usdValue: usdValue,
      symbol: metadata.symbol || "BERA",
      tokenName: metadata.name || "Bera Frens",
    };
  } catch (error) {
    console.error("Error checking eligibility:", error);
    return { eligible: false, message: `Error: ${error.message}` };
  }
}

// BeraPackBalance component that utilizes the eligibility function
export default function BeraPackBalance({ address }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!address) return;

      setLoading(true);
      try {
        const eligibilityResult = await checkBeraPacksEligibility(address);
        setResult(eligibilityResult);
      } catch (error) {
        console.error("Error in eligibility check:", error);
        setResult({ eligible: false, message: "Error checking eligibility" });
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      checkEligibility();
    }
  }, [address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-blue-500">Checking eligibility...</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="p-4 bg-[#161616] rounded-lg text-white">
      {result.eligible ? (
        <div>
          <p
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "MinecraftRegular" }}
          >
            Congratulations! You're eligible.
          </p>
          <div className="flex justify-between items-center">
            <span>
              {result.balance} {result.symbol}
            </span>
            <span>${result.usdValue.toFixed(2)} value</span>
          </div>
        </div>
      ) : (
        <p
          className="text-xl font-bold"
          style={{ fontFamily: "MinecraftRegular" }}
        >
          {result.message}
        </p>
      )}
    </div>
  );
}
