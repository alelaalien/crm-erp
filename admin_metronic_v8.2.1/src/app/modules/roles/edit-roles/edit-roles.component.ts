import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RolesServiceService } from 'src/app/core/services/roles-service.service';
import { ToastrService } from 'ngx-toastr';
import { SIDEBAR } from 'src/app/config/config';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.scss']
})
export class EditRolesComponent {

    @Output() RoleE : EventEmitter<any> = new EventEmitter();

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

    ngOnInit(): void{

      this.name = this.ROLE_SELECTED.name;
      this.permissions = this.ROLE_SELECTED.permission_pluck;
 
    }


    addPermission(permission:string){
 
      let index = this.permissions.findIndex((p:string) => p == permission);

      index != -1 ? this.permissions.splice(index, 1) :   this.permissions.push(permission);

   
    }
 
    editRole(data:any){
       
    
      let role = {
        name: data.name,
        permissions: data.permission_pluck,
        id: data.id
      }
 
      const rules = [

        {test : !role.name.trim(), msg: 'Please enter a role name.' },
        {test: !role.permissions?.length, msg : 'Please select one or more permissions.'}

      ];
        const error = rules.find(rule=> rule.test);

      if(error) {
              this.toastr.error('Error!', error.msg  );

              return;
      }
 
      this.rolesService.updateRole(role).subscribe((resp: any) =>  { 
       
                        this.RoleE.emit(resp.id);
                        this.modal.close();
                      
      })

    }
}
