import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-pushup-counter',
  imports: [],
  templateUrl: './pushup-counter.component.html',
  styleUrl: './pushup-counter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PushupCounterComponent {
  @Input() title = 'Exercice libre';

  @Output() change = new EventEmitter<number>();
  count = 0;

  private debounceTimeout: any;
  private debounceDelay = 200;

  incrementCount() {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.count = (this.count || 0) + 1;
      this.change.emit(this.count);
    }, this.debounceDelay);
  }
}
