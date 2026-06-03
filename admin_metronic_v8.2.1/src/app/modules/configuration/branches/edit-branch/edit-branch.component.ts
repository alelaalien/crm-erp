import { Component, EventEmitter, Input, Output } from '@angular/core';
 
@Component({
  selector: 'app-edit-branch',
  templateUrl: './edit-branch.component.html',
  styleUrls: ['./edit-branch.component.scss']
})
export class EditBranchComponent {
  @Output() BranchE: EventEmitter<any> = new EventEmitter();
  @Input() BRANCH_SELECTED : any;
}
