import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { provideHttpClient } from '@angular/common/http';
import echarts from './assets/echarts';
import { provideEchartsCore } from 'ngx-echarts';

bootstrapApplication(AppComponent, {
  providers: [
    provideEchartsCore({ echarts }),
    provideHttpClient(),

    ...(appConfig.providers ?? [])
  ]
})
  .catch((err) => console.error(err));