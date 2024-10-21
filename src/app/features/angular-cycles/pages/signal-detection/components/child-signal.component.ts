import { AfterViewChecked, ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnChanges, Output, SimpleChanges, input, model } from '@angular/core';

@Component({
  selector: 'app-child-signal',
  standalone: true,
  imports: [],
  templateUrl: './child-signal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChildSignalComponent implements OnChanges, DoCheck, AfterViewChecked {

  data = input.required<string>();
  inputValue = input.required<string>();  
  inputValueChange = model<string>();

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
    this.inputValueChange.set(newValue);  // Émet la nouvelle valeur au parent
  }
}
