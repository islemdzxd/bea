'use client';

import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';
import { getSessionClientProfile } from '@/lib/client-session';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'password' | 'profile' | 'security'>('password');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileSuccess, setProfileSuccess] = useState('');

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    biometricAuth: true,
    loginAlerts: true,
    sessionTimeout: '30',
  });

  useEffect(() => {
    const profile = getSessionClientProfile();
    if (!profile) return;

    const fallbackEmail = profile.cli ? `${profile.cli.toLowerCase()}@bea.local` : '';
    setProfileForm({
      firstName: profile.prenom ?? profile.firstName ?? '',
      lastName: profile.nom ?? profile.lastName ?? '',
      email: profile.email ?? fallbackEmail,
      phone: profile.phone ?? '',
    });
  }, []);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }

    return errors;
  };

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    if (!profileForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!profileForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!profileForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = 'Valid email is required';
    }

    if (!profileForm.phone.trim()) {
      errors.phone = 'Phone number is required';
    }

    return errors;
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validatePasswordForm();

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    // Mock password change
    setPasswordSuccess('Password changed successfully!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setTimeout(() => setPasswordSuccess(''), 3000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateProfileForm();

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    // Mock profile update
    setProfileSuccess('Profile updated successfully!');
    setTimeout(() => setProfileSuccess(''), 3000);
  };

  const handleSecurityChange = (setting: string, value: boolean | string) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account and security settings</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-border">
        <button
          onClick={() => setActiveTab('password')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'password'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 font-medium border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Security
        </button>
      </div>

      {/* Password Tab */}
      {activeTab === 'password' && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Change Password</h2>

          {passwordSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700">{passwordSuccess}</p>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Current Password *</label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  placeholder="••••••••"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.currentPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPasswords.current ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.currentPassword && (
                <p className="text-xs text-red-500">{passwordErrors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">New Password *</label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? 'text' : 'password'}
                  name="newPassword"
                  placeholder="••••••••"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.newPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      new: !prev.new,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPasswords.new ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>
              )}
              <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password *</label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className={passwordErrors.confirmPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPasswords.confirm ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-xs text-red-500">{passwordErrors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-blue-900 text-white font-semibold"
            >
              Update Password
            </Button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Password Requirements</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Minimum 8 characters</li>
              <li>• Mix of uppercase and lowercase letters</li>
              <li>• At least one number</li>
              <li>• At least one special character (!@#$%)</li>
            </ul>
          </div>
        </Card>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Update Profile</h2>

          {profileSuccess && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700">{profileSuccess}</p>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-md">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First Name *</label>
                <Input
                  type="text"
                  name="firstName"
                  value={profileForm.firstName}
                  onChange={handleProfileChange}
                  className={profileErrors.firstName ? 'border-red-500' : ''}
                />
                {profileErrors.firstName && (
                  <p className="text-xs text-red-500">{profileErrors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last Name *</label>
                <Input
                  type="text"
                  name="lastName"
                  value={profileForm.lastName}
                  onChange={handleProfileChange}
                  className={profileErrors.lastName ? 'border-red-500' : ''}
                />
                {profileErrors.lastName && (
                  <p className="text-xs text-red-500">{profileErrors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email *</label>
              <Input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className={profileErrors.email ? 'border-red-500' : ''}
              />
              {profileErrors.email && (
                <p className="text-xs text-red-500">{profileErrors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone *</label>
              <Input
                type="tel"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
                className={profileErrors.phone ? 'border-red-500' : ''}
              />
              {profileErrors.phone && (
                <p className="text-xs text-red-500">{profileErrors.phone}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-blue-900 text-white font-semibold"
            >
              Save Changes
            </Button>
          </form>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Security Settings</h2>

          <div className="space-y-6 max-w-md">
            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium text-foreground">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() =>
                  handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securitySettings.twoFactorAuth
                    ? 'bg-primary'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Biometric Authentication */}
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium text-foreground">Biometric Login</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Use fingerprint or face recognition
                </p>
              </div>
              <button
                onClick={() =>
                  handleSecurityChange('biometricAuth', !securitySettings.biometricAuth)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securitySettings.biometricAuth
                    ? 'bg-primary'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securitySettings.biometricAuth ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Login Alerts */}
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="font-medium text-foreground">Login Alerts</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Get notified of new login attempts
                </p>
              </div>
              <button
                onClick={() =>
                  handleSecurityChange('loginAlerts', !securitySettings.loginAlerts)
                }
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  securitySettings.loginAlerts
                    ? 'bg-primary'
                    : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Session Timeout */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Session Timeout</label>
              <select
                value={securitySettings.sessionTimeout}
                onChange={(e) =>
                  handleSecurityChange('sessionTimeout', e.target.value)
                }
                className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="never">Never</option>
              </select>
            </div>

            <Button
              className="w-full bg-primary hover:bg-blue-900 text-white font-semibold"
              onClick={() => {
                alert('Security settings updated!');
              }}
            >
              Save Security Settings
            </Button>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-primary/20 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Recent Activity</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Logged in from Chrome on Windows - Today at 10:30 AM</li>
              <li>• Password changed - 5 days ago</li>
              <li>• New device login from Safari on iPhone - 1 week ago</li>
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
}
