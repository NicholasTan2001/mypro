import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { Reveal } from '../../directive/reveal';
import { Button } from '../../component/button/button';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Aibutton } from '../../component/aibutton/aibutton';
import { LucideAngularModule, Mic, Square } from 'lucide-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, Reveal, Button, FormsModule, TranslateModule, Aibutton, LucideAngularModule],
  templateUrl: './chatbox.html',
  styleUrl: './chatbox.css',
})
export class Chatbox {

  @Output() showAiLoadingEvent = new EventEmitter<void>();

  isChatboxVisible: boolean = true;
  isLoading: boolean = false;
  isLoading2: boolean = false;
  isLoading3: boolean = false;
  isChatboxOpen = false;
  form = {
    message: '',
  };

  messages: any[] = [];

  private recognition: any;
  private recognizedTranscript: string = '';
  private insertTranscriptOnEnd: boolean = false;

  constructor(private http: HttpClient, private cd: ChangeDetectorRef, private translate: TranslateService) { }

  openChatbox(): void {
    this.isChatboxOpen = !this.isChatboxOpen;

    const button = document.querySelector('.chatbox-btn');

    if (button) {
      if (this.isChatboxOpen == true) {
        this.loadChatHistory();
        button.classList.add('poping-chatbox-btn');
      } else {
        button.classList.remove('poping-chatbox-btn');
      }
    }
  }

  async onSubmit(): Promise<void> {
    const information = this.form.message.trim();

    if (!information || this.isLoading) {
      return;
    }

    this.isLoading = true;

    try {
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

      const response: any = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.chatsEndpointBase}/messages`,
          {
            guestId: Number(guestId),
            information: information
          }
        )
      );

      if (response.success) {
        this.form.message = '';
        await this.loadChatHistory();
      }

    } catch (error) {
      console.error('Failed to save chat message:', error);
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  async loadChatHistory(): Promise<void> {
    const guestId = localStorage.getItem('guestId');

    if (!guestId) {
      this.messages = [];
      return;
    }

    try {
      const response: any = await firstValueFrom(
        this.http.get(
          `${API_CONFIG.chatsEndpointBase}/history/${guestId}`
        )
      );

      this.messages = response;
      this.scrollToBottom();
    } catch (error) {
      console.error('Failed to load chat history:', error);
    } finally {
      this.cd.detectChanges();
    }
  }

  @ViewChild('chatHistory')
  chatHistory!: ElementRef<HTMLDivElement>;

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatHistory) {
        const element = this.chatHistory.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    });
  }

  hideChatboxTemporarily(): void {

    this.isChatboxVisible = false;

    setTimeout(() => {
      this.isChatboxVisible = true;

      this.cd.detectChanges();
    }, 7000);
  }

  async deleteHistory(): Promise<void> {

    this.isLoading2 = true;

    const guestId = localStorage.getItem('guestId');

    if (!guestId) {
      return;
    }

    try {
      await firstValueFrom(
        this.http.delete(
          `${API_CONFIG.chatsEndpointBase}/history/${guestId}`
        )
      );

      await this.loadChatHistory();
      this.cd.detectChanges();

    } catch (error) {
      console.error('Failed to delete chat history:', error);
    } finally {
      this.isLoading2 = false;

      this.cd.detectChanges();
    }
  }

  toggleRecording(): void {

    if (!this.isLoading3) {

      const currentLanguage = this.translate.currentLang;
      const speechLanguages: { [key: string]: string } = {
        en: 'en-US',
        zh: 'zh-CN',
      }

      const browser = window as any;
      const SpeechRecognition =
        browser.SpeechRecognition || browser.webkitSpeechRecognition;

      if (!SpeechRecognition) {
        alert('Speech recognition is not supported by your browser.');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.recognition.lang =
        speechLanguages[currentLanguage] || 'en-US';
      this.recognition.continuous = true;
      this.recognition.interimResults = true;

      this.recognizedTranscript = '';
      this.insertTranscriptOnEnd = false;

      this.recognition.onresult = (event: any) => {
        let transcript = '';

        for (let i = 0; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            transcript += event.results[i][0].transcript + ' ';
          }
        }

        this.recognizedTranscript = transcript.trim();
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      this.recognition.onend = async () => {
        if (this.insertTranscriptOnEnd) {
          const transcript = this.recognizedTranscript;
          this.insertTranscriptOnEnd = false;

          if (transcript) {
            this.isLoading3 = true;

            this.form.message = await this.formatTranscript(transcript, currentLanguage);
          }
        }
        this.isLoading3 = false;
        this.cd.detectChanges();
      }

      try {
        this.recognition.start();
        this.isLoading3 = true;
        this.cd.detectChanges();
      } catch (error) {
        this.isLoading3 = false;
        this.cd.detectChanges();
        console.error('Failed to start recording:', error);
      }

    } else {
      this.insertTranscriptOnEnd = true;
      this.recognition.stop();
    }
  }

  private async formatTranscript(transcript: string, currentLanguage: string): Promise<string> {
    try {
      const response: any = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.chatsEndpointBase}/format-transcript`,
          {
            transcript: transcript,
            language: currentLanguage
          }
        )
      );

      return response.formattedTranscript || transcript;
    } catch (error) {
      console.error('Failed to format transcript:', error);

      return transcript;
    }
  }
}
