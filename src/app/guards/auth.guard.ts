import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {
    const { data } = await this.supabaseService.getSession();
    if (data.session) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
