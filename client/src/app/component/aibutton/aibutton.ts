import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Button } from '../../component/button/button';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toPng } from 'html-to-image';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';


@Component({
  selector: 'app-aibutton',
  standalone: true,
  imports: [Button, TranslateModule],
  templateUrl: './aibutton.html',
  styleUrl: './aibutton.css',
})
export class Aibutton implements OnInit {

  @Output() showAiLoadingEvent = new EventEmitter<void>();

  @Output() loadChatHistoryEvent = new EventEmitter<void>();

  language: string = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, public languageService: LanguageService) { }

  ngOnInit() {
    this.language = this.languageService.currentLanguage;
  }

  async generateScreenshot(): Promise<void> {

    this.isLoading = true;

    this.cd.detectChanges();

    setTimeout(async () => {

      this.showAiLoadingEvent.emit();

      try {
        const imageDataUrl = await toPng(document.documentElement, {
          cacheBust: true,
          skipFonts: true,
        });

        const imageBase64 = imageDataUrl.split(',')[1];

        let guestId = localStorage.getItem('guestId');

        if (!guestId) {
          let isExisting = true;

          while (isExisting) {
            guestId = String(
              Math.floor(10000 + Math.random() * 90000)
            );

            const response: any = await firstValueFrom(
              this.http.get(
                `${API_CONFIG.chatsEndpointBase}/${guestId}`
              )
            );

            isExisting = response.exists;
          }

          localStorage.setItem('guestId', String(guestId));
        }

        const response = await firstValueFrom(
          this.http.post(
            `${API_CONFIG.chatsEndpointBase}/analyze-screenshot`,
            {
              language: this.language,
              imageBase64: imageBase64,
              guestId: Number(guestId),
            }
          )
        );

        if (response != null) {

          this.loadChatHistoryEvent.emit();

        }

      } catch (error: any) {
        console.error('Screenshot analysis failed:', error);
        console.error('Backend error details:', error.error);
      } finally {
        this.isLoading = false;
        this.cd.detectChanges();
      }

    }, 1000);

  }

}
