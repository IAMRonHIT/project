import React, { useState } from 'react';
import { FileText, Upload, FolderOpen, Download, Eye, Trash2, File } from 'lucide-react';
import { Badge } from '../Badge';
import { useTheme } from '../../hooks/useTheme';

interface Document {
  name: string;
  type: 'PDF' | 'Word' | 'Image' | 'Other';
  size: string;
  lastModified?: string;
  status?: 'new' | 'reviewed' | 'pending';
}

const DocumentsTab: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [documents] = useState<Document[]>([
    {
      name: 'MRI Results.pdf',
      type: 'PDF',
      size: '1.2 MB',
      lastModified: '2 hours ago',
      status: 'new'
    },
    {
      name: 'Clinical Notes.docx',
      type: 'Word',
      size: '850 KB',
      lastModified: 'Yesterday',
      status: 'reviewed'
    },
    {
      name: 'Appeal Letter.docx',
      type: 'Word',
      size: '500 KB',
      lastModified: '3 days ago',
      status: 'pending'
    },
  ]);

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'PDF':
        return <FileText size={20} className="text-ron-coral-400" />;
      case 'Word':
        return <FileText size={20} className="text-ron-teal-400" />;
      case 'Image':
        return <File size={20} className="text-ron-lime-400" />;
      default:
        return <File size={20} className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status?: Document['status']) => {
    switch (status) {
      case 'new':
        return <Badge variant="success" size="sm" glow>New</Badge>;
      case 'reviewed':
        return <Badge variant="info" size="sm">Reviewed</Badge>;
      case 'pending':
        return <Badge variant="warning" size="sm">Pending Review</Badge>;
      default:
        return null;
    }
  };

  const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    variant?: 'primary' | 'secondary';
  }> = ({ icon, label, variant = 'primary' }) => (
    <button className={`
      flex items-center gap-2 px-4 py-2 rounded-lg
      ${variant === 'primary'
        ? 'bg-ron-teal-400 hover:shadow-glow-teal'
        : 'bg-ron-teal-400/20 hover:shadow-glow-teal'
      }
      transition-all duration-200
      backdrop-blur-sm
      border border-transparent
      hover:border-ron-teal-400/20
      text-white
    `}>
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className={`
      h-full flex flex-col
      ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-900/50' : 'bg-white/80'}
      backdrop-blur-xl
    `}>
      <div className="p-6 border-b border-ron-teal-400/20">
        <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Case Documents
        </h2>
        <div className="flex gap-4">
          <ActionButton icon={<Upload size={20} />} label="Upload Document" />
          <ActionButton icon={<FolderOpen size={20} />} label="Open Folder" variant="secondary" />
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-3">
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`
                flex items-center justify-between p-4 rounded-lg
                ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-800/50' : 'bg-white/50'}
                backdrop-blur-sm
                border border-ron-teal-400/20
                transition-all duration-200
                hover:shadow-glow-teal
                group
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-10 h-10 rounded-lg
                  ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-900/50' : 'bg-white/80'}
                  border border-ron-teal-400/20
                  flex items-center justify-center
                `}>
                  {getDocumentIcon(doc.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {doc.name}
                    </p>
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    {doc.lastModified && (
                      <>
                        <span>•</span>
                        <span>Modified {doc.lastModified}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className={`
                  p-2 rounded-lg
                  ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-900/50' : 'bg-white/80'}
                  hover:bg-ron-teal-400/20
                  text-gray-400 hover:text-white
                  transition-colors
                `}>
                  <Download size={16} />
                </button>
                <button className={`
                  p-2 rounded-lg
                  ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-900/50' : 'bg-white/80'}
                  hover:bg-ron-teal-400/20
                  text-gray-400 hover:text-white
                  transition-colors
                `}>
                  <Eye size={16} />
                </button>
                <button className={`
                  p-2 rounded-lg
                  ${isDark ? '"bg-black backdrop-blur-xl rounded-xl p-8 shadow-soft hover:shadow-glow transition-all duration-300 relative overflow-hidden border border-white/10"-900/50' : 'bg-white/80'}
                  hover:bg-ron-coral-400/20
                  text-gray-400 hover:text-ron-coral-400
                  transition-colors
                `}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;
