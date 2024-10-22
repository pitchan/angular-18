import { AfterViewChecked, ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child',
  standalone: true,
  imports: [],
  templateUrl: './child.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildComponent implements OnChanges, DoCheck, AfterViewChecked {

  @Input() data!: string;
  @Input() inputValue!: string;  // Receive initial value from parent
  @Output() inputValueChange = new EventEmitter<string>();

  constructor() {
    console.log('ChildComponent: Constructor');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ChildComponent: ngOnChanges', changes);
  }

  ngDoCheck() {
    console.log('ChildComponent: ngDoCheck');
  }

  ngAfterViewChecked() {
    console.log('ChildComponent: ngAfterViewChecked');
  }

  onInputChange(event: any) {
    const newValue = event.target.value;
    this.inputValueChange.emit(newValue);  // Emit new value to parent
  }
}
