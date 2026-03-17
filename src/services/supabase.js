import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase URL or Anon Key is missing. Ensure they are set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function deductUserCredit(userId) {
  try {
    // Get current credits
    const { data, error: fetchError } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;
    if (data.credits <= 0) throw new Error('Insufficient credits');

    // Deduct one credit
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ credits: data.credits - 1 })
      .eq('id', userId);

    if (updateError) throw updateError;

    return { success: true, remainingCredits: data.credits - 1 };
  } catch (error) {
    console.error('Error deducting credit:', error);
    return { success: false, error: error.message };
  }
}

export async function syncUserStats(userId, stats) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        streak_days: stats.streakDays,
        last_session_date: stats.lastSessionDate,
        total_sessions: stats.totalSessions,
        total_time_spent: stats.totalTimeSpent,
      })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error syncing user stats:', error);
    return { success: false, error: error.message };
  }
}

export async function getTopStreaks(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, streak_days')
      .order('streak_days', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching top streaks:', error);
    return [];
  }
}

export async function updateProfileVisibility(userId, isPublic) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ is_public: isPublic })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating profile visibility:', error);
    return { success: false, error: error.message };
  }
}

export async function updateProfileName(userId, displayName) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName })
      .eq('id', userId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating profile name:', error);
    return { success: false, error: error.message };
  }
}
