import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserService } from '../service/user.service';
import { ToastrService } from 'ngx-toastr';
import {   NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BranchService } from '../../configuration/branches/service/branch.service';
import { map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { URL_BACKEND } from 'src/app/config/config';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  providers: [DatePipe]
})
export class CreateUserComponent implements OnInit{

    @Output() UserC : EventEmitter<any> = new EventEmitter();
    @Input() BRANCHES: any[] = [];
    @Input() ROLES: any[] = [];

 
        isLoading$: any; 
 
        image_previsualizar: string = 'user.png';  
        file_avatar: any = null; 
        name: string = '';
        last_name: string = '';
        doc_type: string = '';
        doc_number: string = '';
        email: string = '';
        phone: string = '';
        password: string = '12345678';  
        branch_id: string = '';
        address: string = '';
        gender: string = 'N'; 
        emailPattern  = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        selectedRoles : any[] = [];
 

    constructor(
      private userService: UserService,
      private toastr: ToastrService,
      private offCanvas:  NgbActiveOffcanvas, 
      private datePipe: DatePipe,
      
    ){
     
    }



    createUser(){

      let data = {
            name: this.name,
            last_name: this.last_name,
            doc_type: this.doc_type,
            doc_number: this.doc_number,
            email: this.email,
            phone: this.phone,
            password: this.password,
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

      let form = new FormData();
            form.append("name", this.name);
            form.append("last_name", this.last_name);
            form.append("doc_type", this.doc_type);
            form.append("doc_number", this.doc_number);
            form.append("email", this.email);
            form.append("phone", this.phone ? this.phone : "");
            form.append("password", this.password);
            form.append("branch_id", this.branch_id);
            form.append("address", this.address);
            form.append("gender", this.gender);
            form.append("image", this.file_avatar); 
            form.append("roles", JSON.stringify(this.selectedRoles));

 
      this.userService.registerUser(form).subscribe({ 
        next:(resp:any) =>  { 
   
              resp.user.updated_at = this.datePipe.transform(resp.user.created_at, 'dd-MM-yyyy hh:mm a');
                    
              this.UserC.emit(resp.user);
              this.offCanvas.dismiss();
            
      },
      error: (err:any) =>{
        console.log(err.error)
        this.toastr.error('Error!', err.error.message ); 
      }  
    })

    }

    processAvatar(event:any){

      if(event.target.files && event.target.files[0]){
        this.file_avatar = event.target.files[0];

        const reader = new FileReader();
        reader.onload = (e: any)=>{
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
    ngOnInit(): void{
 
       
    }
}
