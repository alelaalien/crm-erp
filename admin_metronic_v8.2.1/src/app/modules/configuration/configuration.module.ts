import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigurationRoutingModule } from './configuration-routing.module';
import { BranchesModule } from './branches/branches.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,

    BranchesModule
  ]
})
export class ConfigurationModule { }
