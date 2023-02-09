import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {LayeredGraphDrawing} from "../helpers/layerd-grawph-drawing";
import 'leader-line';
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
  drawing: any = null;
  showGraphData: boolean = true;
  nodeColors: Map <string, string> = new Map<string, string>();
  lines: any[] = [];
  constructor() {
  }

  ngOnInit(): void {
    this.initializeDag();
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
    const drawing = new LayeredGraphDrawing(graph);
    drawing.draw();
    this.drawing = drawing;
    console.log('Drawing', drawing);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(200);
    this.nodeColors = new Map<string, string>();
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
    const graphNodes = node || this.drawing.graph.keys();
    //Draw lines
    for (const node of graphNodes) {
      this.nodeColors.set(node, this.generateRandomColor())
      const dependsOn = this.drawing.graph.get(node);
      console.log('node', node, dependsOn)
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
}
