"use client";

import { useState, ReactNode } from "react";
import SettingsSidebar from "./SettingsSidebar";
import SettingsLayoutClient from "./SettingsLayoutClient";

interface SettingsTabManagerProps {
  onLogout: () => void;
  children: (activeTab: string) => ReactNode;
  isMobile: boolean;
}

/**
 * Client component that manages tab state
 * Isolated client-side interactivity
 */
export default function SettingsTabManager({
  onLogout,
  children,
  isMobile,
}: SettingsTabManagerProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <SettingsLayoutClient
      isMobile={isMobile}
      sidebar={
        <SettingsSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={onLogout}
          zIndex={3}
        />
      }
    >
      {children(activeTab)}
    </SettingsLayoutClient>
  );
}

