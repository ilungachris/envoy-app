// /app/lib/db.ts — service layer (auth, profile, roles, admin RPCs, connect card)
import { getSupabase } from './supabaseClient';
import type { Profile } from './supabaseClient';

function sb() {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  return client;
}

/* ---------- AUTH ---------- */
export async function signIn(email: string, password: string) {
  return await sb().auth.signInWithPassword({ email, password });
}
export async function signUp(email: string, password: string, firstName: string, lastName: string) {
  const { data, error } = await sb().auth.signUp({
    email,
    password,
    options: { data: { first_name: firstName, last_name: lastName } },
  });
  if (error) throw error;
  return data;
}
export async function signOut() { return await sb().auth.signOut(); }
export async function getSelf() { return await sb().auth.getUser(); }

/* ---------- PASSWORD RESET ---------- */
export async function sendPasswordReset(email: string, redirectTo?: string) {
  return await sb().auth.resetPasswordForEmail(email, { redirectTo });
}
export async function updatePassword(newPassword: string) {
  const { data, error } = await sb().auth.updateUser({ password: newPassword });
  if (error) throw error; return data;
}

/* ---------- PROFILES ---------- */
export async function getMyProfile(): Promise<Profile> {
  const { data: { user }, error } = await sb().auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('Not signed in');
  const { data, error: selErr } = await sb().from('profiles').select('*').eq('id', user.id).single();
  if (selErr) throw selErr;
  return data as Profile;
}
export async function updateSelfProfile(updates: Partial<Profile>) {
  const { data: { user }, error } = await sb().auth.getUser();
  if (error) throw error;
  if (!user) throw new Error('Not signed in');
  const { error: updErr } = await sb().from('profiles').update(updates).eq('id', user.id);
  if (updErr) throw updErr;
  return true;
}

/* ---------- ROLES / ADMIN HELPERS ---------- */
export async function myIdentity() {
  const { data: { user }, error } = await sb().auth.getUser();
  if (error) throw error;
  return { id: user?.id ?? null, email: user?.email ?? null };
}
export async function myRoles() {
  const { data: { user } } = await sb().auth.getUser();
  if (!user) return [];
  const { data, error } = await sb().from('user_roles').select('role_key').eq('user_id', user.id);
  if (error) throw error;
  return (data ?? []).map(r => r.role_key as string);
}
export async function getUserRoles(userId: string) {
  const { data, error } = await sb().from('user_roles').select('role_key').eq('user_id', userId);
  if (error) throw error;
  return (data ?? []).map(r => r.role_key as string);
}
export async function amIAdmin() { return (await myRoles()).includes('admin'); }

/* === Admin list with is_admin flag via RPC (SECURITY DEFINER) === */
export type AdminListRow = {
  id: string; first_name: string | null; last_name: string | null;
  city: string | null; created_at: string; is_admin: boolean;
};
export async function listProfilesWithAdmin(): Promise<AdminListRow[]> {
  const { data, error } = await sb().rpc('list_profiles_with_admin');
  if (error) throw error; return (data ?? []) as AdminListRow[];
}
export async function listProfilesWithAdminPage(search: string | null, limit = 30, offset = 0) {
  const { data, error } = await sb().rpc('list_profiles_with_admin_page', {
    search: search && search.trim() ? search.trim() : null,
    lim: limit, off: offset,
  });
  if (error) throw error;
  return (data ?? []) as AdminListRow[];
}
export async function grantAdmin(userId: string) {
  const { error } = await sb().rpc('grant_admin', { target_user: userId }); if (error) throw error; return true;
}
export async function revokeAdmin(userId: string) {
  const { error } = await sb().rpc('revoke_admin', { target_user: userId }); if (error) throw error; return true;
}

/* ---------- Visitor Connect Card ---------- */
export async function submitConnectCard(payload: {
  full_name: string; email?: string | null; phone?: string | null;
  how_hear?: string | null; notes?: string | null;
}) {
  const { error } = await sb().from('connect_cards').insert(payload);
  if (error) throw error; return true;
}

/* (Optional legacy) */
export async function listProfilesAdmin(q?: string) {
  let query = sb().from('profiles').select('*').order('created_at', { ascending: false });
  if (q && q.trim()) {
    const ilike = `%${q.trim()}%`;
    // @ts-ignore supabase-js or() filter
    query = query.or(`first_name.ilike.${ilike},last_name.ilike.${ilike},city.ilike.${ilike}`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export const db = {
  signIn, signUp, signOut, getSelf,
  sendPasswordReset, updatePassword,
  getMyProfile, updateSelfProfile,
  myIdentity, myRoles, getUserRoles, amIAdmin,
  listProfilesWithAdmin, listProfilesWithAdminPage, grantAdmin, revokeAdmin,
  submitConnectCard, listProfilesAdmin,
};
