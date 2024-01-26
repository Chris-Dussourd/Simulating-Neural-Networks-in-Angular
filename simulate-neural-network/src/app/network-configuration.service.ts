import { Injectable } from "@angular/core";
import { Neuron } from "./neuron";
import { BehaviorSubject } from "rxjs";
import { Connection } from "./connection";

@Injectable({
	providedIn: 'root',
})
/**
 * Constants used in defining how the network operates
 */
export class NetworkConfigurationService {
  private neuronsArray: Array<Neuron> = new Array<Neuron>(); //neurons in Neural Network
  private connectionsArray: Array<Connection> = new Array<Connection>(); //connections in Neural Network
	private neuronStimulationSubject$ = new BehaviorSubject<Connection>(new Connection(-1, new Neuron(-1), new Neuron(-1),  0));
	neuronStimulation$ = this.neuronStimulationSubject$.asObservable();
  //Send out udpates to layers, neurons, and connections
	private neuronSubject$ = new BehaviorSubject<Array<Neuron>>([]);
	neurons$ = this.neuronSubject$.asObservable();
	private connectionSubject$ = new BehaviorSubject<Array<Connection>>([]);
	connections$ = this.connectionSubject$.asObservable();

	constructor() {
	}

  addNeuron(id: number): Neuron {
    let neuron = new Neuron(id);

    this.neuronsArray.push(neuron);
    this.neuronSubject$.next(this.neuronsArray);
    return neuron;
  }

  removeNeuron(removeNeuron: Neuron, sendMessage: boolean = false) {
    //Remove the connection to and from this neuron
    this.connectionsArray = this.connectionsArray
      .filter((connection) =>
        removeNeuron.id !== connection.inputNeuron.id && removeNeuron.id !== connection.outputNeuron.id
      );
    this.neuronsArray = this.neuronsArray.filter((neuron) => neuron.id !== removeNeuron.id);
    this.neuronSubject$.next(this.neuronsArray);
    this.connectionSubject$.next(this.connectionsArray);
  }

  addConnection(id: number, inputNeuron: Neuron, outputNeuron: Neuron, weight: number): Connection {
    let connection = new Connection(id, inputNeuron, outputNeuron, weight);
    this.connectionsArray.push(connection);
    this.connectionSubject$.next(this.connectionsArray);
    return connection;
  }

  removeConnection(removeConnection: Connection, sendMessage: boolean = false) {
    this.connectionsArray = this.connectionsArray.filter((connection) => connection.id !== removeConnection.id);
    if (sendMessage) this.connectionSubject$.next(this.connectionsArray);
  }

  updateConnectionWeight(connection: Connection, newWeight: number) {
    if (connection != undefined) connection.weight = +newWeight;
  }

  fireNeuron(neuronId: number) {
    this.connectionsArray
      .filter((connection) => connection.inputNeuron.id === neuronId)
      .forEach((connection) => {
        this.neuronStimulationSubject$.next(connection);
      });
  }

  clearNetwork() {
    this.neuronsArray = new Array<Neuron>(); //neurons in Neural Network
    this.connectionsArray = new Array<Connection>(); //connections in Neural Network
  }
}
