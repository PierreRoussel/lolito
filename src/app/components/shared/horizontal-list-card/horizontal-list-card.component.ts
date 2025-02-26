import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-horizontal-list-card',
  imports: [IonicModule],
  templateUrl: './horizontal-list-card.component.html',
  styleUrl: './horizontal-list-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HorizontalListCardComponent {
  @Input() text?: string;
  @Input() icon?: string;
  @Input() variant: 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral' =
    'neutral';
}
