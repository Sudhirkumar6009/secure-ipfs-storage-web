
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useWeb3 } from '../contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { User, Upload } from 'lucide-react';

const Profile = () => {
  const { theme } = useTheme();
  const { address, isConnected } = useWeb3();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfileImage(event.target?.result as string);
      toast({
        title: "Photo uploaded",
        description: "Profile photo has been updated",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUpdateDetails = () => {
    console.log('Profile Update Details:');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Wallet Address:', address);
    
    toast({
      title: "Details updated",
      description: "Profile information has been updated (check console)",
    });
    
    setIsEditing(false);
  };

  if (!isConnected) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        theme === 'dark' ? 'bg-black' : 'bg-white'
      }`}>
        <Card className={`max-w-md w-full mx-4 ${
          theme === 'dark' 
            ? 'bg-gray-900 border-gray-800' 
            : 'bg-white border-gray-200'
        }`}>
          <CardContent className="pt-6 text-center">
            <p className={`${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Please connect your wallet to access your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-black' : 'bg-white'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Profile
          </h1>
          <p className={`mt-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage your account information
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image Section */}
          <div className="lg:col-span-1">
            <Card className={`${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-200'
            }`}>
              <CardHeader>
                <CardTitle className={`text-center ${
                  theme === 'dark' ? 'text-[#00BFFF]' : 'text-[#00BFFF]'
                }`}>
                  Profile Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="flex justify-center">
                  <Avatar className="w-32 h-32">
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt="Profile" />
                    ) : (
                      <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                        <User className="w-16 h-16 text-gray-400" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                
                <div>
                  <input
                    type="file"
                    id="profile-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById('profile-upload')?.click()}
                    variant="outline"
                    className={`${
                      theme === 'dark'
                        ? 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-black'
                        : 'border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-white'
                    }`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {profileImage ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details Section */}
          <div className="lg:col-span-2">
            <Card className={`${
              theme === 'dark' 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-200'
            }`}>
              <CardHeader>
                <CardTitle className={`${
                  theme === 'dark' ? 'text-[#00BFFF]' : 'text-[#00BFFF]'
                }`}>
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Wallet Address (Read-only) */}
                <div>
                  <Label className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    Wallet Address
                  </Label>
                  <Input
                    value={`${address?.slice(0, 6)}...${address?.slice(-4)}`}
                    readOnly
                    className={`mt-1 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-gray-300' 
                        : 'bg-gray-50 border-gray-300 text-gray-600'
                    }`}
                  />
                </div>

                {/* Name Field */}
                <div>
                  <Label className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    Full Name
                  </Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={!isEditing}
                    className={`mt-1 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    } ${!isEditing ? 'opacity-60' : ''}`}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <Label className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                    Email Address
                  </Label>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    type="email"
                    disabled={!isEditing}
                    className={`mt-1 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-white border-gray-300'
                    } ${!isEditing ? 'opacity-60' : ''}`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className={`${
                        theme === 'dark'
                          ? 'bg-[#00BFFF] text-black hover:bg-[#00BFFF]/90'
                          : 'bg-[#00BFFF] text-white hover:bg-[#00BFFF]/90'
                      }`}
                    >
                      Update Details
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleUpdateDetails}
                        className={`${
                          theme === 'dark'
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        Save Changes
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className={`${
                          theme === 'dark'
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                            : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
