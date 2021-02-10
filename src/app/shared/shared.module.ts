import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowseFileButtonComponent } from './components/browse-file-button/browse-file-button.component';
import { AngularMaterialModule } from '../angular-material.module';



@NgModule({
  declarations: [
    BrowseFileButtonComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    BrowseFileButtonComponent
  ]
})
export class SharedModule { }
