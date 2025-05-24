
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, user } = useAuth();
  const { account, isConnected, connectWallet, disconnectWallet } = useWeb3();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    disconnectWallet();
    navigate('/');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of StorageX",
    });
  };

  const handleWalletConnection = async () => {
    if (isConnected) {
      disconnectWallet();
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected",
      });
    } else {
      try {
        await connectWallet();
        toast({
          title: "Wallet connected",
          description: "Your wallet has been connected successfully",
        });
      } catch (error) {
        toast({
          title: "Connection failed",
          description: "Failed to connect to your wallet",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <nav className={`w-full border-b transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-black border-gray-800' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className={`text-2xl font-bold transition-colors duration-200 ${
              theme === 'dark' ? 'text-[#00BFFF]' : 'text-[#00BFFF]'
            }`}
          >
            StorageX
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Welcome, {user?.email}
              </span>
            )}

            {isConnected && account && (
              <span className={`text-xs px-2 py-1 rounded ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-[#00BFFF]' 
                  : 'bg-gray-100 text-[#00BFFF]'
              }`}>
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            )}

            <Button
              onClick={handleWalletConnection}
              variant="outline"
              size="sm"
              className={`${
                theme === 'dark'
                  ? 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black'
                  : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-white'
              }`}
            >
              {isConnected ? 'Disconnect' : 'Connect Wallet'}
            </Button>

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

            {isAuthenticated ? (
              <div className="flex space-x-2">
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
                <Button 
                  onClick={handleLogout}
                  variant="outline" 
                  size="sm"
                  className={`${
                    theme === 'dark'
                      ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                      : 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                  }`}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`${
                      theme === 'dark'
                        ? 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black'
                        : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-white'
                    }`}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    size="sm"
                    className={`${
                      theme === 'dark'
                        ? 'bg-[#00BFFF] text-black hover:bg-[#0099CC]'
                        : 'bg-[#00BFFF] text-white hover:bg-[#0099CC]'
                    }`}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
