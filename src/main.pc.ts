import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AppModule } from './pc/app.module';
import { environment } from './environments/environment';
import { COMPILER_OPTIONS, enableProdMode } from "@angular/core";

//禁用开发环境下特有的检查（双重变更检测周期）来让应用运行得更快。
if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));