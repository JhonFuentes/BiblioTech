import { Component, inject } from '@angular/core';
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
  loginData = { login: '', password: '' };
  error = '';
  private auth = inject(Auth);
  private router = inject(Router);

  onSubmit() {
    this.auth.login(this.loginData.login, this.loginData.password).subscribe({
      next: (res) => {
        if(res.success) {
          localStorage.setItem('user', JSON.stringify({ nombre: res.nombreCompleto, rol: res.rol }));
          this.router.navigate(['/layout']);
        } else {
          this.error = res.message;
        }
      },
      error: () => {
        this.error = 'Error de conexión con el servidor.';
      }
    });
  }
}
