import mongoose from 'mongoose';
import { Channel } from '../models/Channel.js';
import { User } from '../models/User.js';

async function findMemberChannel(channelId, userId) {
  if (!mongoose.isValidObjectId(channelId)) return null;
  return Channel.findOne({ _id: channelId, members: userId })
    .populate('members', 'name email avatar')
    .populate('messages.sender', 'name email avatar');
}

export async function listChannels(req, res) {
  try {
    const channels = await Channel.find({ members: req.user._id })
      .populate('members', 'name email avatar')
      .sort({ createdAt: 1 })
      .lean();
    res.json(channels);
  } catch (error) {
    console.error('[ChannelController] listChannels error:', error);
    res.status(500).json({ error: 'Failed to load channels' });
  }
}

export async function createChannel(req, res) {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const description = typeof req.body.description === 'string' ? req.body.description.trim() : '';
    if (!name) return res.status(400).json({ error: 'Channel name is required' });
    if (name.length > 80) return res.status(400).json({ error: 'Channel name cannot exceed 80 characters' });

    const duplicate = await Channel.findOne({ members: req.user._id, name: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
    if (duplicate) return res.status(409).json({ error: 'A channel with this name already exists' });

    const channel = await Channel.create({
      name,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });
    await channel.populate('members', 'name email avatar');
    res.status(201).json(channel);
  } catch (error) {
    console.error('[ChannelController] createChannel error:', error);
    res.status(500).json({ error: 'Failed to create channel' });
  }
}

export async function getChannel(req, res) {
  try {
    const channel = await findMemberChannel(req.params.channelId, req.user._id);
    if (!channel) return res.status(404).json({ error: 'Channel not found or access denied' });
    res.json(channel);
  } catch (error) {
    console.error('[ChannelController] getChannel error:', error);
    res.status(500).json({ error: 'Failed to load channel' });
  }
}

export async function addChannelMember(req, res) {
  try {
    const channel = await Channel.findOne({ _id: req.params.channelId, owner: req.user._id });
    if (!channel) return res.status(404).json({ error: 'Channel not found or you are not the owner' });
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    if (!email) return res.status(400).json({ error: 'User email is required' });

    const user = await User.findOne({ email }).select('_id name email avatar');
    if (!user) return res.status(404).json({ error: 'No user exists with that email' });
    if (channel.members.some((member) => member.toString() === user._id.toString())) {
      return res.status(409).json({ error: 'User is already a channel member' });
    }

    channel.members.push(user._id);
    await channel.save();
    await channel.populate('members', 'name email avatar');
    res.json(channel);
  } catch (error) {
    console.error('[ChannelController] addChannelMember error:', error);
    res.status(500).json({ error: 'Failed to add channel member' });
  }
}

export async function removeChannelMember(req, res) {
  try {
    const channel = await Channel.findOne({ _id: req.params.channelId, owner: req.user._id });
    if (!channel) return res.status(404).json({ error: 'Channel not found or you are not the owner' });
    if (!mongoose.isValidObjectId(req.params.userId)) return res.status(400).json({ error: 'Invalid user id' });
    if (req.params.userId === req.user._id.toString()) return res.status(400).json({ error: 'Owner cannot be removed; transfer ownership first' });

    const before = channel.members.length;
    channel.members = channel.members.filter((member) => member.toString() !== req.params.userId);
    if (channel.members.length === before) return res.status(404).json({ error: 'User is not a channel member' });
    await channel.save();
    res.json({ success: true, channelId: channel._id, removedUserId: req.params.userId });
  } catch (error) {
    console.error('[ChannelController] removeChannelMember error:', error);
    res.status(500).json({ error: 'Failed to remove channel member' });
  }
}

export async function leaveChannel(req, res) {
  try {
    const channel = await Channel.findOne({ _id: req.params.channelId, members: req.user._id });
    if (!channel) return res.status(404).json({ error: 'Channel not found or access denied' });
    if (channel.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Owner cannot leave the channel; delete it or transfer ownership first' });
    }
    channel.members = channel.members.filter((member) => member.toString() !== req.user._id.toString());
    await channel.save();
    res.json({ success: true, channelId: channel._id });
  } catch (error) {
    console.error('[ChannelController] leaveChannel error:', error);
    res.status(500).json({ error: 'Failed to leave channel' });
  }
}

export async function sendChannelMessage(req, res) {
  try {
    const channel = await findMemberChannel(req.params.channelId, req.user._id);
    if (!channel) return res.status(404).json({ error: 'Channel not found or access denied' });
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text) return res.status(400).json({ error: 'Message text is required' });
    if (text.length > 4000) return res.status(400).json({ error: 'Message cannot exceed 4000 characters' });

    channel.messages.push({ sender: req.user._id, text });
    await channel.save();
    const message = channel.messages[channel.messages.length - 1];
    await message.populate('sender', 'name email avatar');
    res.status(201).json(message);
  } catch (error) {
    console.error('[ChannelController] sendChannelMessage error:', error);
    res.status(500).json({ error: 'Failed to send channel message' });
  }
}

export async function getChannelMessages(req, res) {
  try {
    const channel = await findMemberChannel(req.params.channelId, req.user._id);
    if (!channel) return res.status(404).json({ error: 'Channel not found or access denied' });
    res.json(channel.messages.slice(-200));
  } catch (error) {
    console.error('[ChannelController] getChannelMessages error:', error);
    res.status(500).json({ error: 'Failed to load channel messages' });
  }
}
