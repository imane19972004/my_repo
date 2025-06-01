import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})

export class UserFormComponent implements OnInit {
  public userForm: FormGroup;
  public userCreated: boolean = false;
  step = 1; // Étape initiale
  selectedFile?: File;

  constructor(public formBuilder: FormBuilder, public userService: UserService) {
    this.userForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: [null],
      particularity: [''],
      role: ['', Validators.required],
    });
  }

  ngOnInit() {}

  addUser() {
    if (this.userForm.valid) {
      const formData = new FormData();
      const formValues = this.userForm.getRawValue();

      for (const key in formValues) {
        const value = formValues[key];
        if (value !== null && value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      }

      if (this.selectedFile) {
        formData.append('photo', this.selectedFile);
      }

      this.userService.addUser(formData);

      this.userForm.reset();
      this.selectedFile = undefined;
      this.userCreated = true;
      this.step = 1;

      setTimeout(() => {
        this.userCreated = false;
      }, 2000);
    } else {
      this.userForm.markAllAsTouched(); //Les erreurs si soumission invalide
    }
  }

  nextStep() {
    if (this.userForm.get('firstName')?.valid && this.userForm.get('lastName')?.valid) {
      this.step = 2;
    } else {
      this.userForm.get('firstName')?.markAsTouched();
      this.userForm.get('lastName')?.markAsTouched();
    }
  }

  previousStep() {
    this.step = 1;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

}
