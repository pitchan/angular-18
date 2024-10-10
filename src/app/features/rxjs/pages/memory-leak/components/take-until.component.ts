import { Component, inject } from '@angular/core';
import { Data } from '@angular/router';
import { RxjsService } from '../../../services/rxjs.service';
import { Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-take-until',
  standalone: true,
  imports: [],
  templateUrl: './take-until.component.html'
})
export class TakeUntilComponent {
    data: Data | null = null;

    #rxjsService = inject(RxjsService)
    #destroy$ = new Subject<void>();

    /*pollingStream = this.#rxjsService.url$.pipe(
        takeUntil(this.#destroy$),
        switchMap(url => this.#rxjsService.startPollingData(url))
    ).subscribe(data => this.data = data);*/

    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }
}
