import "polyfills";
import "reflect-metadata";
import "zone.js/dist/zone-mix";

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

// NG Translate
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent } from "app/app.component";
import { HomeComponent } from "app/components/home/home.component";
import { ConfigurationComponent } from "app/components/pages/configuration/configuration.component";
import { TypingTestComponent } from "app/components/pages/typing-test/typing-test.component";
import { MenuComponent } from "app/components/ui/menu/menu.component";
import { TesterComponent } from "app/components/ui/tester/tester.component";
import { UserEditorComponent } from "app/components/ui/user-editor/user-editor.component";

// Directives
import { WebviewDirective } from "app/directives/webview.directive";

// Providers
import { ElectronService } from "app/providers/electron.service";
import { ConsoleLoggerService } from "app/providers/logging/console-logger.service";
import { LoggerService } from "app/providers/logging/logger.service";
import { TestService } from "app/providers/test.service";
import { UserService } from "app/providers/user.service";


// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    HomeComponent,
    MenuComponent,
    TesterComponent,
    TypingTestComponent,
    UserEditorComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ElectronService,
    TestService,
    UserService,
    {
      provide: LoggerService,
      useClass: ConsoleLoggerService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
