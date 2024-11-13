import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appHideByClass]',
})
export class HideByClassDirective {
  @Input('appHideByClass') classNames: string | string[] = '';
  @Input() appHideElement: boolean;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appHideElement']) {
      if (this.appHideElement) {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
      } else {
        this.renderer.removeStyle(this.el.nativeElement, 'display');
      }
    }
  }
}
