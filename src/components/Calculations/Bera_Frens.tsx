"use client";

import { Network, Alchemy } from "alchemy-sdk";
import { BERA_FRENS } from "../../utils/ValueConverter";

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

let lastFullFrensResult = null;

export async function checkBeraFrensEligibility(address) {
  if (!address) {
    console.log("No wallet connected");
    lastFullFrensResult = { eligible: false, message: "No wallet connected" };
    return 0;
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
      lastFullFrensResult = { eligible: false, message: "You're not eligible" };
      return 0;
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
      lastFullFrensResult = { eligible: false, message: "You're not eligible" };
      return 0;
    }

    const baseValue = BERA_FRENS;
    const usdValue = tokenCount * baseValue;

    lastFullFrensResult = {
      eligible: true,
      balance: formattedBalance,
      usdValue: usdValue,
      symbol: metadata.symbol || "BERA",
      tokenName: metadata.name || "Bera Frens",
    };

    // Return only the token count as an integer
    return Math.floor(tokenCount);
  } catch (error) {
    console.error("Error checking eligibility:", error);
    lastFullFrensResult = {
      eligible: false,
      message: `Error: ${error.message}`,
    };
    return 0;
  }
}

export function getLastFullFrensResult() {
  return lastFullFrensResult;
}

export default function BeraFrensBalance({ address }) {
  return checkBeraFrensEligibility(address);
}
