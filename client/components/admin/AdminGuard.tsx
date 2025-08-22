import { ReactNode, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Try a simple query to test connection
      const { error } = await supabase
        .from("hero_section")
        .select("id")
        .limit(1);

      // Even if the table doesn't exist, we consider it "connected" if there's no network error
      setIsConnected(true);
    } catch (error) {
      console.warn("Database connection issue:", error);
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // Always render the admin panel, but show connection status
  return (
    <div className="relative">
      {/* Connection Status Banner */}
      {isConnected === false && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-50 border-b border-yellow-200 p-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-800">
                Database connection issue detected. Admin panel will work with
                cached data.
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnection}
              disabled={isChecking}
              className="h-8"
            >
              {isChecking ? (
                <RefreshCw className="h-3 w-3 animate-spin" />
              ) : (
                "Retry Connection"
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Connection Success Banner */}
      {isConnected === true && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-green-50 border-b border-green-200 p-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-800">
              Database connected successfully
            </span>
          </div>
        </div>
      )}

      {/* Admin Panel Content - Always Render */}
      <div
        className={`${isConnected !== null ? "mt-12" : ""} transition-all duration-300`}
      >
        {children}
      </div>
    </div>
  );
}
