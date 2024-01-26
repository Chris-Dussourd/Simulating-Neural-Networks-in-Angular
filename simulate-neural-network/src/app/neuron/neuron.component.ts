import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Neuron } from 'src/app/neuron';
import { NetworkConfigurationService } from '../network-configuration.service';
import { Connection } from 'src/app/connection';

@Component({
  selector: 'app-neuron',
  templateUrl: './neuron.component.html',
  styleUrls: ['./neuron.component.css']
})
export class NeuronComponent {
  @Input() neuron: Neuron;
  selected: boolean = false; //Whether user selected the neuron
  potential: number;
	stimulationSubscription: Subscription;
  layerSpacing: number = 0; //Add spacing to make consistent with other layers in network

  constructor(public networkConfig: NetworkConfigurationService) {
    this.potential = 0;
  }

	ngOnInit(): void {
		this.stimulationSubscription = this.networkConfig.neuronStimulation$.subscribe((connection: Connection) => {
				if (connection.outputNeuron.id === this.neuron.id) {
          this.potential = this.potential + connection.weight*100;
          setTimeout(() => {
              if (this.potential >= 100) {
                this.potential = 0;
                this.networkConfig.fireNeuron(this.neuron.id);
            }
          }, 500);
        }
			});
    }

  ngOnDestroy(): void {
    this.stimulationSubscription.unsubscribe();
  }

}
