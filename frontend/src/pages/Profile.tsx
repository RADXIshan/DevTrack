import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  Github, Linkedin, Twitter, Edit2, 
  Save, X, Award, Activity 
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const Profile = () => {
  const { user, setUser } = useAppStore();
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
    } catch (error) {
      console.error(error);
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
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <div className="leetcode-card rounded-lg p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
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
                    <button
                      onClick={handleCancel}
                      disabled={isLoading}
                      className="btn-leetcode-outline"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    disabled={isLoading}
                    className="btn-leetcode flex items-center gap-2"
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
                  </button>
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
                    className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
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
                    <Github className="w-5 h-5 text-muted-foreground" />
                    {isEditing ? (
                      <input
                        name="githubUrl"
                        value={formData.githubUrl}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    <Linkedin className="w-5 h-5 text-muted-foreground" />
                    {isEditing ? (
                      <input
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    <Twitter className="w-5 h-5 text-muted-foreground" />
                    {isEditing ? (
                      <input
                        name="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={handleChange}
                        placeholder="https://twitter.com/username"
                        className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-4">
            <div className="leetcode-card rounded-lg p-4">
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
            </div>

            <div className="leetcode-card rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <h3 className="font-medium text-foreground">Activity</h3>
              </div>
              <div className="text-sm text-muted-foreground">
                Keep tracking your progress to see activity insights here.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
