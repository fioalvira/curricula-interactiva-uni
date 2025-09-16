
import { useState, useEffect, createContext, useContext } from 'react';
import { createDefaultTemplate } from '@/utils/createDefaultTemplate';

interface User {
  email: string;
  id: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedUser = localStorage.getItem('curriculum-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (email: string, password: string): Promise<boolean> => {
    // Simple validation
    if (!email || !password || password.length < 6) {
      return false;
    }

    // Check if user already exists
    const existingUsers = JSON.parse(localStorage.getItem('curriculum-users') || '[]');
    if (existingUsers.find((u: any) => u.email === email)) {
      return false; // User already exists
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email,
      password, // In production, this should be hashed
    };

    existingUsers.push(newUser);
    localStorage.setItem('curriculum-users', JSON.stringify(existingUsers));

    // Create default curriculum template for the new user
    const defaultTemplate = createDefaultTemplate(newUser.id);
    const existingTemplates = JSON.parse(localStorage.getItem('curriculum-templates') || '[]');
    existingTemplates.push(defaultTemplate);
    localStorage.setItem('curriculum-templates', JSON.stringify(existingTemplates));

    console.log('Created default template for new user:', defaultTemplate);

    // Auto-login after registration
    const userSession = { email, id: newUser.id };
    setUser(userSession);
    localStorage.setItem('curriculum-user', JSON.stringify(userSession));

    return true;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('curriculum-users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userSession = { email, id: user.id };
      setUser(userSession);
      localStorage.setItem('curriculum-user', JSON.stringify(userSession));
      
      // Check if user has a default template, create one if they don't
      const existingTemplates = JSON.parse(localStorage.getItem('curriculum-templates') || '[]');
      const userTemplates = existingTemplates.filter((t: any) => t.userId === user.id);
      
      if (userTemplates.length === 0) {
        const defaultTemplate = createDefaultTemplate(user.id);
        existingTemplates.push(defaultTemplate);
        localStorage.setItem('curriculum-templates', JSON.stringify(existingTemplates));
        console.log('Created default template for existing user:', defaultTemplate);
      }
      
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('curriculum-user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
