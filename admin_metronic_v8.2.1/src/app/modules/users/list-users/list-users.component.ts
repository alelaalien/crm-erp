import { Component, Injector } from '@angular/core';
import { UserService } from '../service/user.service';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'
import { CreateUserComponent } from '../create-user/create-user.component';
import { DeleteUserComponent } from '../delete-user/delete-user.component';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { BranchService } from '../../configuration/branches/service/branch.service';
import { environment } from 'src/environments/environment';
import { URL_BACKEND } from 'src/app/config/config';
import { RolesServiceService } from '../../roles/service/roles-service.service';
@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent {

  search:string = '';
  USERS:any;
  isLoadingUser$:any;
  isLoadingBrach$:any;
  totalPages: number = 0;
  currentPage:number = 1; 
  pageSize: number = 0; 
 
  userIdExpanded: number | string | null = null;
  expandedRow: { userId: any; section: string } | null = null;
  colspan: number = 7;
  BRANCHES: any;
  ROLES: any;
  URL_STORAGE : string = URL_BACKEND + "storage/users/";
 
  
 
  constructor(
    public modalService: NgbModal,
    public userService: UserService,
    private offcanvasService: NgbOffcanvas,
    private injector: Injector,
    private branchService : BranchService,
    private rolesService : RolesServiceService

  ){

  }
  


  ngOnInit(): void{
    this.isLoadingBrach$ = this.branchService.isLoading$;
    this.listBranches();
    this.isLoadingUser$ = this.userService.isLoadingUser$;
    this.listUsers();
    //this.listRoles();
    
  }
  listUsers(page = 1){
    this.userService.listUsers(page, this.search)

    
    .subscribe((resp:any)=>{
        console.log(resp)
        this.USERS = resp.users ;
        this.pageSize = 25; 
        this.totalPages = Math.ceil(resp.total / this.pageSize); 
        this.currentPage = page;
        
    }
    
    );
  }
    listBranches()  {
      
    this.branchService.listBranches()
                .subscribe( ((resp: any) =>{
                   this.BRANCHES = resp; console.log(resp) 
                  })
  );
    
  }

  listRoles (){
    this.rolesService.listRoles()
                      .subscribe((resp: any)=>{
                        console.log(resp);
                        this.ROLES = resp.roles;
                      });
  }

  openUserCanvas(user: any = null){

    const toOpen = user ? EditUserComponent : CreateUserComponent ; 
    
              const offCanvas = this.offcanvasService.open (toOpen, {
                                    position: "end",
                                    panelClass: 'w-100 w-md-500px bg-white',
                                    injector: this.injector
                              });
                  if (this.BRANCHES && this.BRANCHES.length > 0) {

                    offCanvas.componentInstance.BRANCHES = this.BRANCHES;

                  } else {
                    
                    this.branchService.listBranches().subscribe((resp: any) => {

                      this.BRANCHES = resp; 
                      
                      offCanvas.componentInstance.BRANCHES = this.BRANCHES;
                    });
                  }

                  if (this.ROLES && this.ROLES.length > 0) {

                    offCanvas.componentInstance.ROLES = this.ROLES;

                } else {
                    this.rolesService.listRoles().subscribe((resp: any) => {
                       
                        this.ROLES = resp.roles ? resp.roles : resp; 

                        offCanvas.componentInstance.ROLES = this.ROLES;
                    });
                }
      return offCanvas;
  }
  createUser(){

      const  offCanvas = this.openUserCanvas();             

     
              offCanvas.componentInstance.UserC.subscribe((user:any) =>{
      
              if(user)  this.USERS.unshift(user);
                  
              });
  
  }

  editUsere(user:any){

              const offCanvas = this.openUserCanvas(user);


              offCanvas.componentInstance.USER_SELECTED = user;

              offCanvas.componentInstance.UserE.subscribe((userUpdated:any) =>{ 
                    if(userUpdated){

                      const index = this.USERS.findIndex((u: any)=> u.id ===
                      userUpdated.id);
                      
                      this.USERS[index] = userUpdated;
                    }
                })
  }
  deleteUser(user:any){
 
              const modalRef= this.modalService.open(DeleteUserComponent, {
                centered: true, size: 'md'
              });

              modalRef.componentInstance.USER_SELECTED =user;
              modalRef.componentInstance.UsereD.subscribe((user:any) =>{
            
                    if (user?.id)  {

                        this.USERS = this.USERS.filter((r: any) => r.id != user.id); }
                        
              });

  }


  loadPage($event:any){
                this.listUsers();
                console.log(this.USERS)
  }

 toggleSection(userId: any, section: string, id : number = 0): void {
 
                if (this.expandedRow && this.expandedRow.userId === userId && this.expandedRow.section === section || id === 0) {
                  this.expandedRow = null;
                } else {  this.expandedRow = { userId, section };
                  
                } 
  }

 
  toggleBranch(userId: any): void {
                if (this.userIdExpanded === userId) {
                  this.userIdExpanded = null;
                } else {
                  this.userIdExpanded = userId;
                }
              }

}
