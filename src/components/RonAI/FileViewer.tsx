import React, { useState, useEffect } from "react";
import { fileUploadService } from "../../services/fileUploadService";
import ProgressBar from "./ProgressBar";

interface ContextData {
  threadId: string;
  careJourney?: {
    id: string;
    type: string;
    status: string;
  };
  event?: {
    id: string;
    type: 'Authorization' | 'Appeal' | 'Claim' | 'Care Plan';
    status: string;
  };
  stakeholders: {
    patient?: {
      id: string;
      name: string;
    };
    providers?: Array<{
      id: string;
      name: string;
      role: string;
    }>;
    healthPlan?: {
      id: string;
      name: string;
    };
  };
  relatedTickets?: Array<{
    id: string;
    type: string;
    status: string;
    summary: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
  }>;
}

interface FileViewerProps {
  threadId?: string;
}

const ContextViewer: React.FC<FileViewerProps> = ({ threadId }) => {
  const [contextData, setContextData] = useState<ContextData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState<string>("all");
  const [uploadStatus, setUploadStatus] = useState<{
    status: 'idle' | 'uploading' | 'complete' | 'error';
    progress: number;
  }>({ status: 'idle', progress: 0 });

  useEffect(() => {
    if (!threadId) return;
    
    setContextData({
      threadId,
      careJourney: {
        id: "CJ-123",
        type: "Prior Authorization",
        status: "In Progress"
      },
      event: {
        id: "AUTH-456",
        type: "Authorization",
        status: "Pending"
      },
      stakeholders: {
        patient: {
          id: "P-789",
          name: "John Doe"
        },
        providers: [{
          id: "DR-101",
          name: "Dr. Smith",
          role: "Primary Care"
        }],
        healthPlan: {
          id: "HP-202",
          name: "Blue Cross"
        }
      },
      documents: []
    });
  }, [threadId]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = fileUploadService.validateFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setUploadStatus({ status: 'uploading', progress: 0 });
      await fileUploadService.uploadFile(file, {
        onProgress: (progress) => {
          setUploadStatus({
            status: progress.status,
            progress: (progress.uploadedBytes / progress.totalBytes) * 100
          });
        }
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus({ status: 'error', progress: 0 });
    }
  };

  if (!threadId) return null;
  if (!contextData) return <div>Loading context...</div>;

  return (
    <div className="flex flex-col space-y-6 p-4 bg-gray-50 rounded-xl">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Context & Documents</h2>
        <div className="flex space-x-2">
          <select 
            className="px-3 py-2 border rounded-lg"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            aria-label="Search type"
            title="Select search type"
          >
            <option value="all">All</option>
            <option value="patient">Patient</option>
            <option value="provider">Provider</option>
            <option value="healthPlan">Health Plan</option>
            <option value="careJourney">Care Journey</option>
            <option value="auth">Authorization</option>
            <option value="appeal">Appeal</option>
            <option value="claim">Claim</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search term"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {contextData.careJourney && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium text-gray-700">Care Journey</h3>
            <div className="mt-2">
              <p>ID: {contextData.careJourney.id}</p>
              <p>Type: {contextData.careJourney.type}</p>
              <p>Status: {contextData.careJourney.status}</p>
            </div>
          </div>
        )}
        {contextData.event && (
          <div className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-medium text-gray-700">{contextData.event.type}</h3>
            <div className="mt-2">
              <p>ID: {contextData.event.id}</p>
              <p>Status: {contextData.event.status}</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-medium text-gray-700 mb-4">Stakeholders</h3>
        <div className="grid grid-cols-3 gap-4">
          {contextData.stakeholders.patient && (
            <div className="border rounded p-3">
              <div>
                <h4 className="text-sm font-medium">Patient</h4>
                <p>{contextData.stakeholders.patient.name}</p>
                <p className="text-sm text-gray-500">{contextData.stakeholders.patient.id}</p>
              </div>
            </div>
          )}
          {contextData.stakeholders.providers?.map(provider => (
            <div key={provider.id} className="border rounded p-3">
              <div>
                <h4 className="text-sm font-medium">Provider</h4>
                <p>{provider.name}</p>
                <p className="text-sm text-gray-500">{provider.role}</p>
              </div>
            </div>
          ))}
          {contextData.stakeholders.healthPlan && (
            <div className="border rounded p-3">
              <div>
                <h4 className="text-sm font-medium">Health Plan</h4>
                <p>{contextData.stakeholders.healthPlan.name}</p>
                <p className="text-sm text-gray-500">{contextData.stakeholders.healthPlan.id}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-gray-700">Documents</h3>
          <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
            Upload Document
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx,.txt"
              aria-label="Upload document"
            />
          </label>
        </div>
        
        {uploadStatus.status === 'uploading' && (
          <ProgressBar 
            progress={uploadStatus.progress} 
            label="File upload progress"
          />
        )}

        <div className="space-y-2">
          {contextData.documents.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
          ) : (
            contextData.documents.map(doc => (
              <div key={doc.id} className="flex justify-between items-center p-3 border rounded">
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-gray-500">{doc.type} • {doc.uploadedAt}</p>
                </div>
                <button 
                  className="text-red-600 hover:text-red-800"
                  aria-label={`Delete ${doc.name}`}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContextViewer;
