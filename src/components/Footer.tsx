"use client";
const Footer = () => {
  return (
    <div className="w-full fixed bottom-0 left-0">
      <div className="h-8 bg-gradient-to-b from-transparent to-teal-400/10"></div>
      <div className="bg-teal-400/10">
        <div
          className="flex items-center justify-center gap-6 py-4"
          style={{ fontFamily: "MinecraftRegular" }}
        >
          <a
            href="https://twitter.com"
            className="text-white hover:text-[#F59855] transition-colors"
          >
            Twitter
          </a>
          <a
            href="https://telegram.org"
            className="text-white hover:text-[#F59855] transition-colors"
          >
            Telegram
          </a>
          <a
            href="#listing"
            className="text-white hover:text-[#F59855] transition-colors"
          >
            Listing
          </a>
          <a
            href="https://github.com"
            className="text-white hover:text-[#F59855] transition-colors"
          >
            GitHub
          </a>
          <a
            href="/docs"
            className="text-white hover:text-[#F59855] transition-colors"
          >
            Docs
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
