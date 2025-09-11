import {
  ChangeDetectionStrategy,
  Component,
  effect,
  Input,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  FileRemoveEvent,
  FileSelectEvent,
  FileUpload,
} from 'primeng/fileupload';
import { Message } from 'primeng/message';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'imagenes-vehiculo',
  imports: [FileUpload, ReactiveFormsModule],
  templateUrl: './imagenes-vehiculo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImagenesVehiculoComponent implements OnInit{
  public imagenesForm = input<FormGroup>();
  public uploadedFiles = input<File[]>([]);
  public uploadedFilesChange = output<File[]>();
  public baseUrl = environment.api;
  private _files: File[] = [];

  constructor() {
    effect(() => {
      const urls = this.imagenesForm()?.get('images')?.value ?? [];
      const base = this.baseUrl ?? '';
      if (urls.length) this.preloadFromUrls(urls.map((u: any) => (base ? base + u : u)));
    });
  }

  ngOnInit(): void {
    console.log(this.imagenesForm()?.value, this.uploadedFiles());
  }

  onSelect(ev: FileSelectEvent) {
    const incoming = ev.files ?? [];
    const merged = [...this._files];
    for (const f of incoming) {
      if (!merged.some((x) => this.sameFile(x, f))) merged.push(f);
    }
    this._files = merged;
    this.uploadedFilesChange.emit(this._files.slice());
  }

  onRemove(ev: FileRemoveEvent) {
    const rem = ev.file as File;
    this._files = this._files.filter((f) => !this.sameFile(f, rem));
    this.uploadedFilesChange.emit(this._files.slice());
  }

  onClear() {
    this._files = [];
    this.uploadedFilesChange.emit([]);
  }

  private async preloadFromUrls(urls: string[]) {
    const newFiles: File[] = [];
    for (const url of urls) {
      try {
        const res = await fetch(url, { mode: 'cors' }); // requiere CORS permitido en tu server
        if (!res.ok) continue;
        const blob = await res.blob();

        const name = this.fileNameFromUrl(url);
        const file = new File([blob], name, { type: blob.type, lastModified: Date.now() });

        if (!this._files.some(f => this.sameFile(f, file))) {
          this._files.push(file);
          newFiles.push(file);
          this.uploadedFiles().push(file);
        }
      } catch {
        console.log('Error al preloadImagen')
      }
    }

    if (newFiles.length) {
      this.uploadedFilesChange.emit(this._files.slice());
    }
  }

  private fileNameFromUrl(url: string): string {
    try {
      const u = new URL(url, window.location.origin);
      const last = u.pathname.split('/').filter(Boolean).pop() ?? 'image';
      return decodeURIComponent(last);
    } catch {
      const parts = url.split('?')[0].split('/');
      return parts[parts.length - 1] || 'image';
    }
  }

  private sameFile(
    a: { name: string; size: number; lastModified?: number },
    b: { name?: string; size?: number; lastModified?: number }
  ): boolean {
    return (
      !!b &&
      a.name === b.name &&
      a.size === (b.size ?? -1) &&
      (a.lastModified ?? -1) === (b.lastModified ?? -2)
    );
  }

}
