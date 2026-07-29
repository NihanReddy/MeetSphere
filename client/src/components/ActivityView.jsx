import React from 'react';

export default function ActivityView() {
  const activities = [
    { id: 1, title: 'Sarah Chen updated Product Roadmap', category: 'Document', time: '12 mins ago', icon: 'description' },
    { id: 2, title: 'Marcus Vance started Q4 Strategy Alignment meeting', category: 'Meeting', time: '25 mins ago', icon: 'video_chat' },
    { id: 3, title: 'Team Design added 4 new assets to Brand Guidelines', category: 'Design', time: '2 hours ago', icon: 'palette' },
    { id: 4, title: 'David Lin approved Vite 6 micro-frontend migration', category: 'Code', time: '3 hours ago', icon: 'code' },
    { id: 5, title: 'System generated weekly workspace backup', category: 'System', time: '5 hours ago', icon: 'cloud_sync' }
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div>
        <h2 className="font-display text-2xl font-bold text-on-surface">Workspace Activity Log</h2>
        <p className="text-xs text-on-surface-variant mt-1">Real-time audit trail of meeting events, document edits, and channel huddles.</p>
      </div>

      <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 space-y-4">
        {activities.map((a) => (
          <div key={a.id} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-surface-container-high transition-colors">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">{a.icon}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-on-surface">{a.title}</p>
              <p className="text-[10px] text-on-surface-variant font-mono mt-0.5">{a.category} • {a.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
