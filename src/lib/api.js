import { supabase } from './supabaseClient';

let memoryDeviceId = null;

export function getDeviceId() {
  try {
    let id = localStorage.getItem('xr-device-id');
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem('xr-device-id', id);
    }
    return id;
  } catch {
    if (!memoryDeviceId) memoryDeviceId = crypto.randomUUID();
    return memoryDeviceId;
  }
}

function fromRow(r) {
  return {
    id: 'XR-' + r.id,
    dbId: r.id,
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
  const { data, error } = await supabase.rpc('my_confirmations', { p_device_id: getDeviceId() });
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
  const { data, error } = await supabase.rpc('toggle_confirmation', {
    p_issue_id: dbId,
    p_device_id: getDeviceId(),
  });
  if (error) throw error;
  return data; // { confirmed: boolean, count: number }
}