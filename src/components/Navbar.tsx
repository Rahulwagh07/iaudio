import React from 'react';
import Logo from './Logo';
import Controls from './Controls';

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
