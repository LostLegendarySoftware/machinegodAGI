/**
 * Authentication Service
 * Handles user registration, login, and session management
 */

export interface User {
  id: string;
  email: string;
  displayName: string;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  apiUsage: {
    current: number;
    limit: number;
    resetDate: Date;
  };
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    dataRetention: number; // days
  };
  createdAt: Date;
  lastLogin: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export class AuthService {
  private static instance: AuthService;
  private authState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };
  private listeners: ((state: AuthState) => void)[] = [];

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private constructor() {
    this.initializeAuth();
  }

  private async initializeAuth() {
    this.setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const user = await this.validateToken(token);
        if (user) {
          this.setUser(user);
        } else {
          localStorage.removeItem('auth_token');
        }
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      this.setError('Authentication initialization failed');
    } finally {
      this.setLoading(false);
    }
  }

  async register(email: string, password: string, displayName: string): Promise<User> {
    this.setLoading(true);
    this.setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'test@example.com') {
        throw new Error('Email already exists');
      }

      const user: User = {
        id: `user_${Date.now()}`,
        email,
        displayName,
        subscriptionTier: 'free',
        apiUsage: {
          current: 0,
          limit: 100,
          resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        },
        preferences: {
          theme: 'dark',
          notifications: true,
          dataRetention: 30
        },
        createdAt: new Date(),
        lastLogin: new Date()
      };

      const token = this.generateToken(user);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));

      this.setUser(user);
      return user;
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Registration failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async login(email: string, password: string): Promise<User> {
    this.setLoading(true);
    this.setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'admin@machinegod.ai' && password === 'admin123') {
        const user: User = {
          id: 'admin_user',
          email,
          displayName: 'Admin User',
          subscriptionTier: 'enterprise',
          apiUsage: {
            current: 50,
            limit: 10000,
            resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          preferences: {
            theme: 'dark',
            notifications: true,
            dataRetention: 90
          },
          createdAt: new Date('2024-01-01'),
          lastLogin: new Date()
        };

        const token = this.generateToken(user);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));

        this.setUser(user);
        return user;
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      this.setError(error instanceof Error ? error.message : 'Login failed');
      throw error;
    } finally {
      this.setLoading(false);
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.setUser(null);
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    if (!this.authState.user) {
      throw new Error('Not authenticated');
    }

    const updatedUser = { ...this.authState.user, ...updates };
    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    this.setUser(updatedUser);
    return updatedUser;
  }

  async upgradeSubscription(tier: 'pro' | 'enterprise'): Promise<User> {
    if (!this.authState.user) {
      throw new Error('Not authenticated');
    }

    const limits = {
      pro: 1000,
      enterprise: 10000
    };

    const updatedUser = {
      ...this.authState.user,
      subscriptionTier: tier,
      apiUsage: {
        ...this.authState.user.apiUsage,
        limit: limits[tier]
      }
    };

    localStorage.setItem('user_data', JSON.stringify(updatedUser));
    this.setUser(updatedUser);
    return updatedUser;
  }

  private async validateToken(token: string): Promise<User | null> {
    try {
      const userData = localStorage.getItem('user_data');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch {
      return null;
    }
  }

  private generateToken(user: User): string {
    return btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
  }

  private setUser(user: User | null) {
    this.authState = {
      ...this.authState,
      user,
      isAuthenticated: !!user
    };
    this.notifyListeners();
  }

  private setLoading(isLoading: boolean) {
    this.authState = { ...this.authState, isLoading };
    this.notifyListeners();
  }

  private setError(error: string | null) {
    this.authState = { ...this.authState, error };
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.authState));
  }

  subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getAuthState(): AuthState {
    return this.authState;
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }
}