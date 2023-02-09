import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {LayeredGraphDrawing} from "../helpers/dag-grid-organizer";
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


  constructor() {

  }

  ngOnInit(): void {
    this.initializeDag();
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
    const drawing = new LayeredGraphDrawing(graph);
    drawing.draw();
    this.drawing = drawing;
    console.log('Drawing', drawing);
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(200);

    for (const node of this.drawing.graph.keys()) {
      const dependsOn = this.drawing.graph.get(node);
      console.log('node', node, dependsOn)
      dependsOn.forEach((dn: string) => {
        console.log('dn', dn)
        const startingElement = document.querySelector(`#dependencyNode_${node}`);
        const endingElement = document.querySelector(`#dependencyNode_${dn}`);

        // @ts-ignore
        const line = new LeaderLine(startingElement, endingElement);
      })
    }
  }
}
