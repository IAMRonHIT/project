import React from 'react';
import { PatientRecord } from '../PatientRegistry/types';
import { Play, Pause, Check, X, AlertTriangle, RotateCcw } from 'lucide-react';

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignee?: string;
  dueDate?: string;
  dependencies?: string[];
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  progress: number;
  steps: WorkflowStep[];
}

interface WorkflowAutomationProps {
  patient: PatientRecord;
  workflows: Workflow[];
  onWorkflowAction: (workflowId: string, action: 'start' | 'pause' | 'retry') => void;
  onStepComplete: (workflowId: string, stepId: string) => void;
  className?: string;
}

function WorkflowAutomation({
  workflows,
  onWorkflowAction,
  onStepComplete,
  className = '',
}: WorkflowAutomationProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-500" />;
      case 'failed':
        return <X className="w-5 h-5 text-red-500" />;
      case 'paused':
        return <Pause className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-100';
      case 'in_progress':
      case 'active':
        return 'bg-blue-50 border-blue-100';
      case 'failed':
        return 'bg-red-50 border-red-100';
      case 'paused':
        return 'bg-yellow-50 border-yellow-100';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Clinical Workflows</h3>
        <span className="text-sm text-gray-500">
          {workflows.filter(w => w.status === 'active').length} active workflows
        </span>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className={`p-4 rounded-lg border ${getStatusColor(workflow.status)}`}
          >
            {/* Workflow Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(workflow.status)}
                  <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                </div>
                <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {workflow.status === 'paused' && (
                  <button
                    onClick={() => onWorkflowAction(workflow.id, 'start')}
                    className="p-1 hover:bg-blue-100 rounded-full text-blue-600"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                {workflow.status === 'active' && (
                  <button
                    onClick={() => onWorkflowAction(workflow.id, 'pause')}
                    className="p-1 hover:bg-yellow-100 rounded-full text-yellow-600"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                )}
                {workflow.status === 'failed' && (
                  <button
                    onClick={() => onWorkflowAction(workflow.id, 'retry')}
                    className="p-1 hover:bg-blue-100 rounded-full text-blue-600"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{workflow.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${workflow.progress}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3">
              {workflow.steps.map((step) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg ${getStatusColor(step.status)} ${
                    step.status === 'pending' ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(step.status)}
                      <div>
                        <h5 className="font-medium text-gray-900">{step.title}</h5>
                        <p className="text-sm text-gray-600">{step.description}</p>
                        {step.assignee && (
                          <p className="text-sm text-gray-500 mt-1">
                            Assigned to: {step.assignee}
                          </p>
                        )}
                      </div>
                    </div>
                    {step.status === 'in_progress' && (
                      <button
                        onClick={() => onStepComplete(workflow.id, step.id)}
                        className="px-2 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkflowAutomation;