import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export const subscribeToPortalChanges = ({ profileId, campusId, studentId, isStaff, onChange, onReconnect }) => {
  if (!supabase || !profileId || !campusId) return () => undefined;

  const channel = supabase.channel(`unify-portal-${profileId}`);
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'notifications', filter: `recipient_id=eq.${profileId}` }, (payload) => onChange('notifications', payload));
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'notices', filter: `campus_id=eq.${campusId}` }, (payload) => onChange('notices', payload));
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'complaints', filter: isStaff ? `campus_id=eq.${campusId}` : `reporter_profile_id=eq.${profileId}` }, (payload) => onChange('complaints', payload));
  channel.on('postgres_changes', { event: '*', schema: 'public', table: 'gate_passes', filter: isStaff ? `campus_id=eq.${campusId}` : `student_id=eq.${studentId}` }, (payload) => onChange('gate_passes', payload));
  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') return;
    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') onReconnect();
  });

  return () => {
    void supabase.removeChannel(channel);
  };
};
