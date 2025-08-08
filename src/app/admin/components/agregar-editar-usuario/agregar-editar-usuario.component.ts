import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { RoleService } from '../../service/role.service';
import { Role, User } from '../../../core/User';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectModule } from 'primeng/select';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { Dialog } from "primeng/dialog";
import { UsuariosService } from '../../service/usuarios.service';

@Component({
  selector: 'agregar-editar-usuario',
  imports: [ButtonModule, ReactiveFormsModule, ProgressSpinnerModule, SelectModule, ToastModule, FloatLabelModule, InputTextModule, Dialog],
  providers: [MessageService],
  templateUrl: './agregar-editar-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregarEditarUsuarioComponent implements OnInit{
  public user = input<User | null>();
  readonly closeModal = output<boolean>();
  public roles = signal<Role[]>([]);
  public loading = signal<boolean>(false);
  public userForm!: FormGroup;
  public passwordForm!: FormGroup;
  public avatarPreview = signal<string | null>(null);
  public serverUrl = environment.api;
  public changePasswordDialog = signal<boolean>(false);

  private roleService = inject(RoleService);
  private userService = inject(UsuariosService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.getRoles();
    this.initUserForm();
    this.initPasswordForm();
  }

  close() {
    this.closeModal.emit(false);
  }

  getRoles() {
    this.loading.set(true);
    this.roleService.getRoles()
      .subscribe(roles => {
        this.roles.set(roles);
        this.loading.set(false);
      }, (error) => {
        console.error(error);
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer roles' });
      })
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.userForm.patchValue({ avatar: file });

      // vista previa
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview.set(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  changePassword() {
    let user = {
      password: this.passwordForm.get('password')!.value
    }
    this.updateUser(user, this.user()?.id!)
  }

  updateUserDialog() {
    this.updateUser(this.userForm.value, this.user()?.id!)
    this.closeModal.emit(true);
  }

  private initUserForm() {
    const controls: Record<string, FormControl> = {
      first_name: new FormControl(this.user() ? this.user()?.first_name : ''),
      last_name: new FormControl(this.user() ? this.user()?.last_name : ''),
      username: new FormControl(this.user() ? this.user()?.username : '', [Validators.required]),
      email: new FormControl(this.user() ? this.user()?.email : '', [Validators.required, Validators.email]),
      avatar: new FormControl(this.user() ? this.user()?.avatar : ''),
      role_id: new FormControl(this.user() ? this.user()?.role.id : 0, [Validators.required]),
    }

    if (!this.user()) {
      controls['password'] = new FormControl('', [Validators.required]);
    }

    this.userForm = new FormGroup(controls);

    if (this.user()?.avatar) {
      this.avatarPreview.set(`${this.serverUrl + this.user()?.avatar!}`);
    }
  }

  private initPasswordForm() {
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required)
    });
  }

  private updateUser(user: any, userId: number) {
    const formData = new FormData();
    if (user.username) {
      formData.append('username', user.username);
    }
    if (user.first_name) {
      formData.append('first_name', user.first_name);
    }
    if (user.last_name) {
      formData.append('last_name', user.first_name);
    }
    if (user.email) {
      formData.append('email', user.email);
    }
    if (user.avatar) {
      formData.append('avatar', user.avatar);
    }
    if (user.password) {
      formData.append('password', user.password);
    }
    if (user.role) {
      formData.append('role_id', user.role.id.toString());
    }

    this.changePasswordDialog.set(false);
    this.loading.set(true);
    this.userService.updateUsuario(formData, userId)
      .subscribe(resp => {
        this.passwordForm.reset();
        this.loading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Actializado', detail: 'Usuario actualizado con éxito.' });
      }, (error) => {
        console.error(error);
        this.passwordForm.reset();
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al actualizar usuario.' });
      })
  }
}
