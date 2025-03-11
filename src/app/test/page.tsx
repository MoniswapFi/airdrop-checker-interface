"use client";

import { useEffect, useState } from "react";
import { Network, Alchemy } from "alchemy-sdk";
import { useAccount } from "wagmi";

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

export default function ImprovedTokenBalancesPage() {
  const address = "0x7CeD7b20111476947eC5C4b89BdcbEAfE864BC98";
  const [tokenBalances, setTokenBalances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const contractAddress = "0x8f86f63a4300f2035d203a00a6e4ae89f504bfa3";

  useEffect(() => {
    const fetchTokenBalances = async () => {
      if (!address) {
        console.log("No wallet connected");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Initialize Alchemy SDK
        const settings = {
          apiKey: process.env.NEXT_PUBLIC_ARBITRUM_SCANNER_API,
          network: Network.ARB_MAINNET,
        };

        const alchemy = new Alchemy(settings);

        // Fetch token balances for the specific contract
        const response = await alchemy.core.getTokenBalances(address, [
          contractAddress,
        ]);
        console.log("Raw token balances response:", response);

        // Process the token balances
        const processedBalances = response.tokenBalances.map((tokenBalance) => {
          // Convert hex balance to decimal
          const decimalBalance = utils.hexToDecimal(tokenBalance.tokenBalance);

          return {
            contractAddress: tokenBalance.contractAddress,
            rawBalance: tokenBalance.tokenBalance,
            decimalBalance: decimalBalance,
          };
        });

        // Fetch token metadata to get names and symbols
        const enhancedBalances = await Promise.all(
          processedBalances.map(async (token) => {
            try {
              const metadata = await alchemy.core.getTokenMetadata(
                token.contractAddress,
              );
              return {
                ...token,
                name: metadata.name || "Unknown Token",
                symbol: metadata.symbol || "???",
                decimals: metadata.decimals || 0,
                logo: metadata.logo || null,
                formattedBalance: utils.formatTokenAmount(
                  token.decimalBalance,
                  metadata.decimals,
                ),
              };
            } catch (err) {
              console.error(
                `Error fetching metadata for ${token.contractAddress}:`,
                err,
              );
              return {
                ...token,
                name: "Unknown Token",
                symbol: "???",
                decimals: 0,
                formattedBalance: token.decimalBalance.toString(),
              };
            }
          }),
        );

        setTokenBalances(enhancedBalances);
      } catch (err) {
        console.error("Error fetching token balances:", err);
        setError(err.message || "Failed to fetch token balances");
      } finally {
        setLoading(false);
      }
    };

    if (address) {
      fetchTokenBalances();
    }
  }, [address]); // Re-run when address changes

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Token Holdings</h1>

      {!address && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-700">
            Please connect your wallet to see token balances.
          </p>
        </div>
      )}

      {address && (
        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="font-medium text-gray-700">Connected Wallet</p>
          <p className="font-mono text-sm mt-1 text-gray-600">{address}</p>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-blue-500">Loading token balances...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">Error: {error}</p>
        </div>
      )}

      {tokenBalances.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Your Token Holdings</h2>

          {tokenBalances.map((token, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg p-4 mb-4 border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {token.logo ? (
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-gray-500 font-bold">
                        {token.symbol?.charAt(0) || "?"}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold">{token.name}</h3>
                    <p className="text-gray-500 text-sm">{token.symbol}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg">{token.formattedBalance}</p>
                  <p className="text-gray-500 text-sm">{token.symbol}</p>
                </div>
              </div>

              {/* Optional: Display raw hex value for debugging */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-mono">
                  Raw: {token.rawBalance}
                </p>
                <p className="text-xs text-gray-400">
                  Decimal: {token.decimalBalance}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : address && !loading ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center border border-gray-200">
          <p className="text-gray-600">No tokens found for this contract.</p>
          <p className="text-gray-500 text-sm mt-1">
            Contract: {contractAddress}
          </p>
        </div>
      ) : null}
    </div>
  );
}
