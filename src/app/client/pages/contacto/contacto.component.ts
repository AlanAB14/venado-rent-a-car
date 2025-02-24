import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { ContactComponent } from "../../components/contact/contact.component";

@Component({
  selector: 'app-contacto',
  imports: [AccordionModule, ContactComponent],
  template: `
  <div class="page-section">
    <div class="container flex flex-col gap-12">
      <div class="flex flex-col text-lato text-5xl text-[#3C5185]">
        <div class="font-bold">Preguntas frecuentes</div>
        <div>sobre alquiler de autos en Venado</div>
      </div>

      <div class="questions">
        <div class="card flex justify-center text-lato">
          <p-accordion value="0">
                <p-accordion-panel value="0">
                    <p-accordion-header>¿Cuánto cuesta alquilar un auto en Venado?</p-accordion-header>
                    <p-accordion-content>
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
                            laborum.
                        </p>
                    </p-accordion-content>
                </p-accordion-panel>

                <p-accordion-panel value="1">
                    <p-accordion-header>¿Cuáles son los vehículos para particulares?</p-accordion-header>
                    <p-accordion-content>
                        <p class="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem
                            aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos
                            qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
                        </p>
                    </p-accordion-content>
                </p-accordion-panel>

                <p-accordion-panel value="2">
                    <p-accordion-header>¿Qué diferencia tiene un vehículo particular con uno corporativo?</p-accordion-header>
                    <p-accordion-content>
                        <p class="m-0">
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p>
                    </p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel value="3">
                    <p-accordion-header>¿Por cuánto tiempo puedo alquilar un vehículo?</p-accordion-header>
                    <p-accordion-content>
                        <p class="m-0">
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p>
                    </p-accordion-content>
                </p-accordion-panel>
                <p-accordion-panel value="4">
                    <p-accordion-header>¿Qué documentación es necesaria a la hora de alquilar?</p-accordion-header>
                    <p-accordion-content>
                        <p class="m-0">
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.
                        </p>
                    </p-accordion-content>
                </p-accordion-panel>
            </p-accordion>
        </div>
      </div>


    <div class="title-box w-full flex flex-col gap-8">
      <div class="title-contact w-fit"><strong>Contactanos</strong></div>
      <div class="subtitle-contact w-fit">Lorem ipsum dolor sit amet, consectetur adipiscing elit,
        sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </div>
        <div class="contact-box w-full flex justify-center">
          <contact class="w-full flex justify-center" />
        </div>
      </div>
  </div>
  `,
  styleUrl: './contacto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactoComponent { }
