
import type React from 'react';

export enum AppID {
  TERMINAL = 'TERMINAL',
  DASHBOARD = 'DASHBOARD',
}

export interface AppConfig {
  id: AppID;
  title: string;
  icon: React.ReactElement;
  component: React.ReactElement;
  defaultSize: { width: number; height: number };
}

export interface WindowInstance {
  id: string; // Unique ID for each window instance
  appId: AppID;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}
