import { ChangeDetectionStrategy, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ConfirmationService, FilterMatchMode, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { ContactService } from '../../service/contact.service';
import { ContactForm } from '../../../core/ContactForm';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
  selector: 'app-contacto',
  imports: [TableModule, ConfirmPopupModule, ButtonModule, DialogModule, ConfirmDialogModule, CommonModule, ToastModule, InputTextModule, IconFieldModule, SkeletonModule, InputIconModule],
  providers: [ MessageService, ConfirmationService ],
  templateUrl: './contacto.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactoComponent implements OnInit{
  @ViewChild('dt2') dt2!: Table;
  filterMatchMode = FilterMatchMode.CONTAINS;
  public loading = signal<boolean>(false);
  public contactsForm = signal<ContactForm[]>([]);
  public contactSelected = signal<ContactForm | null>(null);
  private messageService = inject(MessageService);
  private contactService = inject(ContactService);
  private confirmationService = inject(ConfirmationService);

  ngOnInit(): void {
    this.getContactsForms();
  }

  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (this.dt2) {
      this.dt2.filterGlobal(inputElement.value, this.filterMatchMode);
    }
  }

  onRowSelect(event: any) {
    this.contactSelected.set(event.data);
  }

  eliminarContact(event: Event) {
      this.confirmationService.confirm({
          target: event.currentTarget as EventTarget,
          message: '¿Estás seguro de borrar el formuario?',
          icon: 'pi pi-info-circle',
          rejectButtonProps: {
              label: 'Cancelar',
              severity: 'secondary',
              outlined: true
          },
          acceptButtonProps: {
              label: 'Borrar',
              severity: 'danger'
          },
          accept: () => {
            this.deleteContactForm(this.contactSelected()?.id!);
            this.contactSelected.set(null);
          },
      });
    }

  getContactsForms() {
    this.loading.set(true);
    this.contactService.getContactForms()
    .subscribe((contactForms) => {
        this.contactsForm.set(contactForms);
        this.loading.set(false);
      },
      (error) => {
        console.error(error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener formularios.',
        });
      }
    );
  }

  deleteContactForm(id: number) {
    this.loading.set(true);
    this.contactService.deleteContactForm(id)
    .subscribe((contactForms) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Formulario eliminado con éxito.',
        });
        this.getContactsForms();
      },
      (error) => {
        console.error(error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al eliminar formularios.',
        });
      }
    );
  }

}
