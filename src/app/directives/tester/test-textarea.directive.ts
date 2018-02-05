import { Directive, ElementRef, HostListener } from "@angular/core";
import { NgModel } from "@angular/forms";

import { TestService } from "app/providers/test.service";


@Directive({
  selector: "[appTextarea]",
  providers: [NgModel]
})
export class TestTextareaDirective {
  constructor(element: ElementRef, private testService: TestService) {

  }

  @HostListener("keydown") onkeydown() {
    this.testService.startTest();
  }

  @HostListener("ngModelChange", ["$event"]) onInputChange($event) {

  }
}
