import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRolesComponent } from '../create-roles/create-roles.component';
import { RolesServiceService } from 'src/app/core/services/roles-service.service';  
import { EditRolesComponent } from '../edit-roles/edit-roles.component';
import { DeleteRolesComponent } from '../delete-roles/delete-roles.component';

@Component({
  selector: 'app-list-roles',
  templateUrl: './list-roles.component.html',
  styleUrls: ['./list-roles.component.scss']
})
export class ListRolesComponent {


  search:string = '';
  ROLES:any;
  isLoading$:any;
  totalPages: number = 0;
  currentPage:number = 1; 
  pageSize: number = 0;
 
  constructor(
    private modalService: NgbModal,
    private rolesService: RolesServiceService,
    private changeDetectorRef: ChangeDetectorRef

  ){

  }

  ngOnInit(): void{

    this.isLoading$ = this.rolesService.isLoading$;
    this.listRoles();
  }
  listRoles(page = 1){
    this.rolesService.listRoles(page, this.search)
    .subscribe((resp:any)=>{
   
        this.ROLES = resp.roles ;
        this.pageSize = 25; 
        this.totalPages = Math.ceil(resp.total / this.pageSize); 
        this.currentPage = page;
        
    }
    
    );
  }
  createRol(){
    const modalRef = this.modalService.open(CreateRolesComponent, {
      centered:true, size: 'md'
    });

    modalRef.componentInstance.RoleC.subscribe((role:any) =>{
    
      if(role) this.ROLES = [role, ...this.ROLES];
      this.changeDetectorRef.markForCheck();
    
       });
  }
  deleteRole(role:any){
 
    const modalRef= this.modalService.open(DeleteRolesComponent, {
      centered: true, size: 'md'
    });

    modalRef.componentInstance.ROLE_SELECTED =role;
    modalRef.componentInstance.RoleD.subscribe((role:any) =>{
  
          if (role?.id)  {

              this.ROLES = this.ROLES.filter((r: any) => r.id != role.id); }
              
    });

  }
  editRole(role:any){

    const modalRef = this.modalService.open(EditRolesComponent, {
      centered:true, size: 'md'
    });

    modalRef.componentInstance.ROLE_SELECTED = role;
    modalRef.componentInstance.RoleE.subscribe((role:any) =>{
       
      //if(role) this.ROLES.unshift(role);
    
       })
  }

  loadPage($event:any){
    this.listRoles();
  }
}
