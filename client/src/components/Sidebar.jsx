import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenNewMeeting
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'activity', label: 'Activity', icon: 'notifications', badge: 3 },
    { id: 'channels', label: 'Channels', icon: 'forum' },
    { id: 'documents', label: 'Documents', icon: 'description' },
    { id: 'meetings', label: 'Meetings', icon: 'video_chat', activeIcon: 'video_chat', fill: true },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside
      className={`h-screen fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-6 z-50 transition-all duration-300 ${
        isCollapsed ? 'w-20 px-2' : 'w-64 px-4'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 bg-surface border border-outline-variant rounded-full p-1 text-on-surface-variant hover:text-primary shadow-md z-50 transition-transform duration-300 hover:scale-110"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <span
          className={`material-symbols-outlined text-[18px] transition-transform duration-300 ${
            isCollapsed ? 'rotate-180' : ''
          }`}
        >
          chevron_left
        </span>
      </button>

      {/* Brand Header */}
      <div className={`mb-8 ${isCollapsed ? 'px-1 text-center' : 'px-2'}`}>
        {!isCollapsed ? (
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-lg font-display shadow-glow">
                N
              </div>
              <h1 className="font-display text-2xl font-bold text-primary tracking-tight">
                Nexus Corp
              </h1>
            </div>
            <p className="font-mono text-xs text-on-surface-variant mt-1 tracking-wider uppercase">
              Enterprise Workspace
            </p>
          </div>
        ) : (
          <div className="w-10 h-10 mx-auto rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xl font-display shadow-glow">
            N
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="mb-6 px-1">
        <button
          onClick={onOpenNewMeeting}
          className={`w-full py-3 bg-primary text-on-primary rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-md ${
            isCollapsed ? 'px-0' : 'px-4'
          }`}
        >
          <span className="material-symbols-outlined text-xl">add</span>
          {!isCollapsed && <span>New Project</span>}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 py-3 px-3.5 rounded-xl transition-all duration-200 ease-in-out relative group ${
                isActive
                  ? 'text-primary bg-primary-container/20 font-semibold border-r-4 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <span
                className={`material-symbols-outlined text-2xl ${
                  isActive && item.fill ? 'fill' : ''
                } ${isActive ? 'text-primary' : 'group-hover:scale-110 transition-transform'}`}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="text-sm font-medium flex-1 text-left">
                  {item.label}
                </span>
              )}
              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full font-mono font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="mt-auto pt-4 border-t border-outline-variant flex items-center gap-3 px-1">
        <div className="relative">
          <img
            className="w-10 h-10 rounded-full border-2 border-primary-container object-cover"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="Alex Chen Profile"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-surface rounded-full"></span>
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-on-surface truncate">Alex Chen</p>
            <p className="text-xs text-on-surface-variant truncate">Director of Design</p>
          </div>
        )}
        {!isCollapsed && (
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1 text-on-surface-variant hover:text-primary transition-colors rounded-lg hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>
        )}
      </div>
    </aside>
  );
}
