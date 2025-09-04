"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Crown, Hash, AlertCircle, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DebugPanel from "@/components/DebugPanel";

import {
  init,
  retrieveLaunchParams,
  miniApp,
  initData,
  themeParams,
} from "@telegram-apps/sdk";

// Telegram WebApp types
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

// Mock user for local testing
const mockUser: TelegramUser = {
  id: 123456789,
  first_name: "John",
  last_name: "Doe",
  username: "johndoe",
  language_code: "en",
  photo_url: "/placeholder.svg?height=120&width=120",
  is_premium: true,
};

export default function TelegramMiniApp() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);

  useEffect(() => {
    const initTelegramApp = async () => {
      console.log("🚀 Starting Telegram Mini App initialization...");
      console.log("📍 Current URL:", window.location.href);
      console.log("🔍 Checking for Telegram WebApp...");

      try {
        if (
          typeof window !== "undefined" &&
          (window as unknown as { Telegram?: { WebApp?: unknown } }).Telegram
            ?.WebApp
        ) {
          console.log("✅ Direct Telegram WebApp detected");
          const tg = (
            window as unknown as {
              Telegram: { WebApp: Record<string, unknown> };
            }
          ).Telegram.WebApp;
          console.log("📱 WebApp object:", {
            version: tg.version,
            platform: tg.platform,
            colorScheme: tg.colorScheme,
            initData: tg.initData,
            initDataUnsafe: tg.initDataUnsafe,
          });

          (tg as { ready: () => void }).ready();
          console.log("🎯 WebApp ready() called");

          const initDataUnsafe = tg.initDataUnsafe as
            | { user?: TelegramUser }
            | undefined;
          if (initDataUnsafe?.user) {
            console.log(
              "👤 User data found in initDataUnsafe:",
              initDataUnsafe.user
            );
            const userData = initDataUnsafe.user;
            const telegramUser: TelegramUser = {
              id: userData.id,
              first_name: userData.first_name,
              last_name: userData.last_name,
              username: userData.username,
              language_code: userData.language_code,
              photo_url: userData.photo_url,
              is_premium: userData.is_premium,
            };
            setUser(telegramUser);
            setIsTelegramEnv(true);
            console.log(
              "✅ Successfully loaded user data via direct WebApp access"
            );
            return;
          } else {
            console.warn("⚠️ No user data found in initDataUnsafe");
            console.log("🔍 Full initDataUnsafe object:", initDataUnsafe);
          }
        } else {
          console.log("❌ No direct Telegram WebApp detected");
        }

        const hasLaunchParams =
          typeof window !== "undefined" &&
          (window.location.hash.includes("tgWebAppPlatform") ||
            window.location.search.includes("tgWebAppPlatform"));

        console.log("🔍 Checking for launch parameters...");
        console.log("📍 Hash:", window.location.hash);
        console.log("📍 Search:", window.location.search);
        console.log("🎯 Has launch params:", hasLaunchParams);

        if (hasLaunchParams) {
          console.log("✅ Telegram launch parameters detected, trying SDK...");
          try {
            console.log("🔄 Initializing Telegram SDK...");
            await init();
            console.log("✅ SDK initialized successfully");

            const launchParams = retrieveLaunchParams();
            console.log("📋 Launch params:", launchParams);

            if (launchParams) {
              console.log("🎯 Calling miniApp.ready()...");
              miniApp.ready();

              console.log("👤 Attempting to get user data from SDK...");
              const userData = initData.user();
              console.log("👤 User data from Telegram SDK:", userData);

              if (userData) {
                const telegramUser: TelegramUser = {
                  id: userData.id,
                  first_name: userData.first_name,
                  last_name: userData.last_name,
                  username: userData.username,
                  language_code: userData.language_code,
                  photo_url: userData.photo_url,
                  is_premium: userData.is_premium,
                };

                setUser(telegramUser);
                setIsTelegramEnv(true);
                console.log(
                  "✅ Successfully loaded Telegram user data via SDK"
                );

                const theme = themeParams;
                console.log("🎨 Theme params:", theme);
                if (theme && typeof theme === "object" && "bgColor" in theme) {
                  const themeObj = theme as unknown as {
                    bgColor?: string;
                    textColor?: string;
                  };
                  document.documentElement.style.setProperty(
                    "--tg-bg-color",
                    themeObj.bgColor || "#ffffff"
                  );
                  document.documentElement.style.setProperty(
                    "--tg-text-color",
                    themeObj.textColor || "#000000"
                  );
                  console.log("🎨 Applied theme colors");
                }
                return;
              } else {
                console.warn("⚠️ No user data returned from SDK");
              }
            } else {
              console.warn("⚠️ No launch params retrieved");
            }
          } catch (sdkError) {
            console.error("❌ SDK initialization failed:", sdkError);
            console.error("❌ Error details:", {
              name: (sdkError as Error).name,
              message: (sdkError as Error).message,
              stack: (sdkError as Error).stack,
            });
          }
        } else {
          console.log("❌ No Telegram environment detected, using mock data");
        }

        console.log("🔄 Falling back to mock user data");
        setUser(mockUser);
      } catch (error) {
        console.error("❌ General initialization error:", error);
        console.error("❌ Error details:", {
          name: (error as Error).name,
          message: (error as Error).message,
          stack: (error as Error).stack,
        });
        setUser(mockUser);
      } finally {
        console.log("🏁 Initialization complete");
        setIsLoading(false);
      }
    };

    initTelegramApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              Failed to load user data
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ");
  const initials = [user.first_name?.[0], user.last_name?.[0]]
    .filter(Boolean)
    .join("");

  return (
    <div className="min-h-screen bg-background p-4">
      <DebugPanel
        isTelegramEnv={isTelegramEnv}
        user={user}
        isLoading={isLoading}
      />
      <div className="max-w-md mx-auto space-y-4">
        {!isTelegramEnv && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="space-y-2">
              <div className="font-medium">Not running in Telegram</div>
              <div className="text-sm">
                To test with real Telegram data, you need to:
              </div>
              <ol className="text-sm space-y-1 ml-4 list-decimal">
                <li>Create a bot with @BotFather</li>
                <li>Set up your Mini App URL with /newapp</li>
                <li>
                  Open the app through Telegram (bot menu, inline button, etc.)
                </li>
              </ol>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                asChild
              >
                <a
                  href="https://docs.telegram-mini-apps.com/platform/creating-new-app"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Setup Guide
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* User Profile Card */}
        <Card className="overflow-hidden">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-border">
                <AvatarImage
                  src={user.photo_url || "/placeholder.svg"}
                  alt={displayName}
                />
                <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                  {initials || <User className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl font-bold text-balance">
              {displayName}
            </CardTitle>
            {user.username && (
              <p className="text-muted-foreground">@{user.username}</p>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  User ID
                </span>
                <div className="flex items-center gap-1">
                  <Hash className="h-3 w-3 text-muted-foreground" />
                  <span className="font-mono text-sm">{user.id}</span>
                </div>
              </div>

              {user.language_code && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Language
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {user.language_code.toUpperCase()}
                  </Badge>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Account Type
                </span>
                <div className="flex items-center gap-1">
                  {user.is_premium && <Crown className="h-4 w-4 text-accent" />}
                  <Badge
                    variant={user.is_premium ? "default" : "outline"}
                    className="text-xs"
                  >
                    {user.is_premium ? "Premium" : "Regular"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  Data Source
                </span>
                <Badge
                  variant={isTelegramEnv ? "default" : "secondary"}
                  className="text-xs"
                >
                  {isTelegramEnv ? "Telegram" : "Mock"}
                </Badge>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 space-y-2">
              <Button className="w-full" size="lg">
                Send Message
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Telegram Mini App</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This is a demo Telegram Mini App built with Next.js, TypeScript,
              and Tailwind CSS. It displays user information from the Telegram
              WebApp API using the official SDK.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
