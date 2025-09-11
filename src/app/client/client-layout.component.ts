import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { LoadingService } from '../admin/service/loading.service';

@Component({
  selector: 'app-client-layout',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ClientLayoutComponent {
  private readonly loadingSvc = inject(LoadingService);
  readonly loading = this.loadingSvc.loading;
}
