import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr'; 
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html', 
  styleUrls: ['./edit-user.component.scss'],
  providers: [DatePipe]
})
export class EditUserComponent {

  @Output() UserE : EventEmitter<any> = new EventEmitter();
  @Input()  USER_SELECTED  : any; 
  @Input() ROLES: any[] = [];
  @Input() BRANCHES: any[] = [];

        isLoading$: any;  
        id:string = "";
        image_previsualizar: string = '';  
        file_avatar: any = null; 
        name: string = '';
        last_name: string = '';
        doc_type: string = '';
        doc_number: string = '';
        email: string = '';
        phone: string = ''; 
        branch_id: string = '';
        address: string = '';
        gender: string = 'N'; 
        emailPattern  = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        selectedRoles : any[] = [];
        



  constructor(
    private userService : UserService,
    private toastr : ToastrService,
    private offCanvas:  NgbActiveOffcanvas, 
    private datePipe: DatePipe,

 
  ){

  }
 
processAvatar(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.file_avatar = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image_previsualizar = e.target.result;
      };
      reader.readAsDataURL(this.file_avatar);
    }  
  }
    dismissPanel(){
      this.offCanvas.dismiss();
    }

    isRoleSelected(roleName: any): boolean {

      return this.selectedRoles.includes(roleName);

    }

    toggleRole(roleName: any): void{
      const index = this.selectedRoles.indexOf(roleName);
      if(index > -1) this.selectedRoles.splice(index, 1);
      else this.selectedRoles.push(roleName);

      console.log(this.selectedRoles);
    }
  ngOnInit() : void {
   
    
    Object.assign(this, this.USER_SELECTED);
    const avatar = this.USER_SELECTED.avatar ?? 'user.png';
    this.image_previsualizar = URL_BACKEND + "storage/users/" +  avatar;
    if (this.USER_SELECTED.roles) {
     
        this.selectedRoles = this.USER_SELECTED.roles.map((rol: any) => rol.id);
      }
    if(this.USER_SELECTED.branch) this.branch_id = this.USER_SELECTED.branch.id; 
  
}
 
editUser(){

      let data = {
            name: this.name,
            last_name: this.last_name,
            doc_type: this.doc_type,
            doc_number: this.doc_number,
            email: this.email,
            phone: this.phone,
           
            branch_id: this.branch_id,
            address: this.address,
            gender: this.gender,
            avatar: this.file_avatar  
          };
 
      const rules = [

        {test : !data.name.trim(), msg: 'Please enter an user name.' },
        {test : !data.last_name.trim(), msg: 'Please enter a last name'},
        {test : !data.email.trim(), msg: 'Please enter an email'},
        {test : !this.emailPattern.test(data.email.trim()), msg: 'Please enter a valid email address'}, 
        {test : !data.doc_type, msg: 'Please select a document type'},
        {test : !data.doc_number.trim(), msg: 'Please enter a document number'} 

      ];
        const error = rules.find(rule => rule.test);

      if(error) {
              this.toastr.error('Error!', error.msg  );

              return;
      }

      const formData = new FormData();
            formData.append("name", this.name);
            formData.append("id", this.USER_SELECTED.id);
            formData.append("_method", "PUT");

            formData.append("last_name", this.last_name);
            formData.append("doc_type", this.doc_type);
            formData.append("doc_number", this.doc_number);
            formData.append("email", this.email);
            formData.append("phone", this.phone ? this.phone : "");
            formData.append("branch_id", this.branch_id);
            formData.append("address", this.address);
            formData.append("gender", this.gender);
            formData.append("image", this.file_avatar); 
            formData.append("roles", JSON.stringify(this.selectedRoles));

   
      this.userService.updateUser(formData).subscribe({ 
        next:(resp:any) =>  { 

              resp.user.updated_at = this.datePipe.transform(resp.user.updated_at, 'dd-MM-yyyy hh:mm a');
              this.UserE.emit(resp.user);
              this.offCanvas.dismiss();
            
      },
      error: (err:any) =>{
        console.log(err.error)
        this.toastr.error('Error!', err.error.message ); 
      }  
    }) 

    }
 }
