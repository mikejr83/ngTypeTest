import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "app/components/home/home.component";
import { ConfigurationComponent } from "app/components/pages/configuration/configuration.component";
import { ResultsComponent } from "app/components/pages/results/results.component";
import { TypingTestComponent } from "app/components/pages/typing-test/typing-test.component";

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
    path: "results",
    component: ResultsComponent
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
