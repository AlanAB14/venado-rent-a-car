import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { VehicleCardComponent } from "../../components/vehicle-card/vehicle-card.component";
import { SearchBoxComponent } from "../../components/search-box/search-box.component";
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Vehicle } from '../../../core/Vehicle';
import { VehiculoService } from '../../../admin/service/vehiculo.service';
import { LoadingService } from '../../../admin/service/loading.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-flota',
  imports: [VehicleCardComponent, CommonModule, ToastModule, ConfirmDialogModule, SearchBoxComponent, RouterModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './flota.component.html',
  styleUrl: './flota.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FlotaComponent implements OnInit{
  public vehiclesTotal = signal<Vehicle[] | null>(null);
  public vehiclesShow = signal<Vehicle[] | null>(null);
  public initialFilters = signal<{ type?: string; name?: string } | null>(null);
  private vehicleService = inject(VehiculoService);
  private loadService = inject(LoadingService);
  private messageService = inject(MessageService);
  private route          = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private readonly LS_FAVS = 'favorites';
  public favoriteIds = signal<Set<number>>(new Set<number>());
  public isFavorite = (id: number) => this.favoriteIds().has(id);

  ngOnInit(): void {
    this.favoriteIds.set(this.readFavorites());
    this.listenStorage();

    this.loadService.show();

    const vehiculos$ = this.vehicleService.getVehiculos();
    const params$ = this.route.queryParams;

    combineLatest([vehiculos$, params$]).subscribe({
      next: ([vehiculos, params]) => {
        this.vehiclesTotal.set(vehiculos);

        const vehicle_type = params['vehicle_type'] as string | undefined;
        const name = params['name'] as string | undefined;

        if (vehicle_type || name) {
          const filters = { vehicle_type, name };
          this.initialFilters.set(filters);
          this.applyFilters({ vehicle_type, name });
        } else {
          this.vehiclesShow.set(vehiculos);
        }

        this.loadService.hide();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer vehículos.' });
        this.loadService.hide();
      }
    });
  }

  onToggleFavorite(id: number) {
    const next = new Set(this.favoriteIds());
    next.has(id) ? next.delete(id) : next.add(id);
    this.favoriteIds.set(next);
    this.writeFavorites(next);
  }

  applyFilters(filters: { vehicle_type?: string; name?: string }) {
    const list = this.vehiclesTotal() ?? [];
    const filtered = list.filter(vehicle => {
      let ok = true;

      if (filters.vehicle_type && filters.vehicle_type !== 'todos') {
        if (filters.vehicle_type === 'favoritos') {
          ok = ok && this.favoriteIds().has(vehicle.id); // 👈 filtra por favoritos
        } else {
          ok = ok &&
            Array.isArray(vehicle.vehicle_type) &&
            vehicle.vehicle_type.some(vt => vt?.type?.toLowerCase() === filters.vehicle_type!.toLowerCase());
        }
      }
      if (filters.name) {
        ok = ok && vehicle.name?.toLowerCase().includes(filters.name.toLowerCase());
      }
      return ok;
    });

    this.vehiclesShow.set(filtered);
  }


  private readFavorites(): Set<number> {
    try {
      const raw = localStorage.getItem(this.LS_FAVS);
      const arr = raw ? JSON.parse(raw) as number[] : [];
      return new Set(arr.filter(n => Number.isFinite(n)));
    } catch { return new Set<number>(); }
  }
  private writeFavorites(set: Set<number>) {
    try { localStorage.setItem(this.LS_FAVS, JSON.stringify([...set])); } catch {}
  }

  private listenStorage() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.LS_FAVS) this.favoriteIds.set(this.readFavorites());
    });
  }

  private getVehicles() {
    this.loadService.show();
    this.vehicleService.getVehiculos().subscribe({
      next: (vehiculos) => {
        this.vehiclesTotal.set(vehiculos);

        // leer una vez params al terminar el fetch
        const { type, name } = this.route.snapshot.queryParams as { type?: string; name?: string };
        if (type || name) {
          const filters = { type, name };
          this.initialFilters.set(filters);   // 👉 se los pasamos al SearchBox
          this.applyFilters(filters);         // 👉 filtramos la grilla
        } else {
          this.vehiclesShow.set(vehiculos);
          this.initialFilters.set(null);
        }

        this.loadService.hide();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al traer vehículos.' });
        this.loadService.hide();
      }
    });
  }

}
