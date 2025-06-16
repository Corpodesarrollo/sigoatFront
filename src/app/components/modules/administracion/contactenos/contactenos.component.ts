import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacto',
  templateUrl: './contactenos.component.html',
  styleUrl: './contactenos.component.css'})
  
export class ContactoComponent implements OnInit {
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