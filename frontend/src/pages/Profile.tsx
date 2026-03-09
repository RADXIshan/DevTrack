import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { 
  User, Github, Linkedin, Twitter, Edit2, 
  Save, X, Award, Clock, Activity 
} from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl p-6 sm:p-8 border border-border/40 shadow-sm relative overflow-hidden"
      >
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1 w-full space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.email}
                </p>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4" />
                  Joined {joinDate}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {isEditing && (
                  <button
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-lg transition-colors font-medium border border-border"
                  >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline">Cancel</span>
                  </button>
                )}
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground rounded-lg transition-colors font-medium border border-primary/20 hover:border-transparent"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline">Save</span>
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40">
              <h2 className="text-lg font-semibold mb-4 text-foreground/90">About Me</h2>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a brief bio about yourself..."
                  className="w-full h-32 p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-shadow"
                />
              ) : (
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {user.bio || "No bio added yet. Click edit to add one!"}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-border/40">
              <h2 className="text-lg font-semibold mb-4 text-foreground/90">Social Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 group">
                  <div className="p-2.5 bg-secondary group-hover:bg-secondary/80 rounded-lg text-muted-foreground transition-colors">
                    <Github className="w-5 h-5" />
                  </div>
                  {isEditing ? (
                    <input
                      name="githubUrl"
                      value={formData.githubUrl}
                      onChange={handleChange}
                      placeholder="GitHub URL"
                      className="flex-1 bg-background border border-border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-primary transition-shadow"
                    />
                  ) : (
                    formData.githubUrl ? (
                      <a href={formData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate hover:text-primary/80 transition-colors">
                        {formData.githubUrl.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    ) : (
                      <span className="text-muted-foreground/50 italic text-sm">Not set</span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-2.5 bg-secondary group-hover:bg-secondary/80 rounded-lg transition-colors text-blue-500/80">
                    <Linkedin className="w-5 h-5" />
                  </div>
                  {isEditing ? (
                    <input
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="LinkedIn URL"
                      className="flex-1 bg-background border border-border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-primary transition-shadow"
                    />
                  ) : (
                    formData.linkedinUrl ? (
                      <a href={formData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate hover:text-primary/80 transition-colors">
                        {formData.linkedinUrl.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    ) : (
                      <span className="text-muted-foreground/50 italic text-sm">Not set</span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3 group">
                  <div className="p-2.5 bg-secondary group-hover:bg-secondary/80 rounded-lg transition-colors text-sky-500/80">
                    <Twitter className="w-5 h-5" />
                  </div>
                  {isEditing ? (
                    <input
                      name="twitterUrl"
                      value={formData.twitterUrl}
                      onChange={handleChange}
                      placeholder="Twitter URL"
                      className="flex-1 bg-background border border-border rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-primary transition-shadow"
                    />
                  ) : (
                    formData.twitterUrl ? (
                      <a href={formData.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate hover:text-primary/80 transition-colors">
                        {formData.twitterUrl.replace(/^https?:\/\/(www\.)?/, '')}
                      </a>
                    ) : (
                      <span className="text-muted-foreground/50 italic text-sm">Not set</span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Sidebar */}
          <div className="w-full md:w-72 space-y-4">
            <h2 className="text-lg font-semibold mb-4 md:hidden">Statistics</h2>
            <div className="bg-secondary/30 rounded-xl p-5 border border-border/50 hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-primary/20 text-primary p-3 rounded-xl shadow-inner shadow-primary/10">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Problems Solved</div>
                  <div className="text-3xl font-bold tracking-tight">{user._count?.problems || 0}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-secondary/30 rounded-xl p-5 border border-border/50 hover:bg-secondary/40 transition-colors">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-emerald-500/20 text-emerald-500 p-3 rounded-xl shadow-inner shadow-emerald-500/10">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Activity Level</div>
                  <div className="text-xl font-bold">
                    {user._count?.problems ? (user._count.problems > 50 ? 'High 🔥' : 'Medium') : 'New 🌱'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
