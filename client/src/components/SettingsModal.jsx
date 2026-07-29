import React, { useState } from 'react';

export default function SettingsModal({ isOpen, onClose, theme, setTheme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-outline-variant pb-4">
          <h3 className="font-display font-bold text-lg text-on-surface">Workspace Settings</h3>
          <button onClick={onClose} className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-on-surface block mb-2 font-mono">Theme Mode</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`p-3 rounded-xl border flex items-center gap-3 font-semibold ${
                  theme === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-lg">dark_mode</span>
                <span>Deep Space (Dark)</span>
              </button>

              <button
                onClick={() => setTheme('light')}
                className={`p-3 rounded-xl border flex items-center gap-3 font-semibold ${
                  theme === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-lg">light_mode</span>
                <span>Clean Slate (Light)</span>
              </button>
            </div>
          </div>

          <div>
            <label className="font-bold text-on-surface block mb-1 font-mono">Audio & Video Hardware</label>
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-on-surface">
              <option>Default High Definition Web Camera (1080p)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-on-surface block mb-1 font-mono">Microphone Input Device</label>
            <select className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-2.5 text-on-surface">
              <option>Studio Noise-Canceling Microphone (Active)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-outline-variant">
          <button onClick={onClose} className="px-5 py-2 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
