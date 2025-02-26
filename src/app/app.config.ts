import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { MyPreset } from '../myThemePrime';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpRequestInterceptor } from './interceptors/http-request.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';



const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

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
                preset: MyPreset, options: { darkModeSelector: '.app-dark' }
            }
        }),
        provideRouter(routes, inMemoryScrollingFeature),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpRequestInterceptor,
          multi: true
        },
        importProvidersFrom(

          JwtModule.forRoot({
            config: {
              tokenGetter: () => {
                return localStorage.getItem(`tkn_${environment.app}`)
              },
              // allowedDomains: ['localhost:4200'],
            },
          }),
        ),
        provideHttpClient(withInterceptorsFromDi()),
  ]
};
