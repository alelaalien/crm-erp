import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchesComponent } from './branches.component';
import { ListBranchComponent } from './list-branch/list-branch.component';

const routes: Routes = [
  {
    path: "",
    component: BranchesComponent,
    children: [
      {
        path: 'list',
        component: ListBranchComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchesRoutingModule { }
