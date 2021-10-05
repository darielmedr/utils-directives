import { Directive, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { WindowService } from '../services/window.service';

@Directive({
  selector: '[appScrollProgressBar]'
})
export class ScrollProgressBarDirective implements OnInit, OnDestroy {

  private subscription: Subscription = new Subscription();

  constructor(private windowService: WindowService) { }

  ngOnInit(): void {
    this.setScrolledPercent();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostBinding('style.width') scrolled: string = '0%';

  private setScrolledPercent() {
    this.subscription = this.windowService.getScrolledTop().subscribe(
      () => {
        const documentHeight = Math.max(
          document.body.scrollHeight || 0.01,
          document.documentElement.scrollHeight || 0.01,
          document.body.offsetHeight || 0.01,
          document.documentElement.offsetHeight || 0.01,
          document.body.clientHeight || 0.01,
          document.documentElement.clientHeight || 0.01
        );
        const clientHeight = window.innerHeight ||
          window.screen.height ||
          document.documentElement.clientHeight ||
          document.body.clientHeight || 0;

        const scrolled = window.pageYOffset ||
          window.scrollY ||
          document.body.scrollTop ||
          document.documentElement.scrollTop || 0;

        const height = (documentHeight - clientHeight);
        const scrolledPercent = (scrolled / height) * 100;

        this.scrolled = scrolledPercent + '%';
      }
    );
  }
}
