import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { BranchService } from 'src/app/core/services/branch.service';
import { BranchImageDto } from 'src/app/dtos/branch-image.dto';
import { BranchDto } from 'src/app/dtos/branch.dto';
import { PhoneDto } from 'src/app/dtos/phone.dto';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.scss']
})
export class CreateBranchComponent implements OnInit {


      @Output() BranchC : EventEmitter<any> = new EventEmitter();
      files : BranchImageDto[]= []; 
      branch: BranchDto; 
      name: string;
      address: string; 
      latitude : number;
      longitude : number;
      phone: PhoneDto = {type: "Mobile", number: ""}
      phones : PhoneDto[] = [];
      isExpanded: boolean = true;


      constructor(
        private service : BranchService,
       private offCanvas:  NgbActiveOffcanvas,
        private cdr: ChangeDetectorRef
      ) { }

  ngOnInit(): void {
  // this.toggleExpand();
  }
      get mainImage() {
  return this.files.find(img => img.isMain) || this.files[0] || null;
}
      
      removePhone(phone: PhoneDto)
      { 

        this.phones = this.phones.filter(p => p!== phone ); 
      }

      addPhoneToList()
      {
        if(this.phone.number.trim() !== "") 
        { 
          this.phones.push({...this.phone});

          this.phone = {type: "Mobile", number: ""}
        } 
      }
      saveBranch()
      { 
        let data = new FormData();
        data.append("name" , this.name);
        data.append("address" , this.address);
        data.append("latitude" , this.latitude ? this.latitude.toString() : "0");
        data.append("logitude" , this.longitude ? this.longitude.toString() : "0");
        if(this.phones.length>0) data.append("phones" , JSON.stringify(this.phones));


        this.files.forEach((file : BranchImageDto, index: number) => {
          
            data.append('images[]', file.file);
            data.append(`isMain[${index}]`, file.isMain.toString());
        });
        
         this.service.create(data).subscribe((r:any)=>{
             this.BranchC.emit(r.branch);
             console.log(r)
             this.offCanvas.dismiss();
        })
      }
      dismissPanel()
      {

      } 

      processImages(event: any) { 
 
        const target = event.target as HTMLInputElement;
        if (target.files && target.files.length > 0) {
          const newFiles = Array.from(target.files);
          
          newFiles.forEach(file => {
          
            const reader = new FileReader();
            reader.onload = (e: any) => {

              this.files.push(
                {
                    preview : e.target.result,
                    file : file,
                    isMain: this.files.length === 0
                }
              );
              this.cdr.detectChanges();
            };
            reader.readAsDataURL(file); 
          }
          );
        }
       
      }
      removeImage(index: number) {
        // this.files.splice(index, 1);  
        const wasMain = this.files[index].isMain;
        this.files = this.files.filter((_, i) =>  i !== index);
          if(wasMain&& this.files.length> 0) 
            this.files[0].isMain = true;

          this.cdr.detectChanges();
      }

      setMain(index: number) {
          this.files.forEach((img, i) => img.isMain = (i === index));
      }

 

}
