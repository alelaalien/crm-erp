import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import L from 'leaflet'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent  implements AfterViewInit, OnChanges{
     
  @Input() lat: number = 35.2917;
  @Input() lon: number = -2.2917;
  @Input() mapId : string = "map-deafault"; 
  @Input() isFloating: boolean = false;  
  @Input() name: string = '';
  @Output() onClose = new EventEmitter<void>();
  private map: any;


  close() { this.onClose.emit(); }


  
  ngAfterViewInit(): void {
        this.initMap()
      }
  
  ngOnChanges(changes: SimpleChanges): void {
       
    if(this.map && (changes['lat'] || changes['lon']))

        this.map.setView([this.lat, this.lon], 13);
      }

  initMap(){
    const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
  const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
  const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';
  
  const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
 
  L.Marker.prototype.options.icon = iconDefault;
    this.map = L.map(this.mapId).setView([this.lat, this.lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© OpenStreetMap contributors'
        }
    ).addTo(this.map);

    L.marker([this.lat, this.lon]).addTo(this.map);
  }
}
