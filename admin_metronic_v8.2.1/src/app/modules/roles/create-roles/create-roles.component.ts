import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';
import { RolesServiceService } from '../service/roles-service.service';
import { ToastrService } from 'ngx-toastr';
 

@Component({
  selector: 'app-create-roles',
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss']
})
export class CreateRolesComponent {

    @Output() RoleC : EventEmitter<any> = new EventEmitter();

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


    }


    addPermission(permission:string){
 
      let index = this.permissions.findIndex((p:string) => p == permission);

      index != -1 ? this.permissions.splice(index, 1) :   this.permissions.push(permission);

   
    }
 
    store(){

      let data = {
        name: this.name,
        permissions: this.permissions
      }

      const rules = [

        {test : !data.name.trim(), msg: 'Please enter a role name.' },
        {test: !this.permissions?.length, msg : 'Please select one or more permissions.'}

      ];
        const error = rules.find(rule=> rule.test);

      if(error) {
              this.toastr.error('Error!', error.msg  );

              return;
      }
 
      this.rolesService.registerRole(data).subscribe((resp: any) =>  { 
       
                        this.RoleC.emit(resp.role);
                        this.modal.close();
                      
      })

    }

}
