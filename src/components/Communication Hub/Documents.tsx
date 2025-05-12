import React, { useState } from 'react';
import { FileText, Upload, FolderOpen, Download, Eye, Trash2, File, Search, Filter, Plus, CheckSquare, Filter as FilterIcon, Clock, Calendar, MoreVertical, Users, Star, ChevronDown, ChevronUp, X, Check, Edit2, Copy, Clipboard, AlertCircle } from 'lucide-react';
import Badge from './Badge';

interface Document {
  id: string;
  name: string;
  type: 'PDF' | 'Word' | 'Image' | 'Excel' | 'Other';
  size: string;
  lastModified: string;
  status?: 'new' | 'reviewed' | 'pending' | 'approved' | 'rejected';
  author?: string;
  patient?: string;
  tags?: string[];
  category?: string;
  isStarred?: boolean;
  isShared?: boolean;
  version?: string;
  relatedTo?: string;
  previewUrl?: string;
}

const DocumentsTab: React.FC = () => {
  // State for document management
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc1',
      name: 'MRI Results - John Doe.pdf',
      type: 'PDF',
      size: '3.2 MB',
      lastModified: '2 hours ago',
      status: 'new',
      author: 'Dr. Smith',
      patient: 'John Doe',
      tags: ['MRI', 'Orthopedic', 'Knee'],
      category: 'Clinical',
      isStarred: true,
      isShared: true,
      version: '1.0',
      relatedTo: 'ACL Surgery Authorization'
    },
    {
      id: 'doc2',
      name: 'Prior Authorization - Jane Smith.pdf',
      type: 'PDF',
      size: '1.5 MB',
      lastModified: 'Yesterday',
      status: 'approved',
      author: 'Dr. Johnson',
      patient: 'Jane Smith',
      tags: ['Authorization', 'Cardiac'],
      category: 'Administrative',
      isStarred: false,
      isShared: true,
      version: '2.1',
      relatedTo: 'Cardiac Procedure'
    },
    {
      id: 'doc3',
      name: 'Clinical Notes - Sarah Williams.docx',
      type: 'Word',
      size: '850 KB',
      lastModified: 'Yesterday',
      status: 'reviewed',
      author: 'Dr. Roberts',
      patient: 'Sarah Williams',
      tags: ['Clinical Notes', 'Pediatric'],
      category: 'Clinical',
      isStarred: false,
      isShared: false
    },
    {
      id: 'doc4',
      name: 'Appeal Letter - Mike Johnson.docx',
      type: 'Word',
      size: '500 KB',
      lastModified: '3 days ago',
      status: 'pending',
      author: 'Legal Team',
      patient: 'Mike Johnson',
      tags: ['Appeal', 'Level 1'],
      category: 'Legal',
      isStarred: true
    },
    {
      id: 'doc5',
      name: 'Lab Results - Emily Davis.pdf',
      type: 'PDF',
      size: '2.1 MB',
      lastModified: '5 days ago',
      status: 'reviewed',
      author: 'Lab Tech',
      patient: 'Emily Davis',
      tags: ['Labs', 'Blood Work'],
      category: 'Clinical'
    },
    {
      id: 'doc6',
      name: 'Treatment Plan - John Doe.docx',
      type: 'Word',
      size: '725 KB',
      lastModified: '1 week ago',
      status: 'approved',
      author: 'Dr. Smith',
      patient: 'John Doe',
      tags: ['Treatment', 'Orthopedic'],
      category: 'Clinical',
      relatedTo: 'ACL Surgery Authorization'
    },
    {
      id: 'doc7',
      name: 'Authorization Data Q2.xlsx',
      type: 'Excel',
      size: '1.8 MB',
      lastModified: '2 weeks ago',
      author: 'Analytics Team',
      tags: ['Reports', 'Quarterly'],
      category: 'Analytics'
    }
  ]);

  // State for UI controls
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Document handling functions
  const toggleStar = (docId: string) => {
    setDocuments(documents.map(doc =>
      doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
    ));
  };

  const deleteDocument = (docId: string) => {
    // In a real app, we'd call an API to delete the document
    // For demo, just remove from state
    setDocuments(documents.filter(doc => doc.id !== docId));
    if (selectedDocument?.id === docId) setSelectedDocument(null);
  };

  const addTag = (docId: string, tag: string) => {
    setDocuments(documents.map(doc => {
      if (doc.id === docId) {
        const tags = doc.tags || [];
        if (!tags.includes(tag)) {
          return { ...doc, tags: [...tags, tag] };
        }
      }
      return doc;
    }));
  };

  const simulateUpload = () => {
    setShowUploadModal(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUploadModal(false);
            // Add a new document
            const newDoc: Document = {
              id: `doc${Date.now()}`,
              name: 'New Upload.pdf',
              type: 'PDF',
              size: '1.0 MB',
              lastModified: 'Just now',
              status: 'new',
              author: 'You',
              tags: ['New'],
              category: 'Clinical'
            };
            setDocuments([newDoc, ...documents]);
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // UI helper functions
  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'PDF':
        return <FileText size={20} className="text-rose-400" />;
      case 'Word':
        return <FileText size={20} className="text-blue-400" />;
      case 'Image':
        return <Image size={20} className="text-green-400" />;
      case 'Excel':
        return <Table size={20} className="text-emerald-400" />;
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

  // Filter and sort methods
  const getFilteredDocuments = () => {
    return documents
      .filter(doc => {
        // Search query filter
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          if (!doc.name.toLowerCase().includes(searchLower) &&
              !doc.author?.toLowerCase().includes(searchLower) &&
              !doc.patient?.toLowerCase().includes(searchLower) &&
              !doc.tags?.some(tag => tag.toLowerCase().includes(searchLower))) {
            return false;
          }
        }

        // Category filter
        if (activeCategory && doc.category !== activeCategory) {
          return false;
        }

        // Tag filter
        if (selectedTags.length > 0 &&
            !selectedTags.some(tag => doc.tags?.includes(tag))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        // Sort by chosen field
        if (sortBy === 'name') {
          return sortOrder === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === 'size') {
          // Simple string comparison for demo purposes
          // In real app, would parse size into bytes
          return sortOrder === 'asc'
            ? a.size.localeCompare(b.size)
            : b.size.localeCompare(a.size);
        } else { // date
          // Using lastModified string for demo
          // In real app, would use actual Date objects
          return sortOrder === 'asc'
            ? a.lastModified.localeCompare(b.lastModified)
            : b.lastModified.localeCompare(a.lastModified);
        }
      });
  };

  // UI components
  const renderDocumentList = () => {
    const filteredDocs = getFilteredDocuments();

    if (filteredDocs.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <FileText size={48} className="mb-4 opacity-30" />
          <p>No documents found</p>
          {(searchQuery || activeCategory || selectedTags.length > 0) && (
            <button
              className="mt-4 text-indigo-400 hover:text-indigo-300"
              onClick={() => {
                setSearchQuery('');
                setActiveCategory(null);
                setSelectedTags([]);
              }}
            >
              Clear filters
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            onClick={() => setSelectedDocument(doc)}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-indigo-500/10 hover:border-indigo-500/30 cursor-pointer transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-900/60 border border-indigo-500/20 flex items-center justify-center">
                {getDocumentIcon(doc.type)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-white truncate">{doc.name}</p>
                  {doc.status && (
                    <span className={`px-1.5 py-0.5 text-xs rounded-full ${doc.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : doc.status === 'rejected' ? 'bg-rose-500/20 text-rose-400' : doc.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : doc.status === 'new' ? 'bg-blue-500/20 text-blue-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                      {doc.status}
                    </span>
                  )}
                  {doc.isShared && (
                    <span className="text-gray-400">
                      <Users size={12} />
                    </span>
                  )}
                </div>
                <div className="flex items-center text-xs text-gray-400 truncate">
                  <span>{doc.patient}</span>
                  {doc.patient && <span className="mx-1">•</span>}
                  <span>{doc.type}</span>
                  <span className="mx-1">•</span>
                  <span>{doc.size}</span>
                  <span className="mx-1">•</span>
                  <span>{doc.lastModified}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStar(doc.id);
                }}
                className="p-1.5 rounded-md text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <Star size={16} className={doc.isStarred ? 'fill-yellow-400 text-yellow-400' : ''} />
              </button>

              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); }}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderDocumentDetail = () => {
    if (!selectedDocument) return null;

    return (
      <div className="bg-gray-800/80 rounded-lg border border-indigo-500/20 overflow-hidden">
        <div className="p-4 border-b border-indigo-500/20 flex justify-between items-center">
          <h3 className="text-white font-medium truncate">{selectedDocument.name}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleStar(selectedDocument.id)}
              className="p-1.5 rounded-md text-gray-400 hover:text-yellow-400"
            >
              <Star size={16} className={selectedDocument.isStarred ? 'fill-yellow-400 text-yellow-400' : ''} />
            </button>
            <button
              onClick={() => setSelectedDocument(null)}
              className="p-1.5 rounded-md text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Document preview (simulated) */}
          <div className="h-64 bg-gray-900 rounded-lg border border-indigo-500/10 flex items-center justify-center mb-4">
            <div className="text-center">
              {getDocumentIcon(selectedDocument.type)}
              <p className="text-gray-400 mt-2">Document preview</p>
            </div>
          </div>

          {/* Document metadata */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="space-y-2">
              <h4 className="text-indigo-400 text-sm font-medium">Document Information</h4>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white">{selectedDocument.type}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{selectedDocument.size}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Modified:</span>
                  <span className="text-white">{selectedDocument.lastModified}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Author:</span>
                  <span className="text-white">{selectedDocument.author}</span>
                </p>
                {selectedDocument.version && (
                  <p className="flex justify-between">
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white">{selectedDocument.version}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-indigo-400 text-sm font-medium">Related Information</h4>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-400">Patient:</span>
                  <span className="text-white">{selectedDocument.patient}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white">{selectedDocument.category}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white">{selectedDocument.status || 'N/A'}</span>
                </p>
                {selectedDocument.relatedTo && (
                  <p className="flex justify-between">
                    <span className="text-gray-400">Related To:</span>
                    <span className="text-white">{selectedDocument.relatedTo}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          {selectedDocument.tags && selectedDocument.tags.length > 0 && (
            <div className="mb-4">
              <h4 className="text-indigo-400 text-sm font-medium mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {selectedDocument.tags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
                <button className="p-1 bg-gray-700 rounded-full text-xs text-gray-400 hover:text-white">
                  <Plus size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm flex items-center gap-1 transition-colors">
                <Download size={14} />
                Download
              </button>
              <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm flex items-center gap-1 transition-colors">
                <Share2 size={14} />
                Share
              </button>
              <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm flex items-center gap-1 transition-colors">
                <Edit2 size={14} />
                Edit
              </button>
            </div>
            <button
              onClick={() => deleteDocument(selectedDocument.id)}
              className="px-3 py-1.5 text-rose-400 hover:bg-rose-500/20 rounded-md text-sm flex items-center gap-1 transition-colors"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderUploadModal = () => {
    if (!showUploadModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-10">
        <div className="bg-gray-800 border border-indigo-500/30 rounded-lg shadow-xl w-96 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-medium">Uploading File</h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="p-1 text-gray-400 hover:text-white rounded-full"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-indigo-400" />
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">New Upload.pdf</p>
                <p className="text-gray-400 text-sm">{Math.round(uploadProgress)}% complete</p>
              </div>
            </div>

            <div className="h-2 bg-gray-700 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>

          <div className="text-center">
            <button
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-sm transition-colors"
              onClick={() => setShowUploadModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Components for table version
  const Image = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  );

  const Table = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
    </svg>
  );

  const Share2 = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
    </svg>
  );

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header with search and tools */}
      <div className="p-4 border-b border-indigo-500/20 bg-gray-900/80">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-white">Documents</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              title={viewMode === 'grid' ? 'List View' : 'Grid View'}
            >
              {viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
            </button>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              title="Filter"
            >
              <FilterIcon size={16} />
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full bg-gray-800 border border-indigo-500/20 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block pl-10 p-2"
            />
          </div>

          <button
            onClick={simulateUpload}
            className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Upload size={16} />
            Upload
          </button>

          <button className="px-3 py-2 border border-indigo-500/30 text-white rounded-lg hover:bg-indigo-500/20 transition-colors flex items-center gap-2">
            <FolderOpen size={16} />
            Browse
          </button>
        </div>

        {/* Filters section */}
        {filterOpen && (
          <div className="mt-3 p-3 bg-gray-800/70 border border-indigo-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white text-sm font-medium">Filters</h3>
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setSelectedTags([]);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h4 className="text-gray-400 text-xs mb-1">Categories</h4>
                <div className="space-y-1">
                  {['Clinical', 'Administrative', 'Legal', 'Analytics'].map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                      className={`flex items-center gap-1 text-sm rounded-md px-2 py-1 w-full text-left ${activeCategory === category ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-gray-700/50'}`}
                    >
                      {activeCategory === category && <Check size={12} />}
                      <span>{category}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-gray-400 text-xs mb-1">Sort By</h4>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => {
                      if (sortBy === 'date') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('date');
                        setSortOrder('desc');
                      }
                    }}
                    className={`flex items-center justify-between text-sm rounded-md px-2 py-1 ${sortBy === 'date' ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    <span>Date Modified</span>
                    {sortBy === 'date' && (
                      sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (sortBy === 'name') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('name');
                        setSortOrder('asc');
                      }
                    }}
                    className={`flex items-center justify-between text-sm rounded-md px-2 py-1 ${sortBy === 'name' ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    <span>Name</span>
                    {sortBy === 'name' && (
                      sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      if (sortBy === 'size') {
                        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      } else {
                        setSortBy('size');
                        setSortOrder('desc');
                      }
                    }}
                    className={`flex items-center justify-between text-sm rounded-md px-2 py-1 ${sortBy === 'size' ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-gray-700/50'}`}
                  >
                    <span>Size</span>
                    {sortBy === 'size' && (
                      sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-gray-400 text-xs mb-1">Tags</h4>
                <div className="space-y-1">
                  {['Clinical Notes', 'Authorization', 'Appeal', 'MRI', 'Labs', 'Treatment'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        if (selectedTags.includes(tag)) {
                          setSelectedTags(selectedTags.filter(t => t !== tag));
                        } else {
                          setSelectedTags([...selectedTags, tag]);
                        }
                      }}
                      className={`flex items-center gap-1 text-sm rounded-md px-2 py-1 w-full text-left ${selectedTags.includes(tag) ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-300 hover:bg-gray-700/50'}`}
                    >
                      {selectedTags.includes(tag) && <Check size={12} />}
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedDocument ? renderDocumentDetail() : renderDocumentList()}
      </div>

      {/* Upload modal */}
      {renderUploadModal()}
    </div>
  );

  // Helper components for view modes
  const List = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"></line>
      <line x1="8" y1="12" x2="21" y2="12"></line>
      <line x1="8" y1="18" x2="21" y2="18"></line>
      <line x1="3" y1="6" x2="3.01" y2="6"></line>
      <line x1="3" y1="12" x2="3.01" y2="12"></line>
      <line x1="3" y1="18" x2="3.01" y2="18"></line>
    </svg>
  );

  const Grid = (props: any) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
};

export default DocumentsTab;
