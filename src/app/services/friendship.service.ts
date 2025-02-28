import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase/supabase.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class FriendshipService {
  constructor(
    private supabaseService: SupabaseService,
    private toastController: ToastController
  ) {}

  async sendFriendRequest(friendDisplayName: string): Promise<void> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) throw new Error('User not authenticated');

    const { data: friend, error: findError } = await this.supabaseService.client
      .from('profiles')
      .select('id')
      .eq('display_name', friendDisplayName)
      .single();

    if (findError || !friend) throw new Error('User not found');

    const { error } = await this.supabaseService.client.from('friends').insert({
      user_id: session.session.user.id,
      friend_id: friend.id,
      status: 'pending',
    });

    if (error) throw error;
  }

  // Get pending friend requests (sent and received)
  async getPendingFriendRequests(): Promise<
    { id: string; display_name: string; isSent: boolean }[]
  > {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService.client
      .from('friends')
      .select(
        `
      id,
      user_id,
      friend_id,
      user_profile:profiles!user_id (display_name),
      friend_profile:profiles!friend_id (display_name)
    `
      )
      .eq('status', 'pending')
      .or(
        `user_id.eq.${session.session.user.id},friend_id.eq.${session.session.user.id}`
      );

    if (error) throw error;

    return (data || []).map((request: any) => ({
      id: request.id,
      display_name:
        request.user_id === session.session.user.id
          ? request.friend_profile?.display_name
          : request.user_profile?.display_name,
      isSent: request.user_id === session.session.user.id,
    }));
  }

  // Get accepted friends
  async getFriends(): Promise<{ display_name: string }[]> {
    const { data: session } = await this.supabaseService.getSession();
    if (!session.session?.user) throw new Error('User not authenticated');

    const { data, error } = await this.supabaseService.client
      .from('friends')
      .select(`
        user_id,
        friend_id,
        user_profile:profiles!user_id (display_name),
        friend_profile:profiles!friend_id (display_name)
      `)
      .eq('status', 'accepted')
      .or(`user_id.eq.${session.session.user.id},friend_id.eq.${session.session.user.id}`);

    if (error) throw error;

    return (data || []).map((friend: any) => ({
      display_name: friend.user_id === session.session.user.id
        ? friend.friend_profile?.display_name
        : friend.user_profile?.display_name
    }));
  }

  // Accept a friend request
  async acceptFriendRequest(requestId: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (error) throw error;
  }
}
