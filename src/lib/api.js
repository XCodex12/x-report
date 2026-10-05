import { supabase } from './supabaseClient';

function fromRow(r) {
  return {
    id: 'XR-' + r.id,
    dbId: r.id,
    userId: r.user_id,
    title: r.title,
    description: r.description,
    category: r.category,
    severity: r.severity,
    location: r.location,
    lat: r.lat,
    lng: r.lng,
    status: r.status,
    confirmations: r.confirmations,
    createdAt: r.created_at.slice(0, 10),
    resolvedAt: r.resolved_at,
    demo: r.is_demo,
  };
}

export async function fetchIssues() {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(fromRow);
}

export async function fetchMyConfirmations() {
  const { data, error } = await supabase.rpc('my_confirmations');
  if (error) throw error;
  return (data || []).map((n) => 'XR-' + n);
}

export async function createIssue(input) {
  const { data, error } = await supabase
    .from('issues')
    .insert({
      title: input.title,
      description: input.description,
      category: input.category,
      severity: input.severity,
      location: input.location,
      lat: input.lat,
      lng: input.lng,
    })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function toggleConfirmation(dbId) {
  const { data, error } = await supabase.rpc('toggle_confirmation', { p_issue_id: dbId });
  if (error) throw error;
  return data; // { confirmed: boolean, count: number }
}

export async function fetchHistory(dbId) {
  const { data, error } = await supabase
    .from('status_history')
    .select('id, status, note, created_at')
    .eq('issue_id', dbId)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
}

export async function setIssueStatus(dbId, status, note) {
  const { error } = await supabase.rpc('set_issue_status', {
    p_issue_id: dbId,
    p_status: status,
    p_note: note || null,
  });
  if (error) throw error;
}