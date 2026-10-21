import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Reveal } from '../../directive/reveal';
import { Button } from '../../component/button/button';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../../config/api.config';
import { ChangeDetectorRef } from '@angular/core';
import { ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [CommonModule, Reveal, Button, FormsModule],
  templateUrl: './chatbox.html',
  styleUrl: './chatbox.css',
})
export class Chatbox {

  isLoading: boolean = false;
  isChatboxOpen = false;
  form = {
    message: '',
  };

  messages: any[] = [];

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) { }

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

}
