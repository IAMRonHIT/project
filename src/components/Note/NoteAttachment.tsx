import React, { useState } from 'react';
import { useNote, EntityType, Attachment } from '../contexts/NoteContext';

interface NoteAttachmentProps {
  onAttach?: (attachment: Attachment) => void;
  onDetach?: () => void;
}

const NoteAttachment: React.FC<NoteAttachmentProps> = ({ onAttach, onDetach }) => {
  const { state, dispatch } = useNote();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EntityType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string; name: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Entity type options
  const entityTypes: Array<{ value: EntityType; label: string; icon: JSX.Element }> = [
    {
      value: 'Ticket',
      label: 'Ticket',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
          <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
        </svg>
      )
    },
    {
      value: 'CareJourney',
      label: 'Care Journey',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      value: 'Auth',
      label: 'Authorization',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      )
    },
    {
      value: 'Appeal',
      label: 'Appeal',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
        </svg>
      )
    },
    {
      value: 'Claim',
      label: 'Claim',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      value: 'CarePlan',
      label: 'Care Plan',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
          <path d="M9 14h6"></path>
          <path d="M9 18h6"></path>
          <path d="M9 10h6"></path>
        </svg>
      )
    },
    {
      value: 'Task',
      label: 'Task',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"></path>
          <path d="M12 8v8"></path>
          <path d="M8 12h8"></path>
        </svg>
      )
    }
  ];

  // Handle selecting an entity type
  const handleSelectType = (type: EntityType) => {
    setSelectedType(type);
    setSearchQuery('');
    setSearchResults([]);
    
    // In a real implementation, we would fetch initial results for this type
    // For now, we'll simulate some results
    simulateSearch(type, '');
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (selectedType) {
      simulateSearch(selectedType, query);
    }
  };
  
  // Simulate search results
  const simulateSearch = (type: EntityType, query: string) => {
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Generate mock results based on type and query
      const results: Array<{ id: string; name: string }> = [];
      
      switch (type) {
        case 'Ticket':
          results.push(
            { id: 'ticket-1', name: 'Ticket #12345 - Billing Issue' },
            { id: 'ticket-2', name: 'Ticket #67890 - Coverage Question' }
          );
          break;
        case 'CareJourney':
          results.push(
            { id: 'journey-1', name: 'Diabetes Management' },
            { id: 'journey-2', name: 'Cardiac Care' }
          );
          break;
        case 'Auth':
          results.push(
            { id: 'auth-1', name: 'Auth #A12345 - MRI Approval' },
            { id: 'auth-2', name: 'Auth #B67890 - Specialist Referral' }
          );
          break;
        case 'Appeal':
          results.push(
            { id: 'appeal-1', name: 'Appeal #AP12345 - Denied Claim' },
            { id: 'appeal-2', name: 'Appeal #AP67890 - Coverage Dispute' }
          );
          break;
        case 'Claim':
          results.push(
            { id: 'claim-1', name: 'Claim #CL12345 - Hospital Stay' },
            { id: 'claim-2', name: 'Claim #CL67890 - Outpatient Procedure' }
          );
          break;
        case 'CarePlan':
          results.push(
            { id: 'plan-1', name: 'Chronic Disease Management Plan' },
            { id: 'plan-2', name: 'Post-Surgery Recovery Plan' }
          );
          break;
        case 'Task':
          results.push(
            { id: 'task-1', name: 'Follow-up Call' },
            { id: 'task-2', name: 'Document Review' }
          );
          break;
      }
      
      // Filter by query if provided
      const filteredResults = query
        ? results.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))
        : results;
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };
  
  // Handle attaching to an entity
  const handleAttach = (id: string, name: string) => {
    if (!selectedType) return;
    
    const attachment: Attachment = {
      type: selectedType,
      id,
      name
    };
    
    dispatch({ type: 'ATTACH_TO_ENTITY', attachment });
    
    if (onAttach) {
      onAttach(attachment);
    }
    
    setIsDropdownOpen(false);
  };
  
  // Handle detaching from an entity
  const handleDetach = () => {
    dispatch({ type: 'DETACH_FROM_ENTITY' });
    
    if (onDetach) {
      onDetach();
    }
  };
  
  return (
    <div className="relative">
      {/* Attachment button/display */}
      {state.attachedTo ? (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-900/30 border border-indigo-500/30 rounded-md shadow-[0_0_5px_rgba(79,70,229,0.2)]">
          <div className="text-indigo-400">
            {entityTypes.find(et => et.value === state.attachedTo?.type)?.icon}
          </div>
          <span className="text-xs font-medium text-indigo-300 flex-1 truncate">
            {state.attachedTo.name}
          </span>
          <button
            onClick={handleDetach}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            aria-label="Detach note"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-300 
            bg-indigo-500/10 border border-indigo-500/30 rounded-md 
            hover:bg-indigo-500/20 hover:shadow-[0_0_5px_rgba(79,70,229,0.4)]
            transition-all duration-200"
          aria-label="Attach note"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
          </svg>
          Attach to...
        </button>
      )}
      
      {/* Attachment dropdown - Dark Mode Styling */}
      {isDropdownOpen && !state.attachedTo && (
        <div className="absolute z-10 mt-1 w-72 bg-gray-800/95 backdrop-blur-md border border-indigo-500/30 rounded-md shadow-lg shadow-black/50">
          {!selectedType ? (
            <div className="p-3">
              <h3 className="text-sm font-medium text-indigo-300 mb-2 flex items-center">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
                Select type
              </h3>
              <ul className="space-y-1">
                {entityTypes.map(type => (
                  <li key={type.value}>
                    <button
                      onClick={() => handleSelectType(type.value)}
                      className="w-full flex items-center gap-2 p-2 text-sm text-left text-gray-300 
                        hover:bg-indigo-500/10 hover:text-white rounded-md transition-colors 
                        border border-transparent hover:border-indigo-500/20"
                    >
                      <span className="text-indigo-400">{type.icon}</span>
                      {type.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="p-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-indigo-300 flex items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2 shadow-[0_0_4px_rgba(79,70,229,0.7)]"></span>
                  Select {entityTypes.find(et => et.value === selectedType)?.label}
                </h3>
                <button
                  onClick={() => setSelectedType(null)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                  aria-label="Back to type selection"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
              </div>
              
              <div className="mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={`Search ${entityTypes.find(et => et.value === selectedType)?.label.toLowerCase()}s...`}
                  className="w-full px-3 py-2 text-sm bg-gray-900/80 text-white border border-indigo-500/30 
                    rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 
                    shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)] transition-all"
                  aria-label={`Search ${entityTypes.find(et => et.value === selectedType)?.label}s`}
                />
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                {isSearching ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="text-sm text-indigo-300/60 p-2">No results found</div>
                ) : (
                  <ul className="space-y-1">
                    {searchResults.map(result => (
                      <li key={result.id}>
                        <button
                          onClick={() => handleAttach(result.id, result.name)}
                          className="w-full flex items-center p-2 text-sm text-left text-gray-300 
                            hover:bg-indigo-500/10 hover:text-white rounded-md transition-colors 
                            border border-transparent hover:border-indigo-500/20"
                        >
                          {result.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NoteAttachment;
