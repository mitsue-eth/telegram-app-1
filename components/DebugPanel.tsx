"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bug,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

interface LogEntry {
  id: string;
  timestamp: string;
  level: "log" | "warn" | "error" | "info";
  message: string;
  data?: unknown;
}

interface DebugPanelProps {
  isTelegramEnv: boolean;
  user: unknown;
  isLoading: boolean;
}

export default function DebugPanel({
  isTelegramEnv,
  user,
  isLoading,
}: DebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [showLogs, setShowLogs] = useState(true);

  // Override console methods to capture logs
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;

    const addLog = (level: LogEntry["level"], ...args: unknown[]) => {
      const message = args
        .map((arg) =>
          typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
        )
        .join(" ");

      const newLog: LogEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
        data: args.length > 1 ? args.slice(1) : undefined,
      };

      setLogs((prev) => [...prev.slice(-49), newLog]); // Keep last 50 logs
    };

    console.log = (...args) => {
      originalLog(...args);
      addLog("log", ...args);
    };

    console.warn = (...args) => {
      originalWarn(...args);
      addLog("warn", ...args);
    };

    console.error = (...args) => {
      originalError(...args);
      addLog("error", ...args);
    };

    console.info = (...args) => {
      originalInfo(...args);
      addLog("info", ...args);
    };

    return () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
    };
  }, []);

  const clearLogs = () => {
    setLogs([]);
  };

  const copyLogs = () => {
    const logText = logs
      .map(
        (log) =>
          `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${
            log.data ? "\n" + JSON.stringify(log.data, null, 2) : ""
          }`
      )
      .join("\n");

    navigator.clipboard.writeText(logText);
  };

  const getEnvironmentInfo = () => {
    const info: Record<string, unknown> = {
      "User Agent": navigator.userAgent,
      Platform: navigator.platform,
      Language: navigator.language,
      URL: window.location.href,
      Hash: window.location.hash,
      Search: window.location.search,
      "Telegram WebApp": !!(
        window as unknown as { Telegram?: { WebApp?: unknown } }
      ).Telegram?.WebApp,
      "Telegram SDK Available": !!(
        window as unknown as {
          Telegram?: { WebApp?: { initDataUnsafe?: unknown } };
        }
      ).Telegram?.WebApp?.initDataUnsafe,
    };

    if (
      (window as unknown as { Telegram?: { WebApp?: unknown } }).Telegram
        ?.WebApp
    ) {
      const tg = (
        window as unknown as { Telegram: { WebApp: Record<string, unknown> } }
      ).Telegram.WebApp;
      info["WebApp Version"] = tg.version;
      info["Platform"] = tg.platform;
      info["Color Scheme"] = tg.colorScheme;
      info["Theme Params"] = tg.themeParams;
      info["Init Data"] = tg.initData;
      info["Init Data Unsafe"] = tg.initDataUnsafe;
    }

    return info;
  };

  const getLogColor = (level: LogEntry["level"]) => {
    switch (level) {
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-500";
      case "info":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="mb-2 bg-red-600 hover:bg-red-700 text-white"
        size="sm"
      >
        <Bug className="h-4 w-4 mr-2" />
        Debug Panel
        {isOpen ? (
          <ChevronDown className="h-4 w-4 ml-2" />
        ) : (
          <ChevronUp className="h-4 w-4 ml-2" />
        )}
      </Button>

      {isOpen && (
        <Card className="w-96 max-h-96 overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Debug Information</CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogs(!showLogs)}
                >
                  {showLogs ? (
                    <EyeOff className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                </Button>
                <Button variant="outline" size="sm" onClick={copyLogs}>
                  <Copy className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={clearLogs}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3 max-h-80 overflow-y-auto">
            {/* Status Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium">Status:</span>
                <Badge
                  variant={isTelegramEnv ? "default" : "secondary"}
                  className="text-xs"
                >
                  {isTelegramEnv ? "Telegram" : "Mock"}
                </Badge>
                <Badge
                  variant={isLoading ? "destructive" : "outline"}
                  className="text-xs"
                >
                  {isLoading ? "Loading" : "Ready"}
                </Badge>
              </div>

              {user && typeof user === "object" && user !== null ? (
                <div className="text-xs">
                  <div>
                    User ID: {String((user as { id?: unknown }).id || "N/A")}
                  </div>
                  <div>
                    Name:{" "}
                    {String((user as { first_name?: string }).first_name || "")}{" "}
                    {String((user as { last_name?: string }).last_name || "")}
                  </div>
                  <div>
                    Username: @
                    {String((user as { username?: string }).username || "N/A")}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Environment Info */}
            <div className="space-y-1">
              <div className="text-xs font-medium">Environment:</div>
              <div className="text-xs space-y-1 max-h-20 overflow-y-auto">
                {Object.entries(getEnvironmentInfo()).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="text-right max-w-48 truncate">
                      {typeof value === "object" && value !== null
                        ? JSON.stringify(value)
                        : String(value || "")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Console Logs */}
            {showLogs && (
              <div className="space-y-1">
                <div className="text-xs font-medium">
                  Console Logs ({logs.length}):
                </div>
                <div className="text-xs space-y-1 max-h-32 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  {logs.length === 0 ? (
                    <div className="text-muted-foreground">No logs yet</div>
                  ) : (
                    logs.map((log) => (
                      <div
                        key={log.id}
                        className="border-b border-gray-200 dark:border-gray-700 pb-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            [{log.timestamp}]
                          </span>
                          <span
                            className={`text-xs font-mono ${getLogColor(
                              log.level
                            )}`}
                          >
                            {log.level.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs break-words">{log.message}</div>
                        {log.data ? (
                          <pre className="text-xs text-muted-foreground mt-1 overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
