
import { Neuron } from "./neuron";

//Defines a connection between two neurons
export class Connection {
  id: number;
	inputNeuron: Neuron;
  outputNeuron: Neuron;
  weight: number; //How strong the connection is between the two neurons

  constructor(id: number, inputNeuron: Neuron, outputNeuron: Neuron, weight: number) {
    this.id = id;
    this.inputNeuron = inputNeuron;
    this.outputNeuron = outputNeuron;
    this.weight = weight;
  }
}
