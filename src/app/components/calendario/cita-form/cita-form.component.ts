import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-cita-form',
  templateUrl: './cita-form.component.html',
  styleUrls: ['./cita-form.component.css']
})
export class CitaFormComponent implements OnInit {

  model1: NgbDateStruct;
  model2: NgbDateStruct;
  selectedTimeInicio: { hour: number, minute: number } = { hour: 0, minute: 0 };
  selectedTimeFin: { hour: number, minute: number } = { hour: 0, minute: 0 };

  constructor() { 
  }

  ngOnInit(): void {
  }

}
