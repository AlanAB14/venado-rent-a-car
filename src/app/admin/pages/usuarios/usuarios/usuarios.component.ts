import { ChangeDetectionStrategy, Component, inject, resource, signal, ViewChild, effect } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MultiSelectModule } from 'primeng/multiselect';
import { FilterMatchMode, MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { UsuariosService } from '../../../service/usuarios.service';
import { SkeletonModule } from 'primeng/skeleton';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User } from '../../../../core/User';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { AgregarEditarUsuarioComponent } from "../../../components/agregar-editar-usuario/agregar-editar-usuario.component";
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-usuarios',
  imports: [TableModule, ReactiveFormsModule, DialogModule, TooltipModule, ButtonModule, ToastModule, IconFieldModule, InputIconModule, SelectModule, TagModule, MultiSelectModule, InputTextModule, SkeletonModule, AgregarEditarUsuarioComponent],
  providers: [MessageService],
  templateUrl: './usuarios.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    ::ng-deep .p-dialog-header {
      padding: 1.25rem 0 0 0!important;
    }
  `]
})
export default class UsuariosComponent {
  @ViewChild('dt2') dt2!: Table;
  filterMatchMode = FilterMatchMode.CONTAINS;
  public urlImage = environment.api;
  public users = signal<User[] | null>(null);
  public userSelected = signal<User | null>(null);
  public editarUsuarioDialog = signal<boolean>(false);

  private usersService = inject(UsuariosService);
  private messageService = inject(MessageService);

  loading = signal<boolean>(false);

  activityValues: number[] = [0, 100];


  ngOnInit() {
    this.getUsers();
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, this.filterMatchMode);
    }
  }

  clear(table: Table) {
    table.clear();
  }

  modalEmit(event: boolean) {
    this.editarUsuarioDialog.set(event);
  }

  openUserModal(user: User) {
    this.userSelected.set(user);
    this.editarUsuarioDialog.set(true);
  }

  private getUsers() {
    this.loading.set(true);
    this.usersService.getUsuarios()
      .subscribe(users => {
        console.log(users)
        this.users.set(users);
        this.loading.set(false);
      }, (error) => {
        this.loading.set(false);
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer usuarios' });
      })
  }

}
