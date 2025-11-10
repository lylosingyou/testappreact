
import React from 'react';

export interface AppDefinition {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType;
}

export interface WindowInstance {
  id: string;
  app: AppDefinition;
  position: { x: number; y: number };
  zIndex: number;
}
