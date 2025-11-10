import React, { useState, useCallback } from 'react';
import IntroScreen from './components/IntroScreen';
import Desktop from './components/Desktop';

type AppState = 'INTRO' | 'DESKTOP';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('INTRO');

  const handleIntroComplete = useCallback(() => {
    setAppState('DESKTOP');
  }, []);
  
  const handleRestart = useCallback(() => {
    setAppState('INTRO');
  }, []);

  const renderContent = () => {
    switch(appState) {
      case 'INTRO':
        return <IntroScreen onComplete={handleIntroComplete} />;
      case 'DESKTOP':
        return <Desktop onRestart={handleRestart} />;
      default:
        return <IntroScreen onComplete={handleIntroComplete} />;
    }
  }

  return (
    <div className="w-screen h-screen bg-black text-gray-200 overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default App;