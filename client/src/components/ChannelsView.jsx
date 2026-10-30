import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  addChannelMember,
  createChannel,
  getChannel,
  getChannels,
  leaveChannel,
  removeChannelMember,
  sendChannelMessage,
  uploadDocument
} from '../services/meetingService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ChannelsView() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [activeChannel, setActiveChannel] = useState(null);
  const [draft, setDraft] = useState('');
  const [channelName, setChannelName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const loadChannelDetails = async (channelId) => {
    const [channel, documents] = await Promise.all([
      getChannel(channelId),
      getUserDocuments(channelId)
    ]);
    return { ...channel, documents };
  };

  const loadChannels = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getChannels();
      setChannels(data);
      if (data.length && !activeChannel) {
        setActiveChannel(await loadChannelDetails(data[0]._id));
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load channels.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadChannels(); }, []);

  const selectChannel = async (channel) => {
    try {
      setError('');
      setActiveChannel(await loadChannelDetails(channel._id));
    } catch (err) {
      setError(err.response?.data?.error || 'Could not open channel.');
    }
  };

  const refreshActive = async () => {
    if (activeChannel) setActiveChannel(await loadChannelDetails(activeChannel._id));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!channelName.trim()) return;
    try {
      setBusy(true);
      const created = await createChannel({ name: channelName });
      setChannels((current) => [...current, created]);
      setActiveChannel({ ...created, documents: [] });
      setChannelName('');
      setShowCreate(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create channel.');
    } finally {
      setBusy(false);
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    if (!draft.trim() || !activeChannel) return;
    try {
      setBusy(true);
      await sendChannelMessage(activeChannel._id, draft);
      setDraft('');
      await refreshActive();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send message.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddMember = async (event) => {
    event.preventDefault();
    if (!memberEmail.trim() || !activeChannel) return;
    try {
      setBusy(true);
      const updated = await addChannelMember(activeChannel._id, memberEmail);
      setActiveChannel(updated);
      setChannels((current) => current.map((item) => item._id === updated._id ? updated : item));
      setMemberEmail('');
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add member.');
    } finally {
      setBusy(false);
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeChannel) return;
    try {
      setBusy(true);
      await uploadDocument(file, undefined, activeChannel._id);
      await refreshActive();
    } catch (err) {
      setError(err.response?.data?.error || 'Could not upload document.');
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  };

  const handleLeave = async () => {
    if (!activeChannel || activeChannel.owner === user?._id) return;
    try {
      setBusy(true);
      await leaveChannel(activeChannel._id);
      const remaining = channels.filter((channel) => channel._id !== activeChannel._id);
      setChannels(remaining);
      setActiveChannel(remaining.length ? await loadChannelDetails(remaining[0]._id) : null);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not leave channel.');
    } finally {
      setBusy(false);
    }
  };

  const isOwner = activeChannel?.owner === user?._id || activeChannel?.owner?._id === user?._id;
  const messages = activeChannel?.messages || [];
  const documents = useMemo(() => activeChannel?.documents || [], [activeChannel]);

  if (loading) return <div className="p-8 text-sm text-on-surface-variant">Loading channels...</div>;

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low shadow-sm">
      <aside className="flex w-72 shrink-0 flex-col border-r border-outline-variant p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display font-bold text-on-surface">Channels</h2>
          <button type="button" onClick={() => setShowCreate((value) => !value)} className="rounded-lg p-1 text-primary hover:bg-primary/10" aria-label="Create channel">＋</button>
        </div>
        {showCreate && (
          <form onSubmit={handleCreate} className="mb-4 space-y-2">
            <input value={channelName} onChange={(event) => setChannelName(event.target.value)} placeholder="Channel name" maxLength={80} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-xs" />
            <button disabled={busy} className="w-full rounded-lg bg-primary px-3 py-2 text-xs font-bold text-on-primary">Create channel</button>
          </form>
        )}
        <div className="space-y-1 overflow-y-auto">
          {channels.map((channel) => (
            <button key={channel._id} type="button" onClick={() => selectChannel(channel)} className={`w-full rounded-xl p-3 text-left text-xs ${activeChannel?._id === channel._id ? 'bg-primary/15 font-bold text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              # {channel.name}
              <span className="mt-1 block text-[10px] font-normal opacity-70">{channel.members?.length || 0} members</span>
            </button>
          ))}
          {!channels.length && <p className="p-3 text-xs text-on-surface-variant">Create your first channel.</p>}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        {!activeChannel ? (
          <div className="grid flex-1 place-items-center text-sm text-on-surface-variant">Select or create a channel to start collaborating.</div>
        ) : (
          <>
            <header className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-4">
              <div>
                <h3 className="font-display font-bold text-on-surface"># {activeChannel.name}</h3>
                <p className="text-[11px] text-on-surface-variant">{activeChannel.description || 'Persistent channel conversation'}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowMembers((value) => !value)} className="rounded-lg border border-outline-variant px-3 py-2 text-xs text-on-surface-variant hover:text-primary">Members</button>
                <button type="button" onClick={() => navigate(`/lobby/${encodeURIComponent(activeChannel.name)}`)} className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-on-primary">Huddle</button>
              </div>
            </header>
            {showMembers && (
              <div className="border-b border-outline-variant bg-surface-container-low p-4">
                {isOwner && <form onSubmit={handleAddMember} className="mb-3 flex gap-2"><input value={memberEmail} onChange={(event) => setMemberEmail(event.target.value)} placeholder="Add user by email" type="email" className="min-w-0 flex-1 rounded-lg border border-outline-variant bg-surface px-3 py-2 text-xs" /><button disabled={busy} className="rounded-lg bg-primary px-3 text-xs font-bold text-on-primary">Add</button></form>}
                <div className="space-y-2">{activeChannel.members?.map((member) => <div key={member._id} className="flex items-center justify-between text-xs"><span>{member.name} <span className="text-on-surface-variant">{member.email}</span></span>{isOwner && member._id !== user?._id && <button type="button" onClick={async () => { await removeChannelMember(activeChannel._id, member._id); await refreshActive(); }} className="text-error hover:underline">Remove</button>}</div>)}</div>
                {!isOwner && <button type="button" onClick={handleLeave} className="mt-3 text-xs text-error hover:underline">Leave channel</button>}
              </div>
            )}
            {error && <div className="border-b border-error/30 bg-error/10 px-4 py-2 text-xs text-error">{error}</div>}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((message) => <div key={message._id} className="max-w-2xl"><div className="mb-1 flex gap-2 text-[10px] text-on-surface-variant"><strong className="text-on-surface">{message.sender?.name || 'Member'}</strong>{new Date(message.createdAt).toLocaleString()}</div><div className="rounded-2xl border border-outline-variant bg-surface-container-low p-3 text-xs text-on-surface">{message.text}</div></div>)}
              {!messages.length && <p className="text-center text-xs text-on-surface-variant">No messages yet. Start the conversation.</p>}
              {documents.map((document) => <div key={document._id} className="flex max-w-md items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs"><a href={`${API_URL}${document.url}`} target="_blank" rel="noreferrer" className="truncate text-primary hover:underline">{document.name}</a><span className="ml-3 shrink-0 text-on-surface-variant">{formatBytes(document.sizeBytes)}</span></div>)}
            </div>
            <div className="border-t border-outline-variant bg-surface-container-low p-4">
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleUpload} />
              <form onSubmit={handleSend} className="flex gap-2"><button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-xl border border-outline-variant px-3 text-xs text-on-surface-variant hover:text-primary" aria-label="Share document">Attach</button><input value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message #${activeChannel.name}`} className="min-w-0 flex-1 rounded-xl border border-outline-variant bg-surface px-3 py-2.5 text-xs" /><button disabled={busy} className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-on-primary">Send</button></form>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
