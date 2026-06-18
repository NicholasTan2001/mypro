import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Reveal } from '../../directive/reveal';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { API_CONFIG } from '../../config/api.config';
import { QRCodeComponent } from 'angularx-qrcode';
import { AuthService } from '../../services/auth.service';
import { Button } from '../../component/button/button';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-userdetails',
  imports: [CommonModule, Reveal, QRCodeComponent, Button, FormsModule],
  standalone: true,
  templateUrl: './userdetails.html',
  styleUrl: './userdetails.css'
})

export class UserDetails implements OnInit {

  id: any = null;
  name: any = null;
  identityNumber: any = null;
  email: any = null;
  user: any = null;
  experience: any[] = [];
  achievement: any[] = [];
  project: any[] = [];
  profileUrl = '';
  friends: number[] = [];
  userId: any = null;
  isLoading: boolean = false;
  reportError: string = '';
  reportSuccess: boolean = false;

  form = {
    Report: '',
  }

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
      this.identityNumber = user.identityNumber;
    }
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUserDetail(userId);
      this.loadExperience(userId);
      this.loadAchievement(userId);
      this.loadProject(userId);
      this.loadRelationship(userId);
      this.userId = userId;
      this.updateView(userId);
      this.profileUrl = `http://192.168.1.6:4200/user/${userId}`;
    }
  }

  async loadUserDetail(userId: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${API_CONFIG.usersEndpointBase}/${userId}`, {
          headers: {
            'Authorization': `Bearer ${this.authService.getToken()}`
          }
        })
      );
      if (response) {
        this.user = {
          id: response.id,
          name: response.name,
          age: response.age,
          email: response.email,
          phoneNumber: response.phoneNumber,
          country: response.country,
          sex: response.sex,
          address: response.address,
          block: response.block,
          viewNum: response.viewNum,
          birthDate: response.birthDate,
          status: response.status,
          intro: response.intro,
          conclusion: response.conclusion,
          hobby: response.hobby,
          skill: response.skill,
          language: response.language,
          position: response.position,
          course: response.course,
          location: response.location,
          blueTick: response.blueTick,
          studentStartDate: response.studentStartDate,
          studentEndDate: response.studentEndDat,
          role: response.role,
          company: response.company,
          responsible: response.responsible,
          empStartDate: response.empStartDate,
          empEndDate: response.empEndDate,
          linkedinLink: response.linkedinLink,
          portfolioLink: response.portfolioLink,
          additionalLink: response.additionalLink,
        };
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to load user details:', error);
      this.cd.detectChanges();
    }
  }

  async loadExperience(userId: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${API_CONFIG.usersEndpointBase}/experience/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );

      if (response && response.experiences) {
        this.experience = response.experiences.map((exp: any) => ({
          id: exp.id,
          position: exp.position,
          company: exp.company,
          responsible: exp.responsible,
          startDate: exp.startDate,
          endDate: exp.endDate
        }));
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load experiences:', error);
      this.experience = [];
      this.cd.detectChanges();
    }
  }

  async loadProject(userId: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${API_CONFIG.usersEndpointBase}/project/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.projects) {
        this.project = response.projects.map((pro: any) => ({
          id: pro.id,
          title: pro.title,
          type: pro.type,
          feature: pro.feature,
          startDate: pro.startDate,
          endDate: pro.endDate
        }));
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load Projects:', error);
      this.project = [];
      this.cd.detectChanges();
    }
  }

  async loadAchievement(userId: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${API_CONFIG.usersEndpointBase}/achievement/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.achievements) {
        this.achievement = response.achievements.map((ach: any) => ({
          id: ach.id,
          type: ach.type,
          title: ach.title,
          link: ach.link,
          date: ach.date,
        }));
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load Achievements:', error);
      this.achievement = [];
      this.cd.detectChanges();
    }
  }

  async loadRelationship(userId: string) {
    try {
      const response: any = await firstValueFrom(
        this.http.get(`${API_CONFIG.usersEndpointBase}/relationship/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response && response.relationships) {
        response.relationships.forEach((relationship: any) => {
          this.friends.push(relationship.friend);
        });
      };
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load Friends:', error);
      this.friends = [];
      this.cd.detectChanges();
    }
  }

  isFriend(permissionId: number): boolean {
    return this.friends.includes(permissionId);
  }

  async onSubmit() {
    this.isLoading = true;
    this.reportError = '';

    if (!this.form.Report) {
      this.reportError = "Report message is required."
      this.isLoading = false;
      this.cd.detectChanges();
      return;
    }
    try {
      const response: any = await firstValueFrom(
        this.http.post(`${API_CONFIG.usersEndpointBase}/report`,
          {
            reportThisId: this.userId,
            email: this.email,
            identityNumber: this.identityNumber,
            name: this.name,
            report: this.form.Report
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response) {
        this.isLoading = false;
        this.reportSuccess = true;
        this.form.Report = '';
        this.cd.detectChanges();
      };
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load Friends:', error);
      this.isLoading = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  closeReportSuccessModal() {
    this.reportSuccess = false;
  }

  getValidUrl(url: string): string {
    if (!url) return '';

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return 'https://' + url;
  }

  async updateView(userId: any) {
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        return;
      }
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-view`,
          {
            id: Number(userId),
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response) {
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.cd.detectChanges();
    } finally {
      this.cd.detectChanges();
    }
  }

}