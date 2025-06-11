import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-steps',
  standalone: true,
  imports: [StepsModule],
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css'
})
export class StepsComponent implements OnChanges {
  @Input() stepsCount: number = 0;
  @Input() activeIndex: number = 0;
  @Output() activeIndexChange = new EventEmitter<number>();

  itemsStep: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['stepsCount']) {
      this.generateSteps();
    }
  }

  generateSteps(): void {
    this.itemsStep = [];
    for (let i = 0; i < this.stepsCount; i++) {
      this.itemsStep.push({});
    }
  }

  onActiveIndexChange(event: number): void {
    this.activeIndexChange.emit(event);
  }
}
