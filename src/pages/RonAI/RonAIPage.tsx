import React, { useState } from 'react';
import { CaseExplorer } from './components/CaseExplorer';
import { ChatInterface } from './components/ChatInterface';
import { AIMacros } from './components/AIMacros';
import { AIMacro } from './types';

export function RonAIPage() {
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>();

  const handleCaseSelect = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const handleExecuteMacro = (macro: AIMacro) => {
    // In a real app, this would execute the macro's action
    macro.action();
  };

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Left Tier - Case Explorer */}
      <div className="w-80 border-r border-ron-teal-400/20 bg-black">
        <CaseExplorer onSelectCase={handleCaseSelect} />
      </div>

      {/* Center Tier - Chat Interface */}
      <div className="flex-1 bg-black">
        <ChatInterface selectedCaseId={selectedCaseId} />
      </div>

      {/* Right Tier - AI Macros */}
      <div className="w-80 border-l border-ron-teal-400/20 bg-black">
        <AIMacros onExecuteMacro={handleExecuteMacro} />
      </div>
    </div>
  );
}