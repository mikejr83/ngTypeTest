import * as isElectronEnabled from "../electron-test.js";

import "polyfills";
import "reflect-metadata";
import "zone.js/dist/zone-mix";

import { HttpClient, HttpClientModule } from "@angular/common/http";
import { NgModule, Provider } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

// NG Translate
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { TextInputHighlightModule } from "angular-text-input-highlight";

import { AppRoutingModule } from "./app-routing.module";

// Components
import { AppComponent } from "app/app.component";
import { HomeComponent } from "app/components/home/home.component";
import { ConfigurationComponent } from "app/components/pages/configuration/configuration.component";
import { ResultsComponent } from "app/components/pages/results/results.component";
import { TypingTestComponent } from "app/components/pages/typing-test/typing-test.component";
import { MenuComponent } from "app/components/ui/menu/menu.component";
import { UserEditorComponent } from "app/components/ui/user-editor/user-editor.component";
import { UserLogonComponent } from "app/components/ui/user-logon/user-logon.component";

// Directives
import { TestTextareaDirective } from "app/directives/tester/test-textarea.directive";
import { WebviewDirective } from "app/directives/webview.directive";

// Providers
import { ConfigurationIpcService } from "app/providers/configuration/configuration.ipc.service";
import { ConfigurationService } from "app/providers/configuration/configuration.service";
import { ConfigurationWebService } from "app/providers/configuration/configuration.web.service";

import { ElectronIpcService } from "app/providers/electron/electron.ipc.service";
import { ElectronService } from "app/providers/electron/electron.service";
import { ElectronWebService } from "app/providers/electron/electron.web.service";

import { ConsoleLoggerService } from "app/providers/logging/console-logger.service";
import { LoggerService } from "app/providers/logging/logger.service";

import { TestIpcService } from "app/providers/test/test.ipc.service";
import { TestService } from "app/providers/test/test.service";
import { TestWebService } from "app/providers/test/test.web.service";

import { UserIpcService } from "app/providers/user/user.ipc.service";
import { UserService } from "app/providers/user/user.service";
import { UserWebService } from "app/providers/user/user.web.service";



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

const providers: Provider[] = [
  {
    provide: ConfigurationService,
    useClass: isElectronEnabled ? ConfigurationIpcService : ConfigurationWebService
  },
  {
    provide: ElectronService,
    useClass: isElectronEnabled ? ElectronIpcService : ElectronWebService
  },
  {
    provide: TestService,
    useClass: isElectronEnabled ? TestIpcService : TestWebService
  },
  {
    provide: UserService,
    useClass: isElectronEnabled ? UserIpcService : UserWebService
  },
  {
    provide: LoggerService,
    useClass: ConsoleLoggerService
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ConfigurationComponent,
    HomeComponent,
    MenuComponent,
    ResultsComponent,
    TestTextareaDirective,
    TypingTestComponent,
    UserEditorComponent,
    UserLogonComponent,
    WebviewDirective
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    TextInputHighlightModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: providers,
  bootstrap: [AppComponent]
})
export class AppModule { }
