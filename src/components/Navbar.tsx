
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useWeb3 } from '@/contexts/Web3Context';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const { address, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    toast({
      title: 'Logged out successfully',
      description: 'You have been logged out of StorageX',
    });
  };

  const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div className="relative group" ref={ref}>
  <img
    src="https://i.ibb.co/XZmv5M8X/profile.png"
    width={50}
    height={50}
    alt="Profile"
    onClick={() => setOpen((o) => !o)}
    className="cursor-pointer border-r-2 border-[#00BFFF] rounded-full transition-all duration-300 active:scale-95 hover:shadow-lg py-2"
    style={{ boxShadow: theme === 'dark' ? '0 2px 8px #00BFFF33' : '0 2px 8px #00BFFF22' }}
  />

  <div
    className={`
      absolute top-1/3 right-0 -translate-y-1/3
      flex items-center
      transition-all duration-300
      overflow-hidden
      pointer-events-none
      group-hover:w-48 w-0
      group-hover:pl-4 pl-0
      h-14
      bg-transparent
    `}
    style={{ zIndex: 10 }}
  >
    <span className="text-[#00BFFF] text-sm font-mono bg-white dark:bg-gray-800 rounded px-2 py-1 shadow transition-opacity duration-300 opacity-0 group-hover:opacity-100">
      {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""}
    </span>
  </div>
  {open && (
    <div className="border-b absolute left-0 mt-5 w-48 bg-white dark:bg-gray-800 rounded shadow-lg z-50 flex flex-col border border-none">
      {children}
    </div>
  )}
</div>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-sm ${
        theme === 'dark'
          ? 'bg-black/90 border-gray-800'
          : 'bg-white/90 border-gray-200'
      }`}
    >
<div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
  <div className="flex justify-between items-center h-16">
    {/* Logo */}
    <Link
      to="/"
      className={`text-2xl font-bold transition-colors duration-200 ${
        theme === 'dark' ? 'text-[#00BFFF]' : 'text-[#00BFFF]'
      }`}
    >
      SpaceX
    </Link>

    {/* Right section - Auth buttons and theme toggle */}
    <div className="flex items-center space-x-2">
    {address && (
    <div className="flex space-x-2 items-center">
    <div className="mr-4">
      <Link to="/dashboard">
        <Button
          variant="outline"
          size="sm"
          className={`${
            theme === 'dark'
              ? 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black'
              : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-white'
          }`}
        >
          Dashboard
        </Button>
      </Link>
      </div>
    </div>
  )}
      <div className="flex items-center space-x-4">
        {isConnected && address ? (
          <DropdownMenu>
            <Link 
              to="/profile"
              className="block text-left w-full px-4 py-2 text-black hover:bg-[#00BFFF] hover:text-white dark:hover:text-white dark:text-white"
            >
              Manage Profile
            </Link>
            <Link 
              to="/dashboard"
              className="block text-left w-full px-4 py-2 text-black hover:bg-[#00BFFF] hover:text-white dark:hover:text-white dark:text-white"
            >
              Dashboard
            </Link>
            <button className="block text-left w-full px-4 py-2 text-black hover:bg-[#00BFFF] dark:hover:text-white dark:text-white">
              Settings
            </button>
            <button className="block text-left w-full px-4 py-2 text-black hover:bg-[#00BFFF] dark:hover:text-white dark:text-white">
              Help
            </button>
            <button
              onClick={disconnectWallet}
              className="block text-left w-full px-4 py-2 bg-red-300 dark:bg-red-500 dark:hover:bg-red-500 dark:bg-red-800 hover:bg-red-600 hover:text-white dark:hover:text-white"
            >
              Disconnect Wallet
            </button>
          </DropdownMenu>
        ) : (
          <Button
            onClick={connectWallet}
            variant="outline"
            size="sm"
            className={`${
              theme === 'dark'
                ? 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black'
                : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-white'
            }`}
          >
            Connect Wallet
          </Button>
        )}
        {/* Theme toggle - moved to the far right */}
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className={`p-2 ${
            theme === 'dark' ? 'text-[#00BFFF]' : 'text-[#00BFFF]'
          }`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </Button>
      </div>
    </div>
  </div>
</div>
    </nav>
  );
};

export default Navbar;
