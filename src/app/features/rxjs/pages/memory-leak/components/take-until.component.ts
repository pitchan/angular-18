import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Data } from '@angular/router';
import { RxjsService } from '../../../services/rxjs.service';
import { Subject, catchError, interval, of, switchMap, takeUntil, tap } from 'rxjs';
import { PokemonApiService } from '../../../../../core/services/pokemon-api.service';

@Component({
  selector: 'app-take-until',
  standalone: true,
  imports: [],
  templateUrl: './take-until.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TakeUntilComponent {
    data: Data | null = null;

    #rxjsService = inject(RxjsService);
    #pokemonApiService = inject(PokemonApiService);

    #destroy$ = new Subject<void>();

    pokemonStream = this.#pokemonApiService.getPokemonById(82).pipe(
        takeUntil(this.#destroy$),
        switchMap(() => this.getPokemonEveryTwoseconds()),
        tap((pokemon) => {
            this.#rxjsService.currentPokemon.set(pokemon);
            this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
        })        
    ).subscribe();
    
    getPokemonEveryTwoseconds() {
        return interval(2000).pipe(
            switchMap(() => {
                const randomId = Math.floor(Math.random() * 898) + 1;
                return this.#pokemonApiService.getPokemonById(randomId);
            })
        );
    }    

    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
    }
}
