import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {
    
    @Output() UserD : EventEmitter<any> = new EventEmitter();

    @Input() USER_SELECTED: any;

    name: string = '';
    last_name: string = '';


    isLoading: any;  
    

    constructor(
      public modal:NgbActiveModal,
      public userService: UserService,
      private toastr : ToastrService
    ){

    }

    ngOnInit(): void{ 
      this.name = this.USER_SELECTED.name;
      this.last_name = this.USER_SELECTED.last_name;
     }
 
    deleteUser(data:any){
       
       
            this.userService.deleteUser(data).subscribe({ 
              next:(resp: any) =>  {

                        this.UserD.emit(resp);
                        this.toastr.info(resp.message);
                        this.modal.close();
              },
              error:(error:any) =>{
                const errorMsg = error.error?.message || "Something went wrong."; 
                this.toastr.error(errorMsg, 'Error');
              } 
             });  
    }
}
 

