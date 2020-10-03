import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import * as uiActions from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando = false;
  uiSubscription: Subscription;
  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.uiSubscription = this.store.select('ui').subscribe(ui => {
      this.cargando = ui.isLoading;
    });

  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  loguearse(){
    if (this.loginForm.invalid){return; }


    this.store.dispatch(uiActions.isLoading());

    const {email, password} = this.loginForm.value;
    this.authService.loginUsuario(email, password)
                    .then(credenciales => {

                      this.store.dispatch(uiActions.stopLoading());
                      this.router.navigate(['/']);
                    })
                    .catch(err =>{
                      this.store.dispatch(uiActions.stopLoading());
                      Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.message
                      });
                     });
  }

}
