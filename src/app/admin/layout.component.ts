import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2, signal, ViewChild } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LayoutService } from './service/layout.service';
import { AppTopbar } from "./components/app.topbar";
import { AppSidebar } from "./components/app.sidebar";
import { filter, Subscription } from 'rxjs';


@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AppTopbar,
    AppSidebar,
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LayoutComponent implements OnInit{
  dataUser: any = signal(null);
  // tokenDataService = inject(TokenDataService)


  ngOnInit(): void {
    // this.dataUser.set(this.tokenDataService.getTokenJson());

    // Quito rutas para usuarios que no son super_admin
    // if (this.dataUser().role_id !== 1) {
    //   this.fillerNav = this.fillerNav.filter(item => item.route !== 'usuarios')
    // }

    // Quito rutas para usuarios que no son super_admin, ni admin
    // if (this.dataUser().role_id !== 1 && this.dataUser().role_id !== 2) {
    //   this.fillerNav = this.fillerNav.filter(item => item.route !== 'politicas')
    //   this.fillerNav = this.fillerNav.filter(item => item.route !== 'datos')
    //   this.fillerNav = this.fillerNav.filter(item => item.route !== 'noticias')
    //   this.fillerNav = this.fillerNav.filter(item => item.route !== 'nosotros')
    //   this.fillerNav = this.fillerNav.filter(item => item.route !== 'comentarios')
    //   this.fillerNav = this.fillerNav.filter(item => item.route !== 'certificaciones')
    // }
  }

  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  @ViewChild(AppSidebar) appSidebar!: AppSidebar;

  @ViewChild(AppTopbar) appTopBar!: AppTopbar;

  constructor(
      public layoutService: LayoutService,
      public renderer: Renderer2,
      public router: Router
  ) {
      this.overlayMenuOpenSubscription = this.layoutService.overlayOpen$.subscribe(() => {
          if (!this.menuOutsideClickListener) {
              this.menuOutsideClickListener = this.renderer.listen('document', 'click', (event) => {
                  if (this.isOutsideClicked(event)) {
                      this.hideMenu();
                  }
              });
          }

          if (this.layoutService.layoutState().staticMenuMobileActive) {
              this.blockBodyScroll();
          }
      });

      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
          this.hideMenu();
      });
  }

  isOutsideClicked(event: MouseEvent) {
      const sidebarEl = document.querySelector('.layout-sidebar');
      const topbarEl = document.querySelector('.layout-menu-button');
      const eventTarget = event.target as Node;

      return !(sidebarEl?.isSameNode(eventTarget) || sidebarEl?.contains(eventTarget) || topbarEl?.isSameNode(eventTarget) || topbarEl?.contains(eventTarget));
  }

  hideMenu() {
      this.layoutService.layoutState.update((prev) => ({ ...prev, overlayMenuActive: false, staticMenuMobileActive: false, menuHoverActive: false }));
      if (this.menuOutsideClickListener) {
          this.menuOutsideClickListener();
          this.menuOutsideClickListener = null;
      }
      this.unblockBodyScroll();
  }

  blockBodyScroll(): void {
      if (document.body.classList) {
          document.body.classList.add('blocked-scroll');
      } else {
          document.body.className += ' blocked-scroll';
      }
  }

  unblockBodyScroll(): void {
      if (document.body.classList) {
          document.body.classList.remove('blocked-scroll');
      } else {
          document.body.className = document.body.className.replace(new RegExp('(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
  }

  get containerClass() {
      return {
          'layout-overlay': this.layoutService.layoutConfig().menuMode === 'overlay',
          'layout-static': this.layoutService.layoutConfig().menuMode === 'static',
          'layout-static-inactive': this.layoutService.layoutState().staticMenuDesktopInactive && this.layoutService.layoutConfig().menuMode === 'static',
          'layout-overlay-active': this.layoutService.layoutState().overlayMenuActive,
          'layout-mobile-active': this.layoutService.layoutState().staticMenuMobileActive
      };
  }

  ngOnDestroy() {
      if (this.overlayMenuOpenSubscription) {
          this.overlayMenuOpenSubscription.unsubscribe();
      }

      if (this.menuOutsideClickListener) {
          this.menuOutsideClickListener();
      }
  }

}
