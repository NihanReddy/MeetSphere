import React, { useState } from 'react';

export default function DocumentsView() {
  const [filter, setFilter] = useState('all');

  const docs = [
    { id: 1, name: 'Nexus Q4 Product Roadmap & Architecture.pdf', category: 'pdf', size: '4.2 MB', updated: '2 hours ago', author: 'Sarah Chen' },
    { id: 2, name: 'Deep Slate Design System Specs (DESIGN.md)', category: 'md', size: '7.7 KB', updated: 'Today, 10:00 AM', author: 'Alex Chen' },
    { id: 3, name: 'Brand Guidelines 2026 Assets.fig', category: 'figma', size: '18.4 MB', updated: 'Yesterday', author: 'Team Design' },
    { id: 4, name: 'Client Onboarding Presentation Deck.pptx', category: 'ppt', size: '12.1 MB', updated: 'Oct 22', author: 'Marcus Vance' },
    { id: 5, name: 'Video Latency & E2EE Security Audit.docx', category: 'doc', size: '1.8 MB', updated: 'Oct 20', author: 'David Lin' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-on-surface">Shared Workspace Documents</h2>
          <p className="text-xs text-on-surface-variant mt-1">Access project files, meeting recordings, and design specifications.</p>
        </div>
        <button
          onClick={() => alert("File upload modal triggered")}
          className="px-5 py-2.5 bg-primary text-on-primary font-bold text-xs rounded-xl shadow-md hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">upload_file</span>
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docs.map((doc) => (
          <div key={doc.id} className="bg-surface-container-low border border-outline-variant p-5 rounded-2xl hover:border-primary/50 transition-all group shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg font-mono">
                {doc.category.toUpperCase()}
              </div>
              <button className="text-on-surface-variant hover:text-primary p-1">
                <span className="material-symbols-outlined text-lg">download</span>
              </button>
            </div>
            <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors truncate">{doc.name}</h4>
            <div className="flex items-center justify-between text-xs text-on-surface-variant mt-4 font-mono">
              <span>{doc.author}</span>
              <span>{doc.size}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
