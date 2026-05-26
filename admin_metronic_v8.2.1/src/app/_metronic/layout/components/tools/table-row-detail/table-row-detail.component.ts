import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: '[app-table-row-detail]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table-row-detail.component.html',
  styleUrls: ['./table-row-detail.component.scss']
})
export class TableRowDetailComponent {

  @Input() section: 'brach' | 'roles' | null = null;

  @Input() data: any = null;

  @Input() colspan : number = 4;

}
