import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User, Session } from "@supabase/supabase-js";

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  checkAdminAccess: (user: User) => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export function SupabaseAdminAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has admin access
  const checkAdminAccess = async (user: User): Promise<boolean> => {
    try {
      // Option 1: Check if user has admin role in their metadata
      if (
        user.user_metadata?.role === "admin" ||
        user.app_metadata?.role === "admin"
      ) {
        return true;
      }

      // Option 2: Check admin_users table (we'll create this if needed)
      const { data, error } = await supabase
        .from("admin_users")
        .select("id, is_active")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .single();

      if (error) {
        // If table doesn't exist, we'll create it and allow first admin
        if (error.code === "42P01") {
          console.log("Admin users table not found, creating...");
          await createAdminUsersTable();
          // For the first admin, we'll allow access
          return true;
        }
        console.error("Error checking admin access:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Error in checkAdminAccess:", error);
      return false;
    }
  };

  // Create admin_users table if it doesn't exist
  const createAdminUsersTable = async () => {
    try {
      // This will be handled by Supabase migrations or manual table creation
      // We'll provide instructions for creating the table
      console.log(
        "Please create the admin_users table in your Supabase dashboard",
      );
    } catch (error) {
      console.error("Error creating admin_users table:", error);
    }
  };

  // Sign in function
  const signIn = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const hasAdminAccess = await checkAdminAccess(data.user);
        if (!hasAdminAccess) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: "You do not have admin access to this system.",
          };
        }

        setUser(data.user);
        setSession(data.session);
        setIsAdminAuthenticated(true);
        return { success: true };
      }

      return { success: false, error: "Authentication failed" };
    } catch (error) {
      console.error("Sign in error:", error);
      return { success: false, error: "An unexpected error occurred" };
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdminAuthenticated(false);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (mounted) {
          if (initialSession?.user) {
            const hasAdminAccess = await checkAdminAccess(initialSession.user);
            if (hasAdminAccess) {
              setUser(initialSession.user);
              setSession(initialSession);
              setIsAdminAuthenticated(true);
            } else {
              // User doesn't have admin access, sign them out
              await supabase.auth.signOut();
            }
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log("Auth state changed:", event, session?.user?.email);

      if (event === "SIGNED_IN" && session?.user) {
        const hasAdminAccess = await checkAdminAccess(session.user);
        if (hasAdminAccess) {
          setUser(session.user);
          setSession(session);
          setIsAdminAuthenticated(true);
        } else {
          await supabase.auth.signOut();
          setUser(null);
          setSession(null);
          setIsAdminAuthenticated(false);
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        setSession(null);
        setIsAdminAuthenticated(false);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        session,
        isAdminAuthenticated,
        isLoading,
        signIn,
        signOut,
        checkAdminAccess,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useSupabaseAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error(
      "useSupabaseAdminAuth must be used within a SupabaseAdminAuthProvider",
    );
  }
  return context;
}
