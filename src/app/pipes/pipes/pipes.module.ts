import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncateDecimals2Pipe } from './truncado/truncate-decimals2.pipe';



@NgModule({
  declarations: [
    TruncateDecimals2Pipe
  ],
  imports: [
    CommonModule
  ], 
  exports:[TruncateDecimals2Pipe]
})
export class PipesModule { }
