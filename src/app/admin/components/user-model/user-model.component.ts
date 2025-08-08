import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  input,
  OnInit,
  output,
  resource,
  signal,
} from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../../core/User';
import { PasswordModule } from 'primeng/password';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { RoleService } from '../../service/role.service';
import { firstValueFrom } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'user-model',
  imports: [Dialog, ButtonModule, InputTextModule, PasswordModule, SelectModule, ReactiveFormsModule, FileUploadModule],
  templateUrl: './user-model.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
  ::ng-deep .p-password-input {
    width: 100%
  }

  ::ng-deep .p-password {
    width: 100%!important
  }
  `
})
export class UserModelComponent implements OnInit{
  type = input<string>('edit');
  user = input<User | null>();
  dialogVisible = input<boolean>(true);
  closeDialog = output<boolean>();
  updateUser = output<User>();
  public userForm!: FormGroup;
  public urlImage = "http://localhost:3000";
  public changePasswordBtn: boolean = false;
  public imgResultBeforeCompression: any = signal(null);
  public imgResultAfterCompression: any = signal(null);

  private imageCompressService = inject(NgxImageCompressService);
  private cdr = inject(ChangeDetectorRef);

  public roleResource = resource({
    loader: async ({ request }) => {
      return firstValueFrom(this.roleService.getRoles());
    }
  })

  private roleService = inject(RoleService);

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.userForm = new FormGroup({
      first_name: new FormControl( this.user()?.first_name ?? ''),
      last_name: new FormControl( this.user()?.last_name ?? ''),
      email: new FormControl( this.user()?.email ?? '', [Validators.required, Validators.email]),
      username: new FormControl( {value: this.user()?.username ?? '' , disabled: true},  Validators.required),
      password: new FormControl(''),
      avatar: new FormControl( this.user()?.avatar ? this.urlImage + this.user()?.avatar : ''),
      role_id: new FormControl( this.user()?.role?.id ?? '', Validators.required),
    });
  }

  compressFile() {
    this.imageCompressService.uploadFile().then(({ image, orientation }) => {
      this.imgResultBeforeCompression.set(image)
      // console.log('Size in bytes of the uploaded image was:', this.imageCompressService.byteCount(image));
      this.imageCompressService
        .compressFile(image, orientation, 50, 80) // 50% ratio, 80% quality
        .then(compressedImage => {
          this.imgResultAfterCompression.set(compressedImage)
          const file = this.base64ToFile(compressedImage, 'avatar_compressed.jpg')
          // console.log('Size in bytes after compression is now:', this.imageCompressService.byteCount(compressedImage));
          this.userForm.patchValue({
            avatar: file
          })
          this.userForm.markAsDirty();
          this.cdr.detectChanges();
        });
    });
  }

  base64ToFile(base64String: string, fileName: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1]; // Extrae el tipo MIME
    const bstr = atob(arr[1]); // Decodifica base64
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

}
