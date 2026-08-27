import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './app/interceptors/credentials.interceptor';

bootstrapApplication(AppComponent, {
	providers: [
		provideHttpClient(
			withInterceptors([credentialsInterceptor])
		),

		...(appConfig.providers ?? [])
	]
})
	.catch((err) => console.error(err));