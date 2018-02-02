import { Component, OnInit } from "@angular/core";

import { LoggerService } from "app/providers/logging/logger.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  show: boolean = false;

  constructor(private logger: LoggerService) { }

  ngOnInit() {
  }

  toggle() {
    this.logger.debug("Toggling the side nav", !this.show);

    this.show = !this.show;
  }
}
