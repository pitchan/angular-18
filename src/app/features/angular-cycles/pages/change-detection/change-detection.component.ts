import { AfterViewChecked, ChangeDetectionStrategy, Component, DoCheck } from '@angular/core';
import { ChildComponent } from './components/child.component';

@Component({
  selector: 'app-change-detection',
  standalone: true,
  imports: [ChildComponent],
  templateUrl: './change-detection.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangeDetectionComponent implements DoCheck, AfterViewChecked  {

  data: string = 'Initial Data';
  inputValue: string = 'Initial Input Value';
  counter = 0;
  

  constructor() {
    console.log('ParentComponent: Constructor');
    /*setInterval(() => {
      this.counter++;
    }, 100);*/
  }

  ngDoCheck() {
    console.log('ParentComponent: ngDoCheck');
  }

  ngAfterViewChecked() {
    console.log('ParentComponent: ngAfterViewChecked');
  }

  changeData() {
    this.data = 'Updated Data ' + Math.random();
  }

  onInputValueChange(newValue: string) {
    console.log('ParentComponent: Input value changed to:', newValue);
    this.inputValue = newValue;  // Met à jour la valeur dans le parent
  }
}
