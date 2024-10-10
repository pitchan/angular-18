import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Data } from '@angular/router';
import { RxjsService } from '../../../services/rxjs.service';
import { Subject, catchError, interval, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { PokemonApiService } from '../../../../../core/services/pokemon-api.service';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-take-until',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './take-until.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TakeUntilComponent {
    data: Data | null = null;

    #rxjsService = inject(RxjsService);
    #pokemonApiService = inject(PokemonApiService);

    #destroy$ = new Subject<void>();

    /* Destroy not working */
    pokemonStream = this.completeWithTakeUntilDestroyedKO();    
    // pokemonStream = this.completeWithTakeUntilKO();
    // pokemonStream = this.completeWithTakeOneKO();


    /* Destroy working */
    // pokemonStream = this.completeWithTakeUntilDestroyedOK();
    // pokemonStream = this.completeWithTakeUntilOK();
    // pokemonStream = this.completeWithTakeOneOK();
    // pokemonStream = this.completeWithUnsubscribeOneOK()


    // Certains operateurs doivent être placé aprés le takeUntilDestroy
    // last() : Emits the last value before completion
    // takeLast() : Emits the last n values before completion
    // toArray() : Collects all values into an array
    // reduce() : Applies an accumulator function to all values and emits the final result
    // count() : Emits the total number of values emitted
    // max() : Emits the maximum value
    // min() : Emits the minimum value
    // ...
    
    getPokemonEveryTwoseconds() {
        return interval(2000).pipe(
            switchMap(() => {
                const randomId = Math.floor(Math.random() * 898) + 1;
                return this.#pokemonApiService.getPokemonById(randomId);
            })
        );
    }   
    
    startPokemonStream() {
        this.pokemonStream.subscribe();
    }



    /**
     * Complete observable with takeUntilDestroyed() not working
     */
    completeWithTakeUntilDestroyedKO() {
        return this.#pokemonApiService.getPokemonById(82).pipe(    
            takeUntilDestroyed(), 
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }),     
        );
    }

    /**
     * Complete observable with takeUntilDestroyed() working properly
     */
    completeWithTakeUntilDestroyedOK() {
        return this.#pokemonApiService.getPokemonById(82).pipe(
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }),    
            takeUntilDestroyed(), 
        );
    }
    

    /**
     * Complete observable with takeUntil() not working
     */
    completeWithTakeUntilKO() {
        return this.#pokemonApiService.getPokemonById(82).pipe(    
            //takeUntilDestroyed(), 
            takeUntil(this.#destroy$),           
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }),     
        );
    }

    /**
     * Complete observable with takeUntil() working properly
     */
    completeWithTakeUntilOK() {
        return this.#pokemonApiService.getPokemonById(82).pipe(    
            //takeUntilDestroyed(),                        
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }),    
            takeUntil(this.#destroy$) 
        );
    }

    /**
     * Complete observable with take(1) not working
     */
    completeWithTakeOneKO() {
        return this.#pokemonApiService.getPokemonById(82).pipe(    
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }), 
            take(1) 
        );
    }

    /**
     * Complete observable with take(1) working properly
     */
    completeWithTakeOneOK() {
        return this.#pokemonApiService.getPokemonById(82).pipe(    
            take(1),
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }),             
            takeUntilDestroyed(),   
        );
    }

    /**
     * Complete observable unsubscribing after ngOnDestroy
     */
    completeWithUnsubscribeOneOK() {
        return this.#pokemonApiService.getPokemonById(82).pipe(    
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }),             
        ).subscribe();
    }

    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
        // this.pokemonStream.unsubscribe();
    }
}
