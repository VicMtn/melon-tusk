import { useTheme } from '../core/ThemeContext';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import userService from '../services/userService';
import Notification from '../components/Notification'; // Import the notification component

interface UserSettings {
  username: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  avatar: string;
}

const Settings = () => {
  const { user } = useUser();
  const { theme: currentTheme, setTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John%20Doe',
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      setUserSettings(prev => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Store current user values for comparison
  const currentUsername = user?.username;
  const currentEmail = user?.email;

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const themes = [
    'light',
    'dark',
    'gourmet',
    'corporate',
    'luxury',
    'soft',
  ];

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  const handleUserSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserSettings(prev => ({
          ...prev,
          avatar: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userSettings.currentPassword){
      setNotification({
        message: 'Please enter your current password',
        type: 'error'
      });
      return;
    }

    if (userSettings.newPassword && userSettings.confirmPassword){
      if (userSettings.newPassword !== userSettings.confirmPassword){
        setNotification({
          message: 'Passwords do not match',
          type: 'error'
        });
        userSettings.newPassword = '';
        userSettings.confirmPassword = '';
        userSettings.currentPassword = '';
        return;
      }else{
        userService.updatePassword(userSettings.currentPassword, userSettings.newPassword);
      }
    }

    if (userSettings.username !== currentUsername || userSettings.email !== currentEmail){
      userService.updateUserData(userSettings.currentPassword, userSettings.email, userSettings.username);
    }
    
    setNotification({
      message: 'User settings updated successfully',
      type: 'success'
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-xl font-medium">
        Settings
      </div>
      <div className="divider m-0 h-1"></div>
      <div className="card bg-base-100 shadow relative">
        <div className="card-body">
          <h2 className="card-title mb-4">User Settings</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                value={userSettings.username}
                onChange={handleUserSettingsChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                value={userSettings.email}
                onChange={handleUserSettingsChange}
                className="input input-bordered"
              />
            </div>

            <div className="divider">Change Password</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                name="newPassword"
                value={userSettings.newPassword}
                onChange={handleUserSettingsChange}
                className="input input-bordered"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={userSettings.confirmPassword}
                onChange={handleUserSettingsChange}
                className="input input-bordered"
              />
            </div>
            
            <div className="divider">Current Password</div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Password</span>
              </label>
              <input
                type="password"
                name="currentPassword"
                value={userSettings.currentPassword}
                onChange={handleUserSettingsChange}
                className="input input-bordered"
              />
            </div>

            <div className="card-actions justify-end mt-4">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
            {notification && (
              <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(null)}
              />
            )}
          </form>
        </div>
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title mb-4">Theme Settings (still in development)</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <div
                key={theme}
                className={`card bg-base-100 cursor-pointer hover:scale-105 transition-transform
                  ${currentTheme === theme ? 'ring-2 ring-primary' : 'border border-base-300'}`}
                data-theme={theme}
                onClick={() => handleThemeChange(theme)}
              >
                <div className="card-body p-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary"></div>
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <div className="w-3 h-3 rounded-full bg-neutral"></div>
                  </div>
                  <div className="mt-2 text-sm capitalize">
                    {theme === 'gourmet' ? `${theme} - Best UI experience` : theme}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="flex flex-wrap gap-2">
              <button className="btn">Default</button>
              <button className="btn btn-primary">Primary</button>
              <button className="btn btn-secondary">Secondary</button>
              <button className="btn btn-accent">Accent</button>
              <button className="btn btn-ghost">Ghost</button>
              <button className="btn btn-link">Link</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;