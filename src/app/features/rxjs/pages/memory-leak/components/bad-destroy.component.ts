import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, effect, inject, signal, untracked } from '@angular/core';
import { Data } from '@angular/router';
import { RxjsService } from '../../../services/rxjs.service';
import { EMPTY, Observable, Subject, Subscriber, Subscription, catchError, interval, map, min, of, switchMap, take, takeUntil, tap } from 'rxjs';
import { PokemonApiService } from '../../../../../core/services/pokemon-api.service';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HighlightJsDirective } from 'ngx-highlight-js';
import { CommonModule } from '@angular/common';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { Pokemon } from '../../../../../core/model/pokemon.model';


export enum CodeStatus {
    CompleteWithTakeUntilDestroyedKO = 'CompleteWithTakeUntilDestroyedKO',
    CompleteWithTakeUntilDestroyedOK = 'CompleteWithTakeUntilDestroyedOK',
    CompleteWithTakeUntilKO = 'CompleteWithTakeUntilKO',
    CompleteWithTakeUntilOK = 'CompleteWithTakeUntilOK',
    completeWithTakeKO = 'completeWithTakeKO',
    completeWithTakeOK = 'completeWithTakeOK',
    CompleteWithUnsubscribeOneOK = 'CompleteWithUnsubscribeOneOK'
}

@Component({
  selector: 'app-bad-destroy',
  standalone: true,
  imports: [CommonModule, MatButtonModule, HighlightJsDirective, MatRadioModule],  
  templateUrl: './bad-destroy.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadDestroyComponent {
    data: Data | null = null;

    #rxjsService = inject(RxjsService);
    #pokemonApiService = inject(PokemonApiService);
    #destroyRef = inject(DestroyRef)

    #destroy$ = new Subject<void>();

    #pokemonStream$: Observable<any> = EMPTY;;
    #pokemonStreamSubscribed: Subscription | null = null;

    codeStatus = CodeStatus;
    selectedFunction = signal<CodeStatus>(this.codeStatus.completeWithTakeKO); // Variable pour stocker l'option sélectionnée
    
    

    // Certains operateurs doivent être placé aprés le takeUntilDestroy
    // last() : Emits the last value before completion
    // takeLast() : Emits the last n values before completion
    // toArray() : Collects all values into an array
    // reduce() : Applies an accumulator function to all values and emits the final result
    // count() : Emits the total number of values emitted
    // max() : Emits the maximum value
    // min() : Emits the minimum value
    // ...

    constructor() {
        const status = this.selectedFunction();
        this.executeFunction(status);   

    }

    /**
     * Select one observable function
     * @param event The value selected 
     */
    selectFunction(event: any): void {
        this.selectedFunction.set(event.value);
        this.executeFunction(event.value);
    }

    /**
     * Execute observable depending on the one selected
     * @param status Name of the selected function
     */
    executeFunction(status: string): void {
        switch (status) {
            case CodeStatus.CompleteWithTakeUntilDestroyedKO:
                this.#pokemonStream$ = this.completeWithTakeUntilDestroyedKO();
                break;
            case CodeStatus.CompleteWithTakeUntilDestroyedOK:
                this.#pokemonStream$ = this.completeWithTakeUntilDestroyedOK();
                break;
            case CodeStatus.CompleteWithTakeUntilKO:
                this.#pokemonStream$ = this.completeWithTakeUntilKO();
                break;
            case CodeStatus.CompleteWithTakeUntilOK:
                this.#pokemonStream$ = this.completeWithTakeUntilOK();
                break;
            case CodeStatus.completeWithTakeKO:
                this.#pokemonStream$ = this.completeWithTakeKO();
                break;
            case CodeStatus.completeWithTakeOK:
                this.#pokemonStream$ = this.completeWithTakeOK();
                break; 
            case CodeStatus.CompleteWithUnsubscribeOneOK:
                this.#pokemonStream$ = this.completeWithUnsubscribeOneOK();
                break; 
            default : 
                this.#pokemonStream$ = this.completeWithTakeKO();
                break;    
        }
    }

    /**
     * Start observable
     */
    startFunction(): void {        
        if (this.#pokemonStream$) {
            this.#pokemonStreamSubscribed?.unsubscribe();
            this.#pokemonStreamSubscribed = this.#pokemonStream$.subscribe()
        }
    }

    /**
     * Destroy observable
     */
    destroyFunction() {
        this.#pokemonStreamSubscribed?.unsubscribe()
    }
    
    /**
     * Automatically fetches and updates the current Pokémon at regular intervals
     * @param multiplier 
     * @returns Observable<Pokemon>
     */
    getPokemonEveryTwoseconds(multiplier?: number): Observable<Pokemon> {
        return interval(2000).pipe(
            switchMap(() => {
                const randomId = multiplier ? this.getRandomMultipleId(multiplier) :
                    Math.floor(Math.random() * 898) + 1;
                return this.#pokemonApiService.getPokemonById(randomId);
            })
        );
    }

    /**
     * Get pokemon depending on a multiplier
     * @param multiplier 
     * @returns number
     */
    getRandomMultipleId(multiplier: number): number {
        const maxId = 898; // Max pokemon number
        
        const maxMultiplier = Math.floor(maxId / multiplier);
        const randomMultiplier = Math.floor(Math.random() * maxMultiplier) + 1;
    
        // Return a valid multiple of multiply
        return randomMultiplier * multiplier;
    }

    /**
     * Complete observable with takeUntilDestroyed() not working
     */
    completeWithTakeUntilDestroyedKO() {
        return of([]).pipe(    
            takeUntilDestroyed(this.#destroyRef), 
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
        return of([]).pipe(
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }),    
            takeUntilDestroyed(this.#destroyRef), 
        );
    }
    

    /**
     * Complete observable with takeUntil() not working
     */
    completeWithTakeUntilKO() {
        return of([]).pipe(    
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
        return of([]).pipe(    
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
    completeWithTakeKO() {
        const multiplierList = [2,3,5,7];
        return of(...multiplierList).pipe(
            switchMap((multiplier) => {
                console.log(multiplier);
                return this.getPokemonEveryTwoseconds(multiplier)
            }),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }), 
            take(2),
            takeUntil(this.#destroy$) 
        );
    }

    /**
     * Complete observable with take(1) working properly
     */
    completeWithTakeOK() {
        const multiplierList = [2,3,5,7];
        return of(...multiplierList).pipe(
            take(2),
            switchMap((multiplier) => {
                console.log(multiplier);
                return this.getPokemonEveryTwoseconds(multiplier)
            }),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }), 
            takeUntil(this.#destroy$)
        );        
    }

    /**
     * Complete observable unsubscribing after ngOnDestroy
     */
    completeWithUnsubscribeOneOK() {
        return of([]).pipe(    
            switchMap(() => this.getPokemonEveryTwoseconds()),
            tap((pokemon) => {
                this.#rxjsService.currentPokemon.set(pokemon);
                this.#rxjsService.addLog('Request interval launched ' + pokemon.name, 'request')
            }),             
        );
    }

    
    ngOnDestroy(): void {
        this.#destroy$.next();
        this.#destroy$.complete();
        if (this.#pokemonStreamSubscribed && this.selectedFunction() === this.codeStatus.CompleteWithUnsubscribeOneOK) {
            this.#pokemonStreamSubscribed.unsubscribe();
        }
    }
}
