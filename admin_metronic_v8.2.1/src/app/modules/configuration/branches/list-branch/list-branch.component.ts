import { Component, Injector, OnInit } from '@angular/core';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { URL_BACKEND } from 'src/app/config/config';
import { BranchService } from 'src/app/core/services/branch.service';
import { EditBranchComponent } from '../edit-branch/edit-branch.component';
import { CreateBranchComponent } from '../create-branch/create-branch.component';
import { DeleteBranchComponent } from '../delete-branch/delete-branch.component';

@Component({
  selector: 'app-list-branch',
  templateUrl: './list-branch.component.html',
  styleUrls: ['./list-branch.component.scss']
})
export class ListBranchComponent implements OnInit{

  search:string = '';
  BRANCHES:any;
  isLoadingBranches$:any; 
  totalPages: number = 0;
  currentPage:number = 1; 
  pageSize: number = 0; 
 
  branchIdExpanded: number | string | null = null;
  expandedRow: { branchId: any; section: string } | null = null;
  colspan: number = 7; 
  ROLES: any;
  URL_STORAGE : string = URL_BACKEND + "storage/branchs/";
  
  constructor(
  
        private offcanvasService: NgbOffcanvas,
        private injector: Injector,
        private branchService : BranchService,
        private modalService : NgbModal
      )
  {}
  ngOnInit(): void {
    this.isLoadingBranches$ = this.branchService.isLoading$;
    this.listBranches();
  }

  
  listBranches(page = 1){
    this.branchService.listBranches() 
    .subscribe((resp:any)=>{
       
        this.BRANCHES = resp.branches.data ;
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
  deleteBranch(branch: any){
 
      const modalRef = this.modalService.open(DeleteBranchComponent,
        {
          centered : true,
          size: 'md'
        }

      );

      modalRef.componentInstance.BRANC_SELECTED = branch;
      modalRef.componentInstance.BranchD.subscribe(
        (branch: any)=>{
          if(branch?.id) 

            this.BRANCHES = this.BRANCHES.filter(
              (b: any) => b.id != branch.id
            );
        }
      )
  }

  //////////////////////////

  openBranchesCanvas(branch : any = null)
  {
    const toOpen = branch ? EditBranchComponent : CreateBranchComponent;

    const offCanvas = this.offcanvasService.open(toOpen,{
      position: "end",
      panelClass: 'w-100 w-md-500px bg-white',
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
                console.log(this.BRANCHES)
  }

}
