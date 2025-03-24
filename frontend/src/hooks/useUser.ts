import { useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import { User } from '../types/user';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (userService.isAuthenticated()) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refreshUser
  };
}; 