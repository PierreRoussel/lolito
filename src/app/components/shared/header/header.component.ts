import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import {
  IonButton,
  IonIcon,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/angular/standalone';
import { TabsPage } from 'src/app/tabs/tabs.page';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  imports: [
    ThemeSwitcherComponent,
    IonButton,
    IonHeader,
    IonIcon,
    IonToolbar,
    IonTitle,
    RouterModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @Input() title?: string;
  @Input() withBbtn = false;
  component = TabsPage;
}
