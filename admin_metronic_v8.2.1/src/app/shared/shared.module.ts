import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HasPermissionDirective } from './directives/has-permission.directive';
import { MapComponent } from './components/map/map.component';



@NgModule({
  declarations: [
    HasPermissionDirective,
    MapComponent
  ],
  imports: [
    CommonModule
  ],
  exports :[
    HasPermissionDirective,
    MapComponent
  ]
})
export class SharedModule { }
