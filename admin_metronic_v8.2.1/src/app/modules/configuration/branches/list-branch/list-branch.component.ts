import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap'; 
import { BranchService } from 'src/app/core/services/branch.service';
import { EditBranchComponent } from '../edit-branch/edit-branch.component';
import { CreateBranchComponent } from '../create-branch/create-branch.component';
import { DeleteBranchComponent } from '../delete-branch/delete-branch.component';
import { BranchImageDto } from 'src/app/dtos/branch-image.dto';

@Component({
  selector: 'app-list-branch',
  templateUrl: './list-branch.component.html',
  styleUrls: ['./list-branch.component.scss']
})
export class ListBranchComponent implements OnInit{

  search:string = '';
  BRANCHES:any;
  mainImage: BranchImageDto;
  isLoadingBranches$:any; 
  totalPages: number = 0;
  currentPage:number = 1; 
  pageSize: number = 0; 
  activeMapData: { lat: number, lon: number, id: string, name: string } | null = null;
  branchIdExpanded: number | string | null = null;
  expandedRow: { branchId: any; section: string } | null = null;
  colspan: number = 7; 
  
  
  constructor(
  
        private offcanvasService: NgbOffcanvas,
        private injector: Injector,
        private branchService : BranchService,
        private modalService : NgbModal,
        private changeDetectorRef : ChangeDetectorRef
      )
  {}
  ngOnInit(): void {
    this.isLoadingBranches$ = this.branchService.isLoading$;
    this.listBranches();
  
  }
    closeItem(item: any)
  {
    item = null;
  }
 

toggleMap(branch: any) {
 console.log(branch)
 
  this.BRANCHES.forEach((b:any) => {
    if (b.id !== branch.id) b.showMap = false;
  });

 
  branch.showMap = !branch.showMap;
}
  
  listBranches(page = 1){
    this.branchService.listBranches() 
    .subscribe((resp:any)=>{
       console.log(resp.branches)
        this.BRANCHES = resp.branches;
        this.pageSize = 25; 
        this.totalPages = Math.ceil(resp.total / this.pageSize); 
        this.currentPage = page;
        
    }
    
    );
  }

  createBranch(){
    const offCanvas = this.openBranchesCanvas();
     
    offCanvas.componentInstance.BranchC.subscribe(
      (branch: any) =>{
        if(branch) this.BRANCHES.unshift(branch);
      }
    )
  }

  editBranch(branch: any)
  {
    const offCanvas = this.openBranchesCanvas(branch);
    offCanvas.componentInstance.BranchE.subscribe(
      (branchUpdated : any) =>{
        if (branchUpdated){
          const index = this.BRANCHES.findIndex(
            (branch_: any) => branch_.id ===branchUpdated.id
          );

          this.BRANCHES[index] = branchUpdated;
        }
      }
    )
  }
 
  deleteBranch(branch:any){
 console.log(branch)
              const modalRef= this.modalService.open(DeleteBranchComponent, {
                centered: true, size: 'md'
              });

              modalRef.componentInstance.BRANCH_SELECTED =branch;
              modalRef.componentInstance.BranchD.subscribe((resp:any) =>{
           
                    if (resp?.brach_id)  { 
console.log(resp)
                        this.BRANCHES = this.BRANCHES.filter((r: any) => r.id != resp.brach_id); 

                        this.changeDetectorRef.markForCheck();
                      
                      }
                        
              });

  }
  //////////////////////////
getMainImageUrl(branch: any): string {
  // Buscamos la imagen que sea principal
  const mainImage = branch.images.find((img: any) => img.is_main == 1 || img.is_main === true);
  
  // Si existe, devolvemos su URL, sino la imagen por defecto
  return mainImage ? mainImage.url : 'assets/media/avatars/blank.png';
}
  openBranchesCanvas(branch : any = null)
  {
    const toOpen = branch ? EditBranchComponent : CreateBranchComponent;
     const offCanvas = this.offcanvasService.open(toOpen,{
      position: "end",
      panelClass: 'w-100 bg-white',
      injector: this.injector

    });

    return offCanvas; 
  }

  toggleSection(branchId: any, section: string, id: number = 0)
  {
    if(this.expandedRow 
      && this.expandedRow.branchId === branchId 
      && this.expandedRow.section === section 
      || id === 0)   this.expandedRow = null;
       else  
        this.expandedRow = { branchId, section };
                        
  }
    toggleBranch(branchId: any): void 
    {
      if (this.branchIdExpanded === branchId) {
        this.branchIdExpanded = null;
      } else {
        this.branchIdExpanded = branchId;
      }
    }

      loadPage($event:any){
                this.listBranches(); 
  }
  openMap(branch: any) {
     this.activeMapData = {
        lat: branch.latitude,
        lon: branch.longitude,
        id: 'map-' + branch.id,
        name: branch.name
    };
}
closeMap() {
   
    this.activeMapData = null;
}
}
