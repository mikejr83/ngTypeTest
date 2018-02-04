import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "./components/home/home.component";
import { ConfigurationComponent } from "./components/pages/configuration/configuration.component";
import { TypingTestComponent } from "./components/pages/typing-test/typing-test.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "configuration",
    component: ConfigurationComponent
  },
  {
    path: "typing-test",
    component: TypingTestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
