"use client";

import { useAccount } from "wagmi";

export const ConnectButton = () => {
  const { address } = useAccount();

  console.log(address);
  return (
    <div>
      <appkit-button />
    </div>
  );
};
