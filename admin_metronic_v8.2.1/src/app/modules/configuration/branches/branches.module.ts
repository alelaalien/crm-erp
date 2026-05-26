import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesRoutingModule } from './branches-routing.module';
import { BranchesComponent } from './branches.component';
import { CreateBrachComponent } from './create-brach/create-brach.component';
import { EditBrachComponent } from './edit-brach/edit-brach.component';
import { ListBrachComponent } from './list-brach/list-brach.component';
import { DeleteBrachComponent } from './delete-brach/delete-brach.component';


@NgModule({
  declarations: [
    BranchesComponent,
    CreateBrachComponent,
    EditBrachComponent,
    ListBrachComponent,
    DeleteBrachComponent
  ],
  imports: [
    CommonModule,
    BranchesRoutingModule
  ]
})
export class BranchesModule { }
