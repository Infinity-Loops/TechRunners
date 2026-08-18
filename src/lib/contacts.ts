import "server-only";
import { getSupabaseAdmin } from "./supabase";

const TABLE = "contact_messages";

export type ContactMessage = {
  id: string;
  created_at: string;
  status: string;
  name: string | null;
  email: string;
  subject: string | null;
  category: string | null;
  message: string;
  user_agent: string | null;
};

export type NewContactMessage = {
  name: string | null;
  email: string;
  subject: string | null;
  category: string | null;
  message: string;
  user_agent: string | null;
};

export async function createContactMessage(
  input: NewContactMessage
): Promise<ContactMessage> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(TABLE)
    .insert(input)
    .select("*")
    .single();
  if (error) throw new Error(`Failed to save message: ${error.message}`);
  return data as ContactMessage;
}

export async function listContactMessages(
  status?: string
): Promise<ContactMessage[]> {
  const supabase = getSupabaseAdmin();
  let query = supabase
    .from(TABLE)
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (status) query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(`Failed to load messages: ${error.message}`);
  return (data ?? []) as ContactMessage[];
}

export async function updateContactStatus(
  id: string,
  status: string
): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(TABLE).update({ status }).eq("id", id);
  if (error) throw new Error(`Failed to update message: ${error.message}`);
}

export async function deleteContactMessage(id: string): Promise<void> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(`Failed to delete message: ${error.message}`);
}

export async function contactStats() {
  const messages = await listContactMessages();
  return {
    total: messages.length,
    new: messages.filter((m) => m.status === "new").length,
  };
}
