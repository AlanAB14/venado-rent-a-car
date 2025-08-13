import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AgregarEditarUsuarioComponent } from "../../../components/agregar-editar-usuario/agregar-editar-usuario.component";

@Component({
  selector: 'app-agregar-usuario',
  imports: [AgregarEditarUsuarioComponent],
  templateUrl: './agregar-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AgregarUsuarioComponent { }
