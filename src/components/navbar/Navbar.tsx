import React from "react";
import Controls from "./Controls";
import Logo from "./Logo";

const Navbar: React.FC = () => {
  return (
    <nav className="p-4">
      <div className="mt-6 mx-auto flex justify-between items-center">
        <Logo />
        <Controls />
      </div>
    </nav>
  );
};

export default Navbar;
