import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[autofocus]'
})
export class AutofocusDirective {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.focus();
  }

}
