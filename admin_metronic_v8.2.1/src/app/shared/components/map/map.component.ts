import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import L from 'leaflet'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent  implements AfterViewInit, OnChanges{
     
  @Input() lat: number = 35.2917;
  @Input() lon: number = -2.2917;
  @Input() map_Id : string = "map-deafault";

  private map: any;

  
  ngAfterViewInit(): void {
        this.initMap()
      }
  
  ngOnChanges(changes: SimpleChanges): void {
       
    if(this.map && (changes['lat'] || changes['lon']))

        this.map.setView([this.lat, this.lon], 13);
      }

  initMap(){
    this.map = L.map(this.map_Id).setView([this.lat, this.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© OpenStreetMap contributors'
        }
    ).addTo(this.map);

    L.marker([this.lat, this.lon]).addTo(this.map);
  }
}
