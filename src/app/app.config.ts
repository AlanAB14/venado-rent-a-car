import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { MyPreset } from '../myThemePrime';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
        providePrimeNG({
            translation: {
              accept: 'Aceptar',
              reject: 'Cancelar',
              monthNames: [
                'Enero',
                'Febrero',
                'Marzo',
                'Abril',
                'Mayo',
                'Junio',
                'Julio',
                'Agosto',
                'Septiembre',
                'Octubre',
                'Noviembre',
                'Diciembre'
              ],
              monthNamesShort: [
                'Ene',
                'Feb',
                'Mar',
                'Abr',
                'May',
                'Jun',
                'Jul',
                'Ago',
                'Sep',
                'Oct',
                'Nov',
                'Dic'
              ],
              dayNames: [
                'Domingo',
                'Lunes',
                'Martes',
                'Miercoles',
                'Jueves',
                'Viernes',
                'Sabado'
              ],
              dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
              dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
              emptyFilterMessage: 'No hay resultados',
              emptySearchMessage: 'No hay resultados',
              emptyMessage: 'No hay resultados',
              today: 'Hoy',
              clear: 'Limpiar',
              firstDayOfWeek: 1
            },
            theme: {
                preset: MyPreset,
            }
        }),
    provideRouter(routes)
  ]
};
