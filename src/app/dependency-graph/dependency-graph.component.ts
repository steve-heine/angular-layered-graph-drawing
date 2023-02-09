import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import 'leader-line';
import {DependencyGraphService} from "../services/dependency-graph.service";
declare let LeaderLine: any;
interface Graph {
  nodes: Node[];
  edges: Edge[];
}

interface Node {
  id: string;
  dependencies: string[];
}

interface Edge {
  from: string;
  to: string;
}


@Component({
  selector: 'app-dependency-graph',
  templateUrl: './dependency-graph.component.html',
  styleUrls: ['./dependency-graph.component.scss']
})
export class DependencyGraphComponent implements OnInit {
  showGraphData: boolean = true;
  nodeColors: Map <string, string> = new Map<string, string>();
  lines: any[] = [];
  selectedNode: string | null = null;
  constructor(private dependencyGraphService: DependencyGraphService) {
  }

  ngOnInit(): void {
    this.initializeDag();
    this.dependencyGraphService.selectedNode.subscribe(node=>{
      this.selectedNode = node;
    })
  }

  get layerContents(){
    return this.dependencyGraphService.layerContents;
  }

  get graph(){
    return this.dependencyGraphService.graph;
  }

  generateRandomColor(): string {
    // Generate 3 random values for red, green, and blue
    let r: number = Math.floor(Math.random() * 256);
    let g: number = Math.floor(Math.random() * 256);
    let b: number = Math.floor(Math.random() * 256);

    // Ensure that the color is easily viewable on a white background
    while (r + g + b > 500) {
      r = Math.floor(Math.random() * 256);
      g = Math.floor(Math.random() * 256);
      b = Math.floor(Math.random() * 256);
    }

    // Convert the values to hex format
    let rHex: string = r.toString(16).padStart(2, '0');
    let gHex: string = g.toString(16).padStart(2, '0');
    let bHex: string = b.toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  }

  async initializeDag() {

    const graph: Map<string, string[]> = new Map<string, string[]>();
    graph.set('A', []);
    graph.set('B', ['A']);
    graph.set('C', ['A']);
    graph.set('D', ['B', 'C']);
    graph.set('E', ['B', 'C']);
    graph.set('F', ['A']);
    graph.set('G',['B','A'])
    graph.set('5' ,['A']);
    graph.set('H',['F'])
    graph.set('Y',['D'])
    graph.set('Z', ['B','C','E'])
    this.dependencyGraphService.initGraph(graph);
    this.dependencyGraphService.draw();
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(200);
    this.nodeColors = new Map<string, string>();
    for (const node of this.graph.keys()) {
      this.nodeColors.set(node, this.generateRandomColor())
    }
    this.redrawAllLines();


  }

  hideOtherLines(node: string) {
      this.redrawAllLines(node);
  }

  removeAllLines(){
    this.lines.forEach((line)=>{
      try {
        line.remove();
      }catch{
        //ignore errors
      }
    })

  }


  redrawAllLines(node?: string | null) {
    this.removeAllLines()
    const graphNodes = node || this.graph.keys();
    //Draw lines
    for (const node of graphNodes) {
      const dependsOn = this.graph.get(node);
      console.log('node', node, dependsOn)
      // @ts-ignore
      dependsOn.forEach((dn: string) => {
        console.log('dn', dn)
        const startingElement = document.querySelector(`#dependencyNode_${node}`);
        const endingElement = document.querySelector(`#dependencyNode_${dn}`);
        // @ts-ignore
        const line = new LeaderLine(startingElement, endingElement,{
          startPlugColor: this.nodeColors.get(node),
          endPlugColor: this.nodeColors.get(dn),
          gradient: true
        });
        this.lines.push(line);
      })
    }
  }

  setSelectedNode(node: string) {
    this.dependencyGraphService.selectedNode.next((this.selectedNode === node)? null : node);
  }
}
