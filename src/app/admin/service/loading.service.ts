import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _loading = signal<boolean>(false);
  // Exponé solo lectura
  readonly loading = this._loading.asReadonly();

  show()  { this._loading.set(true); }
  hide()  { this._loading.set(false); }
  set(v: boolean) { this._loading.set(v); }
}
