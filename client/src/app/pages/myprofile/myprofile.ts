import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Button } from '../../component/button/button';
import { Reveal } from '../../directive/reveal';
import { FormsModule } from '@angular/forms';
import { InputComponent } from '../../component/input/input';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { API_CONFIG } from '../../config/api.config';

interface UpdateProfileResponse {
  message: string;
  user: {
    id: number;
    name: string;
    age: number;
    identityNumber: string;
    country: string;
    email: string;
    phoneNumber: string;
    sex: string;
    address: string;
    birthDate: Date;
  };
}

@Component({
  selector: 'app-myprofile',
  imports: [CommonModule, Button, Reveal, FormsModule, InputComponent],
  standalone: true,
  templateUrl: './myprofile.html',
  styleUrl: './myprofile.css',
})

export class Myprofile implements OnInit {

  id: string = '';
  name: string = '';
  loginSuccess: boolean = false;
  isLoading: boolean = false;
  isLoading2: boolean = false;
  isLoading3: boolean = false;
  isLoading4: boolean = false;
  isLoading5: boolean = false;
  isLoading6: boolean = false;
  isLoading7: boolean = false;
  isLoading8: boolean = false;
  nameError: string = '';
  ageError: string = '';
  emailError: string = '';
  phoneNumberError: string = '';
  addressError: string = '';
  updateUserSuccess: boolean = false;
  courseError: string = '';
  locationError: string = '';
  studentDateError: string = '';
  roleError: string = '';
  companyError: string = '';
  empDateError: string = '';
  responsibleError: string = '';
  positionError: string = '';
  workingDateError: string = '';
  workingResponsibleError: string = '';
  workingCompanyError: string = '';
  titleError: string = '';
  linkError: string = '';
  achiveDateError: string = '';
  projectTitleError: string = '';
  projectTypeError: string = '';
  projectFeatureError: string = '';
  projectDateError: string = '';
  hobbyError: string = '';
  skillError: string = '';
  languageError: string = '';
  birthDateError: string = '';

  form = {
    IdentityNumber: '',
    Name: '',
    Age: '',
    Country: '',
    Email: '',
    PhoneNumber: '',
    Sex: '',
    Address: '',
    BirthDate: ''
  }

  form2 = {
    Intro: ''
  }

  form3 = {
    Conclusion: ''
  }

  form4 = {
    Position: 'Student'
  }

  form5 = {
    Course: '',
    Location: '',
    StartDate: '',
    EndDate: '',
  }

  form6 = {
    Role: '',
    Company: '',
    Responsible: '',
    StartDate: '',
    EndDate: '',
  }

  form7 = {
    Position: '',
    Company: '',
    Responsible: '',
    StartDate: '',
    EndDate: '',
  }

  form8 = {
    Title: '',
    Type: '',
    Feature: '',
    StartDate: '',
    EndDate: '',
  }

  form9 = {
    Type: 'Certificate',
    Title: '',
    Link: '',
    Date: '',
  }

  form10 = {
    Hobby: '',
    Skill: '',
    Language: '',
  }

