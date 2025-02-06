import React from 'react';
import { 
  Stethoscope, Search, ClipboardList, MessageSquare,
  FileText, AlertTriangle, Brain, Activity
} from 'lucide-react';
import { AIMacro } from '../types';

interface AIMacrosProps {
  onExecuteMacro: (macro: AIMacro) => void;
}

export function AIMacros({ onExecuteMacro }: AIMacrosProps) {
  // Mock macros - replace with actual macro definitions
  const macros: AIMacro[] = [
    {
      id: '1',
      name: 'Clinical Analysis',
      description: 'Analyze patient clinical data and provide insights',
      icon: 'stethoscope',
      action: () => console.log('Executing Clinical Analysis')
    },
    {
      id: '2',
      name: 'Document Review',
      description: 'Review and summarize medical documents',
      icon: 'fileSearch',
      action: () => console.log('Executing Document Review')
    },
    {
      id: '3',
      name: 'Care Plan Review',
      description: 'Review and suggest updates to care plan',
      icon: 'clipboardList',
      action: () => console.log('Executing Care Plan Review')
    },
    {
      id: '4',
      name: 'Communication Analysis',
      description: 'Analyze patient-provider communication',
      icon: 'messageCircle',
      action: () => console.log('Executing Communication Analysis')
    },
    {
      id: '5',
      name: 'Report Generation',
      description: 'Generate comprehensive case report',
      icon: 'fileText',
      action: () => console.log('Executing Report Generation')
    },
    {
      id: '6',
      name: 'Risk Assessment',
      description: 'Evaluate potential risks and complications',
      icon: 'alertCircle',
      action: () => console.log('Executing Risk Assessment')
    },
    {
      id: '7',
      name: 'Treatment Suggestions',
      description: 'Suggest potential treatment options',
      icon: 'brain',
      action: () => console.log('Executing Treatment Suggestions')
    },
    {
      id: '8',
      name: 'Progress Tracking',
      description: 'Track and analyze treatment progress',
      icon: 'activity',
      action: () => console.log('Executing Progress Tracking')
    }
  ];

  // Map icon strings to Lucide components
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'stethoscope': return <Stethoscope />;
      case 'fileSearch': return <Search />;
      case 'clipboardList': return <ClipboardList />;
      case 'messageCircle': return <MessageSquare />;
      case 'fileText': return <FileText />;
      case 'alertCircle': return <AlertTriangle />;
      case 'brain': return <Brain />;
      case 'activity': return <Activity />;
      default: return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-ron-teal-400/20">
        <h2 className="text-lg font-semibold text-white">AI Macros</h2>
        <p className="text-gray-400 text-sm">Quick actions for case analysis</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 gap-4">
          {macros.map(macro => (
            <button
              key={macro.id}
              onClick={() => onExecuteMacro(macro)}
              className="flex items-center p-4 bg-black/50 border border-ron-teal-400/20 rounded-lg
                hover:bg-ron-teal-400/10 hover:border-ron-teal-400/40 transition-colors
                group text-left"
            >
              <div className="mr-4 text-gray-400 group-hover:text-white transition-colors">
                {getIcon(macro.icon)}
              </div>
              <div>
                <h3 className="text-white font-medium">{macro.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{macro.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}