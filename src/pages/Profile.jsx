import React, { useState, useRef, useEffect } from 'react';
import { User, Mail, Shield, Check, Edit2, Camera, Calendar, ChevronRight, Loader2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { currentUser, updateProfile } = useAuth();
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile data states — only fields that exist in the database
  const [name, setName] = useState(currentUser?.name || '');
  const email = currentUser?.email || '';
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const role = currentUser?.role || 'User';
  const joinedDate = currentUser?.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : '—';

  // File upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Keep state in sync if currentUser updates
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
    }
  }, [currentUser]);

  const displayAvatar = avatarPreview || avatar || currentUser?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=7f1d1d&color=fff&size=200`;

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
      setAvatarFile(file);
      const objectUrl = URL.createObjectURL(file);
      setAvatarPreview(objectUrl);
      setIsEditing(true);
      setErrorMessage('');
    }
  };

  const clearSelectedFile = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setStatusMessage('');
    setErrorMessage('');

    try {
      let res;
      if (avatarFile) {
        const formData = new FormData();
        if (name) formData.append('name', name);
        formData.append('avatar', avatarFile);
        res = await updateProfile(formData);
      } else {
        res = await updateProfile({ name });
      }

      if (res && res.success) {
        if (avatarPreview) {
          URL.revokeObjectURL(avatarPreview);
        }
        setAvatarFile(null);
        setAvatarPreview(null);
        if (res.user?.avatar) {
          setAvatar(res.user.avatar);
        }
        setStatusMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setErrorMessage(res?.error || 'Failed to update profile');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error updating profile');
    } finally {
      setIsSaving(false);
      setTimeout(() => setStatusMessage(''), 4000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-6 text-zinc-100 selection:bg-red-500/30 font-sans">

      {/* Hidden File Input for Image Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Top Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0a0204] border border-white/5 shadow-2xl shadow-red-900/10 p-8 sm:p-10">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-gradient-to-bl from-red-600/30 via-red-900/10 to-transparent blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-red-950/20 to-transparent" />
        </div>

        <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">

          {/* Avatar Area with Image Upload trigger */}
          <div className="relative shrink-0 z-10 group">
            <img
              src={displayAvatar}
              alt={name}
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover ring-[3px] ring-red-600 shadow-lg shadow-red-600/20 transition-all"
            />
            <button
              type="button"
              onClick={handleCameraClick}
              className="absolute bottom-1 right-1 p-2.5 bg-[#150508] border border-red-500/40 rounded-full text-zinc-300 hover:text-white hover:bg-red-950 transition-all shadow-xl hover:scale-110 cursor-pointer"
              title="Upload Profile Picture"
              aria-label="Upload Profile Picture"
            >
              <Camera className="w-4 h-4 text-red-400" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4 w-full z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">{name}</h1>
                <div className="flex items-center gap-2 text-zinc-400 text-sm">
                  <Mail className="w-4 h-4 text-red-500" />
                  <span>{email}</span>
                </div>
              </div>

              <div className="flex flex-col md:items-end gap-3">
                <div className="hidden md:flex items-center gap-3 text-sm text-zinc-300 font-medium">
                  <span>Build</span> <span className="text-red-600 font-bold">•</span>
                  <span>Create</span> <span className="text-red-600 font-bold">•</span>
                  <span>Grow</span>
                </div>
                {isSaving ? (
                  <button disabled className="px-5 py-2 rounded-full bg-red-600/60 text-white text-sm font-bold flex items-center gap-2 cursor-not-allowed">
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </button>
                ) : isEditing ? (
                  <button onClick={handleSave} className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-colors flex items-center gap-2 cursor-pointer">
                    <Check className="w-4 h-4" /> Save Profile
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-5 py-2 rounded-full border border-red-500/50 hover:bg-red-950/50 text-red-400 hover:text-red-300 text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer">
                    <Edit2 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-900/50">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="text-xs font-bold text-red-200">Active</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-10 relative z-10">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-0.5">Joined</p>
              <p className="text-sm font-medium text-white">{joinedDate}</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-8 bg-white/10" />
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-red-500" />
            <div>
              <p className="text-[11px] text-zinc-400 uppercase tracking-wider mb-0.5">Role</p>
              <p className="text-sm font-medium text-white font-mono uppercase text-xs">{role}</p>
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Account Information */}
        <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-[#0a0204] border border-zinc-200 dark:border-white/5 p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-zinc-200 dark:border-white/5">
            <User className="w-5 h-5 text-zinc-900 dark:text-white" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Account Information</h2>
          </div>

          <div className="space-y-6 md:space-y-8">
            {/* Full Name — editable */}
            <InfoField icon={User} label="Full Name" value={name} isEditing={isEditing} onChange={setName} />

            {/* Email — read-only */}
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Mail className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1 pb-2">
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-1">Email Address</p>
                <input
                  type="text"
                  value={email}
                  disabled
                  className="w-full bg-transparent text-sm font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">

          {/* Profile Picture Card */}
          <div className="rounded-3xl bg-white dark:bg-[#0a0204] border border-zinc-200 dark:border-white/5 p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-zinc-900 dark:text-white" />
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Profile Picture</h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <img src={displayAvatar} alt="Profile" className="w-16 h-16 rounded-full object-cover ring-2 ring-red-600/50" />
              <div className="flex-1 space-y-2 w-full">
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="px-4 py-2 rounded-full border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" /> Select Image File
                </button>

                {avatarFile && (
                  <div className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 bg-red-50 dark:bg-red-950/40 p-2 rounded-xl border border-red-200 dark:border-red-500/20">
                    <span className="truncate flex-1">New: {avatarFile.name}</span>
                    <button
                      type="button"
                      onClick={clearSelectedFile}
                      className="p-0.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-white rounded"
                      title="Clear selected image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Account Settings Banner */}
      <button className="w-full rounded-2xl bg-white dark:bg-[#0a0204] border border-zinc-200 dark:border-white/5 p-5 md:p-6 flex items-center justify-between group hover:bg-zinc-50 dark:hover:bg-[#110306] transition-colors shadow-xl cursor-pointer">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-500">
            <Shield className="w-6 h-6" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">Account Settings</h3>
            <p className="text-[13px] text-zinc-600 dark:text-zinc-400 font-medium">Manage your account preferences and security.</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
      </button>

    </div>
  );
}

// Helper Component for Fields
function InfoField({ icon: Icon, label, value, isEditing, onChange }) {
  return (
    <div className="flex items-start gap-4 group">
      <div className="mt-1">
        <Icon className="w-5 h-5 text-red-600" />
      </div>
      <div className="flex-1 pb-2">
        <p className="text-[13px] text-zinc-500 dark:text-zinc-400 mb-1">{label}</p>
        {isEditing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full max-w-sm bg-zinc-50 dark:bg-[#150508] border border-zinc-300 dark:border-red-500/30 rounded-lg px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white focus:outline-none focus:border-red-500 transition-colors"
          />
        ) : (
          <p className="text-sm font-medium text-zinc-900 dark:text-white">{value}</p>
        )}
      </div>
    </div>
  );
}
