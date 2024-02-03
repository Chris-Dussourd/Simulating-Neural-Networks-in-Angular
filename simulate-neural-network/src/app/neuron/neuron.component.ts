import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Neuron } from 'src/app/neuron';
import { NetworkConfigurationService } from '../network-configuration.service';
import { Connection } from 'src/app/connection';

@Component({
  selector: 'neuron',
  templateUrl: './neuron.component.html',
  styleUrls: ['./neuron.component.css']
})
export class NeuronComponent implements OnInit, OnDestroy {
  @Input() neuron: Neuron;
  //potential: number;
  connectionSubscription: Subscription;
  stimulationSubscription: Subscription;
	stimulationSubscriptionArray: Subscription[];

  constructor(public networkConfig: NetworkConfigurationService) {
    //this.potential = 0;
  }

	ngOnInit(): void {
		this.connectionSubscription = this.networkConfig.connections$.subscribe((connection: Connection) => {
      if (connection.outputNeuron.id === this.neuron.id) {
        //Subscribe to the input neuron's observable
        this.stimulationSubscription = this.networkConfig.getNeuronObservable$(connection.inputNeuron.id)
          .subscribe((val: number) => {
            //this.potential = this.potential + connection.weight*100;
            this.networkConfig.fireNeuron(this.neuron.id);
            // setTimeout(() => {
            //     if (this.potential >= 100) {
            //       this.potential = 0;
            //       this.networkConfig.fireNeuron(this.neuron.id);
            //   }
            // }, 500);
        });
        this.stimulationSubscriptionArray.push(this.stimulationSubscription);
      }
    });

    this.networkConfig.neuronCreated(this.neuron.id);
  }

  ngOnDestroy(): void {
    this.connectionSubscription.unsubscribe();
    this.stimulationSubscriptionArray.forEach((sub) => sub.unsubscribe());
  }

}
