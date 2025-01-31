import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SearchEffects } from './search.effects';
import { searchReducer } from './search.reducer';

@NgModule({
  imports: [StoreModule.forFeature('SEARCH', searchReducer), EffectsModule.forFeature([SearchEffects])],
})
export class SearchStoreModule {}
