import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase/supabase.service';
import { FriendshipService } from '../services/friendship.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-friends',
  standalone: false,
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  friendDisplayName: string = '';
  pendingRequests: { id: string; display_name: string; isSent: boolean }[] = [];
  friends: { display_name: string }[] = [];

  constructor(
    private friendShipService: FriendshipService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    await this.loadFriendsData();
  }

  async loadFriendsData() {
    try {
      this.pendingRequests =
        await this.friendShipService.getPendingFriendRequests();
      this.friends = await this.friendShipService.getFriends();
    } catch (error) {
      this.presentToast(
        'Error loading friends data: ' + (error as Error).message,
        'danger'
      );
    }
  }

  async addFriend() {
    if (!this.friendDisplayName.trim()) {
      this.presentToast('Please enter a display name', 'warning');
      return;
    }
    try {
      await this.friendShipService.sendFriendRequest(this.friendDisplayName);
      this.presentToast('Friend request sent!', 'success');
      this.friendDisplayName = '';
      await this.loadFriendsData();
    } catch (error) {
      this.presentToast(
        'Error sending friend request: ' + (error as Error).message,
        'danger'
      );
    }
  }

  async acceptFriend(requestId: string) {
    try {
      await this.friendShipService.acceptFriendRequest(requestId);
      this.presentToast('Friend request accepted!', 'success');
      await this.loadFriendsData();
    } catch (error) {
      this.presentToast(
        'Error accepting friend request: ' + (error as Error).message,
        'danger'
      );
    }
  }

  async presentToast(message: string, color: string = 'dark') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
      color,
    });
    await toast.present();
  }
}
