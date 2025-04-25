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
      const userToCreate: User = this.userForm.getRawValue() as User;
      this.userService.addUser(userToCreate);

      this.userForm.reset(); // Vider le formulaire
      this.userCreated = true;

      // Message de confirmation pendant 1 seconde
      setTimeout(() => {
        this.userCreated = false;
      }, 1000);
    }
  }

  step = 1; // Étape initiale

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

}
