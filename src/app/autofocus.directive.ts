import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[myAutofocus]'
})
export class AutofocusDirective {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.elementRef.nativeElement.focus();
  }

}
