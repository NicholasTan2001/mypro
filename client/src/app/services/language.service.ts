import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = 'en' | 'zh';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {

  private readonly storageKey = 'myprofile-language';
  private readonly defaultLanguage: SupportedLanguage = 'en';
  private readonly supportedLanguages: SupportedLanguage[] = ['en', 'zh'];

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.translate.addLangs(this.supportedLanguages);
    this.translate.setDefaultLang(this.defaultLanguage);
    this.useLanguage(this.savedLanguage);
  }

  get currentLanguage(): SupportedLanguage {
    const currentLang = this.translate.currentLang as SupportedLanguage | undefined;
    return this.isSupportedLanguage(currentLang) ? currentLang : this.defaultLanguage;
  }

  get nextLanguage(): SupportedLanguage {
    return this.currentLanguage === 'en' ? 'zh' : 'en';
  }

  toggleLanguage(): void {
    this.useLanguage(this.nextLanguage);
  }

  useLanguage(language: SupportedLanguage): void {
    this.translate.use(language);
    this.saveLanguage(language);
  }

  private get savedLanguage(): SupportedLanguage {
    if (!isPlatformBrowser(this.platformId)) {
      return this.defaultLanguage;
    }

    const language = localStorage.getItem(this.storageKey) as SupportedLanguage | null;
    return this.isSupportedLanguage(language) ? language : this.defaultLanguage;
  }

  private saveLanguage(language: SupportedLanguage): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, language);
    }
  }

  private isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
    return this.supportedLanguages.includes(language as SupportedLanguage);
  }
}
