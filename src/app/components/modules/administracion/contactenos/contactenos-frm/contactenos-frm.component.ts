import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto-frm',
  templateUrl: './contactenos-frm.component.html',
  styleUrl: './contactenos-frm.component.css'})
  
export class ContactenosFrmComponent implements OnInit {
  formulario!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      asunto: ['', Validators.required],
      mensaje: ['', Validators.required],
    });
  }

  enviar() {
    if (this.formulario.valid) {
      this.http.post('https://tuservicio/api/contactenos', this.formulario.value)
        .subscribe({
          next: res => {
            alert('Mensaje enviado correctamente.');
            this.formulario.reset();
          },
          error: err => {
            console.error(err);
            alert('Ocurrió un error al enviar el mensaje.');
          }
        });
    }
  }
}