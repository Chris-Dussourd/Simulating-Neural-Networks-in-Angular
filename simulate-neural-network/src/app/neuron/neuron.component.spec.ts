import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeuronComponent } from './neuron.component';

describe('NeuronComponent', () => {
  let component: NeuronComponent;
  let fixture: ComponentFixture<NeuronComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NeuronComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeuronComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
