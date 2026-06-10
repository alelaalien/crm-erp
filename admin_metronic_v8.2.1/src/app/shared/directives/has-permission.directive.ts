import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { AuthService } from 'src/app/modules/auth';


@Directive({
  selector: '[appCan]'
})
export class HasPermissionDirective implements OnInit{

  @Input('appCan') permission: string | string[];
  @Input ('appCanMode') mode: 'any' | 'all' = 'all';
 
  constructor(
    private authService : AuthService,
    private templateRef: TemplateRef <any>,
    private viewContainer : ViewContainerRef,
    
  ) { }
  ngOnInit(): void {
     
    let hasAccess = false;
 
    const isAdmin = this.authService.isSuperAdmin();
  
    if(isAdmin) hasAccess = true;

    if( typeof this.permission === 'string') 

        hasAccess = this.authService.hasPermission(this.permission);
    
    else {

        hasAccess = this.mode === 'all' ?
                    this.authService.hasAllPermissions(this.permission) :
                    this.authService.hasAnyPermission(this.permission);
    }

    if(hasAccess) this.viewContainer.createEmbeddedView(this.templateRef);
    else this.viewContainer.clear();


/*  console.group('🔍 Depuración de permisos'); 
console.log('Verificando permiso:', this.permission);
  console.log('¿Es SuperAdmin?:', this.authService.isSuperAdmin());
  console.log('¿Tiene permiso individual?:', this.authService.hasPermission(this.permission as string)); */
  
  }

}
