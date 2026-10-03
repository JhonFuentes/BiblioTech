import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  @Output() closeModal = new EventEmitter<boolean>();
  loginData = { login: '', password: '' };
  error = '';
  private auth = inject(Auth);
  private router = inject(Router);

  onSubmit() {
    this.auth.login(this.loginData.login, this.loginData.password).subscribe({
      next: (res) => {
        if (res.success) {
          /*
          console.log('Token JWT:', res.token);
          */
          console.log(res.token, res.user, res.message, res.username, res.foto, res.fecha)
          this.auth.updateUser(res);
          this.closeModal.emit(true);
        } else {
          this.error = res.message;
        }
      },
      error: (err) => {
        if (err.error && err.error.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Error de conexión con el servidor.';
        }
      }
    });
  }

  onCancel() {
    this.closeModal.emit(false);
  }
}
