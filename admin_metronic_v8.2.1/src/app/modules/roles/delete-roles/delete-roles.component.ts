import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SIDEBAR } from 'src/app/config/config';
import { RolesServiceService } from '../service/roles-service.service';

@Component({
  selector: 'app-delete-roles',
  templateUrl: './delete-roles.component.html',
  styleUrls: ['./delete-roles.component.scss']
})
export class DeleteRolesComponent {
    
    @Output() RoleD : EventEmitter<any> = new EventEmitter();

    @Input() ROLE_SELECTED: any;

    name: string = '';

    isLoading: any;

    SIDEBAR: any = SIDEBAR;

    permissions:any = [];
    

    constructor(
      public modal:NgbActiveModal,
      public rolesService: RolesServiceService,
      private toastr : ToastrService
    ){

    }

    ngOnInit(): void{  }
 
    deleteRole(data:any){
       
       
            this.rolesService.deleteRole(data).subscribe({ 
              next:(resp: any) =>  {

                        this.RoleD.emit(resp);
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
