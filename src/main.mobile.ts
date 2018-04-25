import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './mobile/app.module';
import { environment } from './environments/environment';
import { enableProdMode } from "@angular/core";

//禁用开发环境下特有的检查（双重变更检测周期）来让应用运行得更快。
if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
    .catch(err => console.log(err));
// platformBrowserDynamic().bootstrapModule()方法来编译启用AppModule模块
// 根据当前的运行环境，如操作系统、浏览器，来初始化一个运行环境，然后从这个环境里面运行AppModule。