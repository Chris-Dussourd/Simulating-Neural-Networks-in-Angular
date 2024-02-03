import { Component, OnDestroy, OnInit } from '@angular/core';
import { Neuron } from '../neuron';
import { Connection } from '../connection';
import { NetworkConfigurationService } from '../network-configuration.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  neuronCount: string; //number of neurons in network
  totalTime: number; //time to transverse the network
  intervalId: NodeJS.Timeout;
  neurons: Array<Neuron> = []
  connections: Array<Connection> = [];
  loaded: boolean = false;
	stimulationSubscription: Subscription;
  neuronCreatedSubscription: Subscription;
  networkCreated: boolean;
  finalNeuronStimulated: boolean;
  constructor(public networkConfig: NetworkConfigurationService) {
  }

  ngOnInit(): void {
    this.networkConfig.clearNetwork();
    this.loaded = true;
    this.totalTime = 0;

    this.neuronCreatedSubscription = this.networkConfig.neuronCreated$
      .subscribe((id: number) => {
        if (id > 0) {
          this.connections.push(this.networkConfig.addConnection(id, this.neurons[id-1], this.neurons[id], 1));
        }
        if (id === +this.neuronCount) {
          this.networkCreated = true;
          this.finalNeuronStimulated = false;
        }
      })
  }

  createNetwork() {
    this.networkCreated = false;
    this.networkConfig.clearNetwork();
    this.neurons.push(this.networkConfig.addNeuron(0)); //base neuron
    //Create Network in Series for now
    for(let num=1; num<=+this.neuronCount; num++) {
      this.neurons.push(this.networkConfig.addNeuron(num));
    }
    //Subscribe to last neuron in network
		this.stimulationSubscription = this.networkConfig.getNeuronObservable$(+this.neuronCount)
      .subscribe((val: number) => {
        clearInterval(this.intervalId);
        this.finalNeuronStimulated = true;
    });
  }

  stimulateBaseNeuron() {
    this.finalNeuronStimulated = false;
    this.totalTime = 0;
    //Create timer to see how long it takes to transverse network
    this.intervalId = setInterval(() => {
      this.totalTime += 1;
    }, 1000);

    this.networkConfig.fireNeuron(0);
  }

  ngOnDestroy(): void {
    this.stimulationSubscription.unsubscribe();
  }
}
