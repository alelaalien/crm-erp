import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})
export class CreateBranchComponent {
@Output() BranchC : EventEmitter<any> = new EventEmitter();
}
