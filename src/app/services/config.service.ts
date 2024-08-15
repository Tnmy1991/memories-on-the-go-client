import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private static serviceArray: { [x: string]: string };

  static async initConfigService(): Promise<void> {
    try {
      const response = await fetch(
        'https://dgj5ycb4c5gqdyx7hzzr3ebtli0frvcl.lambda-url.us-east-1.on.aws/'
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      this.serviceArray = {
        USER_ENDPOINT: json[1].Value,
        IMAGE_ENDPOINT: json[0].Value,
      };
    } catch (error) {
      console.error(error);
    }
  }

  getConfigService(key: string): string {
    return ConfigService.serviceArray[key];
  }
}