  experience: any[] = [];
  achievement: any[] = [];
  project: any[] = [];

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cd.detectChanges();
    this.loadUser();
    this.loadAdditional();
    this.loadPosition();
    this.loadExperience();
    this.loadAchievement();
    this.loadProject();
    this.authService.freshLogin$.subscribe(isFreshLogin => {
      this.loginSuccess = isFreshLogin;
    });
  }

  async loadUser() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );

        if (response) {
          this.name = response.name;
          this.form.IdentityNumber = response.identityNumber;
          this.form.Name = response.name;
          this.form.Age = (response.age).toString();
          this.form.Country = response.country;
          this.form.Email = response.email;
          this.form.PhoneNumber = response.phoneNumber;
          this.form.Address = response.address;
          this.form.Sex = response.sex;
          this.form.BirthDate = response.birthDate ? response.birthDate.split('T')[0]
            : '';

          this.id = user.id;
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load user information:', error);
      this.cd.detectChanges();
    }
  }

  async loadAdditional() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/additional/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );

        if (response) {
          this.form2.Intro = response.intro;
          this.form3.Conclusion = response.conclusion;
          this.form10.Hobby = response.hobby;
          this.form10.Skill = response.skill;
          this.form10.Language = response.language;
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load additional information:', error);
      this.cd.detectChanges();
    }
  }

  async loadPosition() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/position/${user.id}`,
            {
              headers: {
                'Authorization': `Bearer ${this.authService.getToken()}`
              }
            }
          )
        );

        if (response) {
          this.form4.Position = response.position;
          if (response.position === 'Employee' || response.position === 'Employer') {
            this.form6.Role = response.role || '';
            this.form6.Company = response.company || '';
            this.form6.Responsible = response.responsible || '';
            this.form6.StartDate = response.startDate
              ? response.startDate.split('T')[0]
              : '';

            this.form6.EndDate = response.endDate
              ? response.endDate.split('T')[0]
              : '';
            this.form6.Responsible = response.responsible || '';
          } else if (response.position === 'Student') {

            this.form5.Course = response.course || '';
            this.form5.Location = response.location || '';
            this.form5.StartDate = response.startDate
              ? response.startDate.split('T')[0]
              : '';

            this.form5.EndDate = response.endDate
              ? response.endDate.split('T')[0]
              : '';
          }
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load position:', error);
      this.form4.Position = 'Student';
      this.cd.detectChanges();
    }
  }

  async loadExperience() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/experience/${user.id}`,
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
            startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
            endDate: exp.endDate ? exp.endDate.split('T')[0] : ''
          }));
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load experiences:', error);
      this.cd.detectChanges();
    }
  }

  async loadAchievement() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/achievement/${user.id}`,
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
            date: ach.date ? ach.date.split('T')[0] : '',
          }));
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load achievements:', error);
      this.cd.detectChanges();
    }
  }

  async loadProject() {
    try {
      const user = this.authService.getCurrentUser();
      if (user) {
        const response: any = await firstValueFrom(
          this.http.get(
            `${API_CONFIG.usersEndpointBase}/project/${user.id}`,
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
            startDate: pro.startDate ? pro.startDate.split('T')[0] : '',
            endDate: pro.endDate ? pro.endDate.split('T')[0] : '',

          }));
        }
      }
      this.cd.detectChanges();
    } catch (error: any) {
      console.error('Failed to load projects:', error);
      this.cd.detectChanges();
    }
  }

  closeLoginSuccessModal() {
    this.loginSuccess = false;
    this.authService.clearFreshLogin();
  }

  async onSubmit() {
    this.isLoading = true;
    this.nameError = '';
    this.ageError = '';
    this.emailError = '';
    this.phoneNumberError = '';
    this.addressError = '';
    this.birthDateError = '';
    try {
      if (!this.form.Name) {
        this.nameError = 'Name is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form.Age) {
        this.ageError = 'Age is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (Number(this.form.Age) <= 0 || Number(this.form.Age) > 120 || isNaN(Number(this.form.Age))) {
        this.ageError = 'Valid age is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form.BirthDate) {
        this.birthDateError = 'Date of Birth is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form.Email) {
        this.emailError = 'Email is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.Email)) {
        this.emailError = 'Valid email is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form.PhoneNumber) {
        this.phoneNumberError = 'Phone number is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!/^\d{10}$/.test(this.form.PhoneNumber)) {
        this.phoneNumberError = 'Valid phone number is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form.Address) {
        this.addressError = 'Address is required.';
        this.isLoading = false;
        this.cd.detectChanges();
        return;
      }
      const response = await firstValueFrom(
        this.http.put<UpdateProfileResponse>(
          `${API_CONFIG.usersEndpointBase}/update-profile`,
          {
            identityNumber: this.form.IdentityNumber,
            name: this.form.Name,
            age: Number(this.form.Age),
            email: this.form.Email,
            phoneNumber: this.form.PhoneNumber,
            country: this.form.Country,
            sex: this.form.Sex,
            address: this.form.Address,
            birthDate: this.form.BirthDate
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
        this.loadUser();
        this.isLoading = false;
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading = false;
      const message = error?.error?.message || 'Failed to update profile. Please try again.';
      this.nameError = message;
      this.cd.detectChanges();
    } finally {
      this.isLoading = false;
      this.cd.detectChanges();
    }
  }

  closeUpdateUserModal() {
    this.updateUserSuccess = false;
  }

  async onSubmit2() {
    this.isLoading2 = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.isLoading2 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-intro`,
          {
            identityNumber: user.identityNumber,
            intro: this.form2.Intro
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
        this.isLoading2 = false;
        this.loadAdditional();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading2 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading2 = false;
      this.cd.detectChanges();
    }
  }

  async onSubmit3() {
    this.isLoading3 = true;
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.isLoading3 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-conclusion`,
          {
            identityNumber: user.identityNumber,
            conclusion: this.form3.Conclusion
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
        this.isLoading3 = false;
        this.loadAdditional();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading3 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading3 = false;
      this.cd.detectChanges();
    }
  }

  async onSubmit4() {
    this.isLoading4 = true;
    this.courseError = '';
    this.locationError = '';
    this.studentDateError = '';
    this.roleError = '';
    this.companyError = '';
    this.empDateError = '';
    this.responsibleError = '';
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.isLoading4 = false;
      this.cd.detectChanges();
      return;
    }
    const position = this.form4.Position;
    if (position === 'Student') {
      try {
        if (!this.form5.Course) {
          this.courseError = 'Course is required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form5.Location) {
          this.locationError = 'Location is required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form5.StartDate || !this.form5.EndDate || this.form5.StartDate >= this.form5.EndDate) {
          this.studentDateError = 'Valid dates are required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        const response = await firstValueFrom(
          this.http.put(
            `${API_CONFIG.usersEndpointBase}/update-student`,
            {
              identityNumber: user.identityNumber,
              course: this.form5.Course,
              location: this.form5.Location,
              startDate: this.form5.StartDate,
              endDate: this.form5.EndDate
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
          this.isLoading4 = false;
          this.loadPosition();
          this.updateUserSuccess = true;
          this.cd.detectChanges();
        }
      } catch (error: any) {
        this.isLoading4 = false;
        this.cd.detectChanges();
      } finally {
        this.isLoading4 = false;
        this.cd.detectChanges();
      }
    }
    else if (position === 'Employee' || position === 'Employer') {
      try {
        if (!this.form6.Role) {
          this.roleError = 'Role is required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form6.Responsible) {
          this.responsibleError = 'Responsibilities are required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form6.Company) {
          this.companyError = 'Company is required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        if (!this.form6.StartDate || !this.form6.EndDate || this.form6.StartDate >= this.form6.EndDate) {
          this.empDateError = 'Valid dates are required.';
          this.isLoading4 = false;
          this.cd.detectChanges();
          return;
        }
        const response = await firstValueFrom(
          this.http.put(
            `${API_CONFIG.usersEndpointBase}/update-organization`,
            {
              position: position,
              identityNumber: user.identityNumber,
              role: this.form6.Role,
              company: this.form6.Company,
              startDate: this.form6.StartDate,
              endDate: this.form6.EndDate,
              responsible: this.form6.Responsible
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
          this.isLoading4 = false;
          this.loadPosition();
          this.updateUserSuccess = true;
          this.cd.detectChanges();
        }
      } catch (error: any) {
        this.isLoading4 = false;
        this.cd.detectChanges();
      } finally {
        this.isLoading4 = false;
        this.cd.detectChanges();
      }
    }
  }

  async onSubmit5() {
    this.isLoading5 = true;
    this.positionError = '';
    this.workingResponsibleError = '';
    this.workingCompanyError = '';
    this.workingDateError = '';
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;
      if (!this.form7.Position) {
        this.positionError = 'Position is required.';
        this.isLoading5 = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form7.Responsible) {
        this.workingResponsibleError = 'Responsibilities are required.';
        this.isLoading5 = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form7.Company) {
        this.workingCompanyError = 'Company is required.';
        this.isLoading5 = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form7.StartDate || !this.form7.EndDate || this.form7.StartDate >= this.form7.EndDate) {
        this.workingDateError = 'Valid working dates are required.';
        this.isLoading5 = false;
        this.cd.detectChanges();
        return;
      }
      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/add-experience`,
          {
            identityNumber: user.identityNumber,
            position: this.form7.Position,
            company: this.form7.Company,
            responsible: this.form7.Responsible,
            startDate: this.form7.StartDate,
            endDate: this.form7.EndDate
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
        this.form7 = { Position: '', Company: '', Responsible: '', StartDate: '', EndDate: '' };
        this.isLoading5 = false;
        this.loadExperience();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to add experience:', error);
      this.isLoading5 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading5 = false;
      this.cd.detectChanges();
    }
  }

  async deleteExperience(id: number) {
    try {
      const response = await firstValueFrom(
        this.http.delete(
          `${API_CONFIG.usersEndpointBase}/delete-experience/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response) {
        this.loadExperience();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete experience:', error);
      this.cd.detectChanges();
    } finally {
      this.cd.detectChanges();
    }
  }

  async onSubmit6() {
    this.isLoading6 = true;
    this.projectTitleError = '';
    this.projectTypeError = '';
    this.projectFeatureError = '';
    this.projectDateError = '';
    try {
      const user = this.authService.getCurrentUser();
      if (!user) return;

      if (!this.form8.Title) {
        this.projectTitleError = "Title is required."
        this.isLoading6 = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form8.Type) {
        this.projectTypeError = "Type is required."
        this.isLoading6 = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form8.Feature) {
        this.projectFeatureError = "Feature is required."
        this.isLoading6 = false;
        this.cd.detectChanges();
        return;
      }
      if (!this.form8.StartDate || !this.form8.EndDate || this.form8.StartDate >= this.form8.EndDate) {
        this.projectDateError = 'Valid dates are required.';
        this.isLoading6 = false;
        this.cd.detectChanges();
        return;
      }
      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/add-project`,
          {
            identityNumber: user.identityNumber,
            title: this.form8.Title,
            type: this.form8.Type,
            feature: this.form8.Feature,
            startDate: this.form8.StartDate,
            endDate: this.form8.EndDate
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
        this.form8 = { Title: '', Type: '', Feature: '', StartDate: '', EndDate: '' };
        this.isLoading6 = false;
        this.loadProject();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to add project:', error);
      this.isLoading6 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading6 = false;
      this.cd.detectChanges();
    }

  }

  async deleteProject(id: number) {
    try {
      const response = await firstValueFrom(
        this.http.delete(
          `${API_CONFIG.usersEndpointBase}/delete-project/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response) {
        this.loadProject();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete project:', error);
    }
  }

  async onSubmit7() {
    try {
      this.isLoading7 = true;
      this.titleError = '';
      this.linkError = '';
      this.achiveDateError = '';
      const user = this.authService.getCurrentUser();
      if (!user) return;

      if (!this.form9.Date) {
        this.achiveDateError = "Valid date is required.";
        this.isLoading7 = false;
        this.cd.detectChanges();
        return;
      }

      if (!this.form9.Title) {
        this.titleError = "Title is required.";
        this.isLoading7 = false;
        this.cd.detectChanges();
        return;
      }

      if (!this.form9.Link) {
        this.linkError = "Link is required.";
        this.isLoading7 = false;
        this.cd.detectChanges();
        return;
      }

      const response = await firstValueFrom(
        this.http.post(
          `${API_CONFIG.usersEndpointBase}/add-achievement`,
          {
            identityNumber: user.identityNumber,
            type: this.form9.Type,
            title: this.form9.Title,
            link: this.form9.Link,
            date: this.form9.Date,
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
        this.form9 = { Type: 'Award', Title: '', Link: '', Date: '' };
        this.loadAchievement();
        this.updateUserSuccess = true;
        this.isLoading7 = false;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to add achievement:', error);
      this.isLoading7 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading7 = false;
      this.cd.detectChanges();

    }
  }

  async deleteAchievement(id: number) {
    try {
      const response = await firstValueFrom(
        this.http.delete(
          `${API_CONFIG.usersEndpointBase}/delete-achievement/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${this.authService.getToken()}`
            }
          }
        )
      );
      if (response) {
        this.loadAchievement();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      console.error('Failed to delete achievement:', error);
      this.cd.detectChanges();
    } finally {
      this.cd.detectChanges();
    }
  }

  async onSubmit8() {
    this.isLoading8 = true;
    this.hobbyError = '';
    this.skillError = '';
    this.languageError = '';
    if (!this.form10.Hobby) {
      this.hobbyError = "Hobby is required.";
      this.isLoading8 = false;
      this.cd.detectChanges();
      return;
    }
    if (!this.form10.Skill) {
      this.skillError = "Skill is required.";
      this.isLoading8 = false;
      this.cd.detectChanges();
      return;
    }
    if (!this.form10.Language) {
      this.languageError = "Language is required.";
      this.isLoading8 = false;
      this.cd.detectChanges();
      return;
    }
    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        this.isLoading8 = false;
        return;
      }
      const response = await firstValueFrom(
        this.http.put(
          `${API_CONFIG.usersEndpointBase}/update-additional`,
          {
            identityNumber: user.identityNumber,
            hobby: this.form10.Hobby,
            skill: this.form10.Skill,
            language: this.form10.Language
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
        this.isLoading8 = false;
        this.loadAdditional();
        this.updateUserSuccess = true;
        this.cd.detectChanges();
      }
    } catch (error: any) {
      this.isLoading8 = false;
      this.cd.detectChanges();
    } finally {
      this.isLoading8 = false;
      this.cd.detectChanges();
    }
  }




}