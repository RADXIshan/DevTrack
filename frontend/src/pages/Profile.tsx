import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Edit2, Save, X, Award, Activity 
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { motion } from 'framer-motion';
import Toast from '../components/layout/Toast';
import { useToast } from '../lib/useToast';

const Profile = () => {
  const { user, setUser } = useAppStore();
  const { toasts, dismiss, toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user?.bio || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    twitterUrl: user?.twitterUrl || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        twitterUrl: user.twitterUrl || '',
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await axios.put(`${API_BASE_URL}/api/users/profile`, formData, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setUser({ ...user!, ...res.data });
      setIsEditing(false);
      toast("success", "Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast("error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        githubUrl: user.githubUrl || '',
        linkedinUrl: user.linkedinUrl || '',
        twitterUrl: user.twitterUrl || '',
      });
    }
    setIsEditing(false);
  }

  if (!user) return null;

  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-background">
      <Toast toasts={toasts} onDismiss={dismiss} />
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="leetcode-card rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-2xl font-bold text-primary">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Joined {joinDate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <motion.button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="btn-leetcode-outline"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isLoading}
                    className="btn-leetcode flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4" />
                        {isLoading ? 'Saving...' : 'Save'}
                      </>
                    ) : (
                      <>
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-foreground mb-3">About</h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
                  />
                ) : (
                  <p className="text-muted-foreground">
                    {user.bio || "No bio added yet."}
                  </p>
                )}
              </div>

              {/* Social Links */}
              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">Social Links</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm w-20">GitHub:</span>
                    {isEditing ? (
                      <input
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {formData.githubUrl ? (
                          <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                            {formData.githubUrl}
                          </a>
                        ) : (
                          "Not set"
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm w-20">LinkedIn:</span>
                    {isEditing ? (
                      <input
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {formData.linkedinUrl ? (
                          <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                            {formData.linkedinUrl}
                          </a>
                        ) : (
                          "Not set"
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-sm w-20">Twitter:</span>
                    {isEditing ? (
                      <input
                        name="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={handleChange}
                        placeholder="https://twitter.com/username"
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    ) : (
                      <span className="text-muted-foreground">
                        {formData.twitterUrl ? (
                          <a href={formData.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                            {formData.twitterUrl}
                          </a>
                        ) : (
                          "Not set"
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <motion.div 
              className="leetcode-card rounded-lg p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-5 h-5 text-primary" />
                <h3 className="font-medium text-foreground">Statistics</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-foreground">{user._count?.problems || 0}</div>
                  <div className="text-sm text-muted-foreground">Problems Solved</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-400">
                    {user._count?.problems ? (user._count.problems > 50 ? 'Expert' : user._count.problems > 20 ? 'Intermediate' : 'Beginner') : 'New'}
                  </div>
                  <div className="text-sm text-muted-foreground">Level</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="leetcode-card rounded-lg p-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-foreground">Activity</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Keep tracking your progress to see activity insights here.
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
