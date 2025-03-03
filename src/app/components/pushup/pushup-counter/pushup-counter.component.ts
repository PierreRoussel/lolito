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
  @Input() desc = false;
  @Input() count = 0;

  @Output() change = new EventEmitter<number>();

  private debounceTimeout: any;
  private debounceDelay = 200;

  incrementCount() {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      this.count = (this.count || 0) + (this.desc ? -1 : 1);
      this.change.emit(this.count);
    }, this.debounceDelay);
  }
}
