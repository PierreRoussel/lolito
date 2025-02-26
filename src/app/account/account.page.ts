import { Component } from '@angular/core';
import { SupabaseService } from '../services/supabase/supabase.service';
import { Router } from '@angular/router';
import { UserInfo } from '../services/supabase/supabase.model';

@Component({
  selector: 'app-account',
  templateUrl: 'account.page.html',
  styleUrls: ['account.page.scss'],
  standalone: false,
})
export class AccountPage {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async logout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/login']);
  }

  userInfo: UserInfo | null = null;

  async ngOnInit() {
    const userInfo = await this.supabaseService.getUserInfo();
    console.log('🚀 ~ userInfo:', userInfo);
    if (userInfo) {
      this.userInfo = userInfo;
    }
  }
}
