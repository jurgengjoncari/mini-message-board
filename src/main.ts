import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import "@jurgengjoncari/default-styles/appearance-settings";

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
