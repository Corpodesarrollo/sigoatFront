import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { MsgTipo } from '../../../models/msgTipo.model';
import { MsgBotones } from '../../../models/msgBotones.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-msg-box',
  standalone: true,
  imports: [DialogModule, CommonModule],
  templateUrl: './msg-box.component.html',
  styleUrl: './msg-box.component.css'
})
export class MsgBoxComponent {
  @Input() msgTexto: string = '';
  @Input() msgTipo: MsgTipo | null = MsgTipo.Info;
  @Input() msgTitulo: string = '';
  @Input() msgBotones: MsgBotones = MsgBotones.Aceptar;
  @Input() error: boolean = false;
  @Input() width: string = '25vw';
  @Input() visible: boolean = false;
  
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  MsgBotones = MsgBotones;
  MsgTipo = MsgTipo;

  show(): void {
    this.visible = true;
  }

  onHide(result: boolean): void {
    this.visible = false;
    this.close.emit(result);
  }
}
