import React from 'react';

import { DashboardView } from '../../pages/Dashboard/index'; // Import DashboardView type

interface MenuItem {
  name: string;
  view: DashboardView; // Changed path to view for SPA navigation
}

const menuItems: MenuItem[] = [
  { name: 'Overview', view: 'overview' },
  { name: 'Prior Authorizations', view: 'priorAuthorizations' },
  { name: 'Appeals', view: 'appeals' },
  { name: 'Claims', view: 'claims' },
  { name: 'Care Plans', view: 'carePlans' },
  { name: 'Appointments', view: 'appointments' },
  { name: 'Agents', view: 'agents' },
];

interface MenuBarProps {
  onNavigate: (view: DashboardView) => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onNavigate }) => {
  const navStyle: React.CSSProperties = {
    backgroundColor: 'rgba(10, 10, 10, 0.3)', // Semi-transparent dark
    backdropFilter: 'blur(10px)', // Blur effect
    WebkitBackdropFilter: 'blur(10px)', // For Safari
    padding: '15px 0',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)', // Subtle border
    position: 'sticky', // Make it sticky
    top: 0, // Stick to the top
    zIndex: 1000, // Ensure it's above other content
  };

  const ulStyle: React.CSSProperties = {
    listStyleType: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap', // Allow items to wrap on smaller screens
  };

  const liStyle: React.CSSProperties = {
    margin: '5px 15px', // Adjusted margin for wrapping
  };

  const getLinkStyle = (isHovered: boolean): React.CSSProperties => ({
    textDecoration: 'none',
    color: isHovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.8)',
    fontWeight: 'bold',
    fontSize: '1rem',
    padding: '8px 12px',
    borderRadius: '6px',
    transition: 'transform 0.2s ease-out, text-shadow 0.2s ease-out, color 0.2s ease-out, background-color 0.2s ease-out',
    textShadow: isHovered
      ? '0 0 12px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.5)'
      : '0 0 8px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.3)',
    transform: isHovered ? 'translateY(-3px) scale(1.03)' : 'translateY(0) scale(1)',
    display: 'inline-block',
    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  });

  return (
    <nav style={navStyle}>
      <ul style={ulStyle}>
        {menuItems.map((item) => (
          <li key={item.name} style={liStyle}>
            <button
              onClick={() => onNavigate(item.view)}
              style={getLinkStyle(false)} // Base style applied
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, getLinkStyle(true));
              }}
              onMouseLeave={(e) => {
                Object.assign(e.currentTarget.style, getLinkStyle(false));
              }}
              // Add some button reset styles if needed, e.g., for background, border, cursor
              className="appearance-none bg-transparent border-none p-0 m-0 cursor-pointer focus:outline-none"
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MenuBar;
