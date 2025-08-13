import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnInit, output, signal, ViewChild } from '@angular/core';
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
export interface UsuarioModalResponse {
  openModal: boolean;
  message?: MessageDialog;
  reload?: boolean;
}

export interface MessageDialog {
  severity: string;
  summary: string;
  detail: string;
}

@Component({
  selector: 'agregar-editar-usuario',
  imports: [ButtonModule, ReactiveFormsModule, ProgressSpinnerModule, SelectModule, ToastModule, FloatLabelModule, InputTextModule, Dialog],
  providers: [MessageService],
  templateUrl: './agregar-editar-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgregarEditarUsuarioComponent implements OnInit{
  public user = input<User | null>();
  readonly closeModal = output<UsuarioModalResponse>();
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
  private initialUserFormValue!: any;

   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.getRoles();
    this.initUserForm();
    this.initPasswordForm();

    this.initialUserFormValue = this.userForm.getRawValue();
  }

  close(response: UsuarioModalResponse) {
    this.closeModal.emit({openModal: response.openModal, message: response.message, reload: response.reload});
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
      this.userForm.get('avatar')?.markAsDirty();
      this.userForm.updateValueAndValidity();

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
    this.sendData(user, this.user()?.id)
  }

  updateUserDialog() {
    this.sendData(this.userForm.value, this.user()?.id)
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

  private sendData(user: any, userId?: number) {
    const formData = new FormData();
    if (user.username) formData.append('username', user.username);
    if (user.first_name) formData.append('first_name', user.first_name);
    if (user.last_name) formData.append('last_name', user.last_name);
    if (user.email) formData.append('email', user.email);
    if (user.avatar instanceof File) formData.append('avatar', user.avatar);
    if (user.password) formData.append('password', user.password);

    if (user.role_id !== undefined && user.role_id !== null) {
      formData.append('role_id', String(user.role_id));
    }

    this.changePasswordDialog.set(false);
    this.loading.set(true);
    if (userId) {
      this.updateUser(formData, userId);
    }else {
      this.addUser(formData)
    }
  }

  private updateUser(formData: any, userId: number) {
    this.userService.updateUsuario(formData, userId)
      .subscribe(resp => {
        this.passwordForm.reset();
        this.loading.set(false);
        this.close({openModal: false, message: { severity: 'success', summary: 'Actializado', detail: 'Usuario actualizado con éxito.' }, reload: true});
      }, (error) => {
        console.error(error);
        this.passwordForm.reset();
        this.loading.set(false);
        this.close({openModal: false, message: { severity: 'error', summary: 'Error', detail: error.status === 400 ? error.error.message : 'Error al actualizar usuario.' }})
      })
  }

   private addUser(user: any) {
    this.userService.addUser(user)
      .subscribe(users => {
        this.loading.set(false);
        this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Usuario agregado con éxito.' });
        this.userForm.reset();
        this.avatarPreview.set(null);
      }, (error) => {
        this.loading.set(false);
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al agregar usuario.' });
        this.userForm.reset();
        this.avatarPreview.set(null);
      })
  }

}
