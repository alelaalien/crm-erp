import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BranchService } from 'src/app/core/services/branch.service';

@Component({
  selector: 'app-delete-branch',
  templateUrl: './delete-branch.component.html',
  styleUrls: ['./delete-branch.component.scss']
})
export class DeleteBranchComponent {

  @Output() BranchD : EventEmitter<any> = new EventEmitter();
  @Input() BRANCH_SELECTED : any;
  name: string = "";
  isLoading$: any;
  addres: string="";

  constructor(
        public modal:NgbActiveModal,
        public service: BranchService, 
        private toastr : ToastrService
      ){ }

  delete(data:any){
       
       
            this.service.delete(data).subscribe({ 
              next:(resp: any) =>  {

                        this.BranchD.emit(resp); 
                        this.modal.close();
              },
              error:(error:any) =>{
                const errorMsg = error.error?.message || "Something went wrong."; 
                this.toastr.error(errorMsg, 'Error');
              } 
             });  
    }

}
