import {
  ChangeDetectionStrategy,
  Component,
  model,
  OnInit,
} from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-servicio',
  imports: [GalleriaModule],
  templateUrl: './servicio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .upper-title {
        font-family: Archivo;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
      ::ng-deep .p-galleria-nav-button {
        background: #6f6d717c !important;
      }

      ::ng-deep .p-galleria-thumbnails-content {
        background-color: rgb(240, 240, 240) !important;
      }

      ::ng-deep .p-galleria-thumbnail img {
        justify-self: center;
      }

      ::ng-deep .p-galleria {
        border: unset!important;
      }

      ::ng-deep .p-galleria-thumbnails-content {
        padding: 0.25rem!important;
      }
    `,
  ],
})
export default class ServicioComponent implements OnInit {
  // date_start: Date;
  // date_end: Date;
  // total_price: number;
  // name: string;
  // email: string;
  // phone: string;
  // observation: string;

  images: any = model([]);

  responsiveOptions: any[] = [
    {
      breakpoint: '991px',
      numVisible: 3,
    },
    {
      breakpoint: '767px',
      numVisible: 2,
    },
    {
      breakpoint: '575px',
      numVisible: 1,
    },
  ];

  ngOnInit() {
    this.images.set([
      {
        itemImageSrc: 'assets/images/nissan.png',
        thumbnailImageSrc: 'assets/images/nissan.png',
        alt: 'Description for Image 1',
        title: 'Title 1',
      },
      {
        itemImageSrc: 'assets/images/nissan.png',
        thumbnailImageSrc: 'assets/images/nissan.png',
        alt: 'Description for Image 1',
        title: 'Title 1',
      },
      {
        itemImageSrc: 'assets/images/nissan.png',
        thumbnailImageSrc: 'assets/images/nissan.png',
        alt: 'Description for Image 1',
        title: 'Title 1',
      },
      {
        itemImageSrc: 'assets/images/hilux.png',
        thumbnailImageSrc: 'assets/images/hilux.png',
        alt: 'Description for Image 2',
        title: 'Title 2',
      },
    ]);
  }
}
