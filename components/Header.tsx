import React from "react";

const Header = () => (
  <header className="p-4">
    <a className="flex" href="http://localhost:3000">
      <img src="/coin.svg" className="w-6" alt="Money Maker Logo" />
      <h1 className="ml-4">Money Maker</h1>
    </a>
  </header>
);

export default Header;
