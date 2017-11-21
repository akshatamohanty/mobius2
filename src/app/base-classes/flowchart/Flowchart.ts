//
//	Flowchart class 
//  Implement IFlowchart
//	
//

import {IFlowchart} from './IFlowchart';
import {IGraphNode} from '../nodes/IGraphNode';

class Flowchart implements IFlowchart{
		
	private _author: string; 

	private _nodes: IGraphNode[] = [];
	private _edges: any = [];

	private _sortOrder: number[];
	private _selected: number;

	//
	//	constructor needs 2 arguments  - username and icodegenerator
	//
	constructor(username: string){ 
		this._author = username; 
	};

	//	gets author of the flowchart
	getAuthor(): string{
		return this._author;
	}

	//	Summary of flowchart
	getDetails(): string{
		return "This is a flowchart, with " + this._nodes.length + " nodes, written by " + this._author;
	}

	//
	//	Maintains the node order for execution
	//
	addNode(node?: IGraphNode): number{

		if( node == undefined ){
			//todo: create new node
		}

		// a new node will have no dependencies - hence push index to end of _nodeTree
		this._nodes.push(node);

		return this._nodes.length;
	};

	addEdge(outputNode: number[], inputNode: number[]): number{

		if(outputNode.length !== 2 || inputNode.length !== 2){
			throw Error("Invalid arguments for edge");
		}

		// todo: check for valid input/output addresses and port address
		this._edges.push( [ outputNode, inputNode ] );

		return this._edges.length;
	};

	deleteNode(nodeIndex: number): number{

		// todo: check for valid node index
		this._nodes.splice(nodeIndex, 1);

		return this._nodes.length;
	}

	deleteEdge(edgeIndex: number): void{

		// todo: check for valid edge index
		this._edges.splice(edgeIndex, 1);

		return this._edges.length;
	}

	getNodes(): IGraphNode[]{ 
		return this._nodes;
	}

	getEdges(): number[][]{ 
		return this._edges;
	}

	//
	//	Get node by index in flowchart
	//	todo: fix
	//
	getNodeByIndex(index: number): IGraphNode{
		return this._nodes[index];
	}

	getEdgeByIndex(index: number): number[][]{
		return this._edges[index];
	}

	resetAllNodes(): void{
		for(let n=0; n < this._nodes.length; n++){
			this._nodes[n].reset();
		}
	}

	//
	//	executes the flowchart
	//
	execute() :any{

		// set all nodes to status not executed
		// future: cache results and set status based on changes
		this.resetAllNodes();

		// sort nodes 
		let sorted_nodes: IGraphNode[] = this.sortNodesByRank(this._nodes);

		// execute each node
		// provide input to next 
		let timeStarted	:number = (new Date()).getTime();
		for( let nc=0; nc < sorted_nodes.length; nc++ ){

			let node = sorted_nodes[nc]

			// check status of the node; don't rerun
			if( node.getStatus() == 1 ){
				continue;
			}

			this.executeNode(node);
			console.log(node.getName(), node.getValue());
		}

		return true;
	}

	executeNode(node: IGraphNode){

		console.log("Executing ", node.getName());
		
		let params :any = null;

		if( node.isIndependent() == false ){
			params = {};
			let dependencies :any = node.getDependencies();

			for(let d=0; d < dependencies.length; d++){
				// dependencies are stored as an array of arrays - [ [], [], [] ]
				// the 0th index stores the node, the 1st index stores the port number
				let parent_node = this.getNode(dependencies[d][0]); 
				if(parent_node.getStatus() == 1){
					let source_port = parent_node.getOutputByIndex(dependencies[d][1]);
					let my_port = node.getInputByIndex(dependencies[d][2]);
					params[my_port.getName()]  = source_port.getValue();
					my_port.setValue(source_port.getValue());
				}
			}
		}
		
		node.executeNode(this.code_generator, params);

	}

	sortNodesByRank(nodes: IGraphNode[]): IGraphNode[]{

		let ranked: any[] = [];
		let sorted: IGraphNode[] = [];

		for(let i=0; i < nodes.length; i++){

			let node :IGraphNode = nodes[i];
			let rank :number = node.rank();
			console.log(node.getName(), rank)

			if( ranked[rank] == undefined){
				ranked[rank] = [];
			}
			ranked[rank].push(node);
		}

		let all_ranks = Object.keys(ranked).map(function(num){ return parseInt(num); }).sort();
		for( let r=0; r < all_ranks.length; r++){
			let rank = all_ranks[r];
			let nodes_with_rank = ranked[rank];
			sorted = sorted.concat(nodes_with_rank);
		}

		return sorted;
	}


	save(): string{
		return JSON.stringify(this);
	}
}