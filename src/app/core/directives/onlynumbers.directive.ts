import { Directive, ElementRef, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[onlyNumbers]',
  standalone: true
})
export class OnlyNumbersDirective {
  private el = inject<ElementRef<HTMLInputElement>>(ElementRef);
  // NgControl es opcional: estará si el input usa formControl / ngModel
  private ngControl = inject(NgControl, { optional: true });

  @HostListener('input')
  onInput() {
    const input = this.el.nativeElement;
    const cleaned = input.value.replace(/\D/g, '');

    // si no hubo cambios, no hagas nada
    if (cleaned === input.value) return;

    // preservá la posición del caret si querés (opcional)
    const start = input.selectionStart ?? cleaned.length;

    // 1) actualizá el DOM
    input.value = cleaned;

    // 2) sincronizá el form control SIN emitir eventos (evita loops)
    this.ngControl?.control?.setValue(cleaned, { emitEvent: false });

    // 3) restaurá el caret (opcional)
    try {
      input.setSelectionRange(start, start);
    } catch {}
  }
}
