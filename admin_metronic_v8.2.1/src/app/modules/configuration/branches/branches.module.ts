import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BranchesRoutingModule } from './branches-routing.module';
import { BranchesComponent } from './branches.component';
import { CreateBranchComponent } from './create-branch/create-branch.component';
import { EditBranchComponent } from './edit-branch/edit-branch.component';
import { ListBranchComponent } from './list-branch/list-branch.component';
import { DeleteBranchComponent } from './delete-branch/delete-branch.component';
import {  HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModalModule, NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';  
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    BranchesComponent,
    CreateBranchComponent,
    EditBranchComponent,
    ListBranchComponent,
    DeleteBranchComponent
  ],
  imports: [
    CommonModule,
    BranchesRoutingModule, 
    HttpClientModule,
    FormsModule, 
    RouterModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    SharedModule,
    NgbModule
  ]
})
export class BranchesModule { }
