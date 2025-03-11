"use client";

import { useAccount } from "wagmi";

export const ConnectButton = () => {
  const { address } = useAccount();

  console.log("THIS IS YOUR ACCOUNT", address);
  return (
    <div>
      <appkit-button />
    </div>
  );
};
