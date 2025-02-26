import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserInfo } from './supabase.model';

const SUPABASE_URL = 'https://phprmpigdtmkrmkaqeup.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBocHJtcGlnZHRta3Jta2FxZXVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA1MjMzOTgsImV4cCI6MjA1NjA5OTM5OH0.DenbPMytyW3kGdKEsBv3i0qZNKg9kEmT1Gpvwwq0ZVQ';

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  }

  get client() {
    return this.supabase;
  }

  async signUp({
    email,
    password,
    options,
  }: {
    email: string;
    password: string;
    options: any;
  }) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options
    });
    return { data, error };
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  getSession() {
    return this.supabase.auth.getSession();
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  private async updateProfile(userId: string, displayName: string) {
    const { error } = await this.supabase.from('profiles').upsert({
      id: userId,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }

  async getUserInfo() {
    const {
      data: { session },
    } = await this.getSession();
    if (!session) return null;

    const { data: profile, error } = await this.supabase
      .from('profiles')
      .select('display_name')
      .eq('id', session.user.id)
      .single();

    if (error) throw error;

    return {
      email: session.user.email,
      displayName: profile?.display_name || '',
      id: session.user.id,
      lastSignIn: session.user.last_sign_in_at,
    } as UserInfo;
  }
}
