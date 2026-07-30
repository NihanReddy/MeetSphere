import React, { useState, useEffect } from 'react';
import { getUserMeetings } from '../services/meetingService';

export default function DashboardView({
  onJoinMeeting,
  onOpenNewMeeting,
  searchQuery
}) {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMeetings() {
      try {
        const data = await getUserMeetings();
        if (!cancelled) {
          setMeetings(data);
        }
      } catch (err) {
        console.error('[DashboardView] Failed to fetch meetings:', err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchMeetings();

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Format a date object into a display-friendly format.
   */
  function formatMeetingDate(createdAt) {
    const d = new Date(createdAt);
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return {
      dateMonth: months[d.getMonth()],
      dateDay: d.getDate().toString().padStart(2, '0')
    };
  }

  /**
   * Map a backend meeting document to the display shape used by the UI.
   */
  function mapMeeting(m) {
    const { dateMonth, dateDay } = formatMeetingDate(m.createdAt);
    return {
      id: m._id,
      _id: m._id,
      title: m.title,
      roomName: m.roomName,
      status: m.status,
      dateMonth,
      dateDay,
      time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      location: m.roomName,
      host: m.hostId?.name || 'You',
      participants: [],
      extraCount: 0,
      isLiveNow: m.status === 'active',
      category: 'General'
    };
  }

  const displayMeetings = meetings.map(mapMeeting);

  const filteredMeetings = searchQuery
    ? displayMeetings.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.location.toLowerCase().includes(searchQuery.toLowerCase()))
    : displayMeetings;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-primary-container/30 via-surface-container-low to-surface-container border border-outline-variant p-8 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/20 text-primary font-mono text-xs font-semibold rounded-full uppercase tracking-wider">
              Workspace Dashboard
            </span>
            <span className="text-xs text-on-surface-variant font-mono">Wednesday, Oct 24</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface tracking-tight">
            Good morning, Alex 👋
          </h2>
          <p className="text-on-surface-variant text-base mt-1 max-w-xl">
            You have <strong className="text-primary font-semibold">4 meetings</strong> scheduled today. <strong className="text-emerald-400">Q4 Strategy Planning</strong> is live right now!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onJoinMeeting(meetings[0])}
            className="px-6 py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm flex items-center gap-2.5 hover:opacity-90 active:scale-95 transition-all shadow-glow"
          >
            <span className="material-symbols-outlined text-xl">videocam</span>
            <span>Join Live Meeting</span>
          </button>
          <button
            onClick={onOpenNewMeeting}
            className="px-4 py-3.5 bg-surface-container-high border border-outline-variant text-on-surface rounded-xl font-semibold text-sm hover:bg-surface-container-highest transition-all"
          >
            + Schedule
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">video_chat</span>
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-on-surface">4</p>
            <p className="text-xs text-on-surface-variant">Scheduled Calls</p>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">group</span>
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-on-surface">18</p>
            <p className="text-xs text-on-surface-variant">Active Teammates</p>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">forum</span>
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-on-surface">3</p>
            <p className="text-xs text-on-surface-variant">Live Channels</p>
          </div>
        </div>

        <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">description</span>
          </div>
          <div>
            <p className="text-2xl font-bold font-display text-on-surface">42</p>
            <p className="text-xs text-on-surface-variant">Shared Documents</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Meetings (Left 8 Cols) & Activity (Right 4 Cols) */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Meetings */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-xl font-bold text-on-surface">
                Upcoming Scheduled Meetings
              </h3>
              <span className="px-2.5 py-0.5 bg-surface-container-high border border-outline-variant text-on-surface-variant rounded-full text-xs font-mono font-medium">
                {filteredMeetings.length} Today
              </span>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant border border-outline-variant transition-colors">
                <span className="material-symbols-outlined text-lg">filter_list</span>
              </button>
              <button className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant border border-outline-variant transition-colors">
                <span className="material-symbols-outlined text-lg">calendar_today</span>
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => (
              <div
                key={meeting.id}
                className={`bg-surface-container-lowest p-6 rounded-2xl border transition-all duration-300 group hover:shadow-xl ${
                  meeting.isLiveNow
                    ? 'border-primary/60 ring-1 ring-primary/30'
                    : 'border-outline-variant hover:border-outline'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-start gap-5">
                    {/* Date Badge */}
                    <div
                      className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center shrink-0 font-mono shadow-inner ${
                        meeting.isLiveNow
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">
                        {meeting.dateMonth}
                      </span>
                      <span className="text-2xl font-bold font-display leading-tight">
                        {meeting.dateDay}
                      </span>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition-colors">
                          {meeting.title}
                        </h4>
                        {meeting.isLiveNow && (
                          <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                            Live Now
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-primary">
                            schedule
                          </span>
                          <span className="font-mono">{meeting.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-primary">
                            videocam
                          </span>
                          <span>{meeting.location}</span>
                        </div>
                      </div>

                      {/* Participant Avatars */}
                      <div className="flex items-center -space-x-2 mt-4">
                        {meeting.participants.map((p, idx) => (
                          <img
                            key={idx}
                            className="w-8 h-8 rounded-full border-2 border-surface object-cover shadow-sm"
                            src={p.avatar}
                            alt={p.name}
                            title={p.name}
                          />
                        ))}
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary-container flex items-center justify-center text-[10px] font-bold text-on-primary-container font-mono shadow-sm">
                          +{meeting.extraCount}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Join Action */}
                  <button
                    onClick={() => onJoinMeeting(meeting)}
                    className={`w-full md:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      meeting.isLiveNow
                        ? 'bg-primary text-on-primary hover:opacity-90 shadow-glow'
                        : 'bg-surface-container-high text-on-surface hover:bg-primary/20 hover:text-primary border border-outline-variant'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">play_arrow</span>
                    <span>Join Meeting</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Schedule Card Prompt */}
            <div
              onClick={onOpenNewMeeting}
              className="bg-surface-container-lowest/50 p-6 rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center py-10 hover:border-primary/50 cursor-pointer transition-all group opacity-80 hover:opacity-100"
            >
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-outline group-hover:text-primary group-hover:scale-110 transition-all mb-3">
                <span className="material-symbols-outlined text-3xl">add_circle</span>
              </div>
              <p className="font-semibold text-sm text-on-surface group-hover:text-primary transition-colors">
                Schedule a new sync with your team
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                Create a recurring meeting or invite external clients
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed & Live Channels */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Live Channels Box */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-on-surface">
                Active Channels
              </h3>
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full uppercase tracking-wider animate-pulse flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                3 Live
              </span>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => onJoinMeeting(meetings[0])}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-high cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary fill text-xl">
                    radio_button_checked
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      Design Sync
                    </p>
                    <p className="text-[11px] text-on-surface-variant">Active call in progress</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono font-medium rounded-md">
                  4 online
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-high cursor-pointer transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-outline text-xl">
                    circle
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      Engineering Architecture
                    </p>
                    <p className="text-[11px] text-on-surface-variant">Sprint retro scheduled</p>
                  </div>
                </div>
                <span className="text-xs text-on-surface-variant font-mono">12 members</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-container-high cursor-pointer transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary fill text-xl">
                    radio_button_checked
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                      Marketing QA
                    </p>
                    <p className="text-[11px] text-on-surface-variant">Screen sharing active</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono font-medium rounded-md">
                  2 online
                </span>
              </div>
            </div>
          </div>

          {/* Activity Stream */}
          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant shadow-sm">
            <h3 className="font-display text-lg font-bold text-on-surface mb-6">
              Activity Feed
            </h3>
            <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
              <div className="flex gap-4 relative">
                <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-surface-container-low shrink-0 mt-1"></div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface">
                    <strong className="font-semibold">Sarah Chen</strong> updated the{' '}
                    <span className="text-primary cursor-pointer hover:underline font-medium">
                      Product Roadmap
                    </span>
                  </p>
                  <p className="font-mono text-xs text-on-surface-variant mt-1">12 mins ago</p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-4 h-4 rounded-full bg-outline-variant ring-4 ring-surface-container-low shrink-0 mt-1"></div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface">
                    <strong className="font-semibold">Team Design</strong> added 4 new assets to{' '}
                    <span className="text-primary cursor-pointer hover:underline font-medium">
                      Brand Guidelines
                    </span>
                  </p>
                  <p className="font-mono text-xs text-on-surface-variant mt-1">2 hours ago</p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-4 h-4 rounded-full bg-outline-variant ring-4 ring-surface-container-low shrink-0 mt-1"></div>
                <div className="flex-1">
                  <p className="text-sm text-on-surface">
                    <strong className="font-semibold">System Notification</strong> - Weekly analytics report is ready
                  </p>
                  <p className="font-mono text-xs text-on-surface-variant mt-1">4 hours ago</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 border border-outline-variant rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors">
              View All Workspace Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
