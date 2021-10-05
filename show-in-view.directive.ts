import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { WindowService } from 'src/app/core/services/window.service';

@Directive({
  selector: '[appShowInView]',
})
export class ShowInViewDirective implements OnInit, AfterViewInit, OnDestroy {

  private unsubscribe$: Subject<void> = new Subject();

  private observer!: IntersectionObserver;
  private isShownInView: boolean = false;

  @Input()
  public showShadow: boolean = false;

  @Input()
  public className: string = '';

  @HostBinding('class')
  private get class() {
    return this.isShownInView ? this.className : '';
  }

  constructor(
    private targetElement: ElementRef,
    private windowService: WindowService
  ) {}

  ngOnInit(): void {
    this.createObserver();
  }

  ngAfterViewInit(): void {
    if (!this.showShadow) return;

    this.startObserving();
  }

  ngOnDestroy(): void {
    this.observer.disconnect();

    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private createObserver(): void {
    const options: IntersectionObserverInit = {
      rootMargin: '-50% 0%',
      threshold: 0,
    };

    this.observer = new IntersectionObserver(this.handleOnView, options);
  }

  private startObserving(): void {
    this.windowService
      .getScreenWidth()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((width: number) => {
        if (width < 500) {
          this.observer.observe(this.targetElement.nativeElement);
        } else {
          this.observer.unobserve(this.targetElement.nativeElement);
          this.isShownInView = false;
        }
      });
  }

  private handleOnView = (
    entries: IntersectionObserverEntry[],
    observer: IntersectionObserver
  ) => {
    const entry: IntersectionObserverEntry = entries[0];
    this.isShownInView = entry.isIntersecting;
  };
}
