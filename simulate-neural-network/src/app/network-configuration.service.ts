import { Injectable } from "@angular/core";
import { Neuron } from "./neuron";
import { BehaviorSubject, Observable } from "rxjs";
import { Connection } from "./connection";

@Injectable({
	providedIn: 'root',
})
/**
 * Constants used in defining how the network operates
 */
export class NetworkConfigurationService {
  callstack: number = 0;
  private neuronsArray: Array<Neuron> = new Array<Neuron>(); //neurons in Neural Network
  private connectionsArray: Array<Connection> = new Array<Connection>(); //connections in Neural Network
  private emptyNeuron = new Neuron(-1);
  private emptyConnection = new Connection(0, this.emptyNeuron, this.emptyNeuron, -1);

  //Send out updates on when the neuron component has been created
	private connectionSubject$ = new BehaviorSubject<Connection>(this.emptyConnection);
	connections$ = this.connectionSubject$.asObservable();

  //Send out updates of new connections forming and removing - send the observable to subscribe to
	private neuronCreatedSubject$ = new BehaviorSubject<number>(-1);
	neuronCreated$ = this.neuronCreatedSubject$.asObservable();

  //Create maps that store Behavior Subject/Observable for each neuron firing
	private neuronStimulationSubjectMap = new Map();
	neuronStimulationMap = new Map();

	constructor() {}

  addNeuron(id: number): Neuron {
    let neuron = new Neuron(id);

    this.neuronsArray.push(neuron);

    //Create an observable that tracks if this neuron fires
    let neuronBehaviorSubject = new BehaviorSubject<number>(1);
    this.neuronStimulationSubjectMap.set(id, neuronBehaviorSubject);
    this.neuronStimulationMap.set(id, neuronBehaviorSubject.asObservable())
    return neuron;
  }

  neuronCreated(id: number) {
    this.neuronCreatedSubject$.next(id);
  }

  removeNeuron(removeNeuron: Neuron, sendMessage: boolean = false) {
    //TODO: Close behavior subject
    //Emit that the connection is being removed
    this.connectionsArray
      .forEach((connection) => {
        if (removeNeuron.id === connection.inputNeuron.id || removeNeuron.id === connection.outputNeuron.id) {
          this.connectionSubject$.next(connection);
        }
      });
    //Remove the connection to and from this neuron
    this.connectionsArray = this.connectionsArray
      .filter((connection) =>
        removeNeuron.id !== connection.inputNeuron.id && removeNeuron.id !== connection.outputNeuron.id
      );
    this.neuronsArray = this.neuronsArray.filter((neuron) => neuron.id !== removeNeuron.id);
  }

  addConnection(id: number, inputNeuron: Neuron, outputNeuron: Neuron, weight: number): Connection {
    let connection = new Connection(id, inputNeuron, outputNeuron, weight);
    this.connectionSubject$.next(connection);
    this.connectionsArray.push(connection);
    return connection;
  }

  removeConnection(removeConnection: Connection, sendMessage: boolean = false) {
    this.connectionsArray = this.connectionsArray.filter((connection) => connection.id !== removeConnection.id);
    if (sendMessage) this.connectionSubject$.next(removeConnection);
  }

  updateConnectionWeight(connection: Connection, newWeight: number) {
    if (connection != undefined) connection.weight = +newWeight;
  }

  fireNeuron(neuronId: number) {
    this.callstack++;
    if (this.callstack > 1000) {
      //Use setTimeout to generate new call stack and prevent maximum call stack exceeded error
      setTimeout(() => {
        this.callstack = 0;
        let neuronBehaviorSubject = this.neuronStimulationSubjectMap.get(neuronId) as BehaviorSubject<number>;
        neuronBehaviorSubject.next(1);
      }, 0)
    }
    else {
      this.callstack++;
      let neuronBehaviorSubject = this.neuronStimulationSubjectMap.get(neuronId) as BehaviorSubject<number>;
      neuronBehaviorSubject.next(1);
    }
  }

  clearNetwork() {
    this.neuronsArray = new Array<Neuron>(); //neurons in Neural Network
    this.connectionsArray = new Array<Connection>(); //connections in Neural Network
    this.neuronStimulationSubjectMap.clear();
    this.neuronStimulationMap.clear();
  }

  getNeuronObservable$(id: number): Observable<number> {
    let test = this.neuronStimulationMap.get(id);
    return test;
  }
}
