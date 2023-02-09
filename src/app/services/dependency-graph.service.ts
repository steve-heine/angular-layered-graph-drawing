import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
@Injectable({
  providedIn: 'root'
})
export class DependencyGraphService {
  graph: Map<string, string[]> = new Map<string, string[]>();
  levels: Map<string, number> = new Map<string, number>;
  layerContents: Map<number, string[]> = new Map<number, string[]>();

  selectedNode: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  constructor() { }
  initGraph(graph: Map<string, string[]>){
    this.graph = graph;
    this.levels = new Map<string, number>();
    this.layerContents = new Map<number, string[]>();
  }
  private layerRanking() {
    // Assign level 0 to nodes with no upstream dependencies (root nodes)
    for (const node of this.graph.keys()) {
      // @ts-ignore
      if (!this.levels.has(node) && !this.graph.get(node).length) {
        this.levels.set(node, 0);
      }
    }

    // Traverse the graph to determine level for each node
    let change = true;
    while (change) {
      change = false;
      for (const [node, dependencies] of this.graph.entries()) {
        let allDependenciesAssigned = true;
        let maxLevel = 0;
        for (const dependency of dependencies) {
          if (!this.levels.has(dependency)) {
            allDependenciesAssigned = false;
            break;
          } else {
            // @ts-ignore
            maxLevel = Math.max(maxLevel, this.levels.get(dependency));
          }
        }
        if (allDependenciesAssigned && !this.levels.has(node)) {
          this.levels.set(node, maxLevel + 1);
          change = true;
        }
      }
    }
  }

  private sortByMedianHeuristicSweeps(layer: string[]) {
    layer.sort((a, b) => {
      let posA = 0;
      let posB = 0;
      for (const [i, l] of this.layerContents.entries()) {
        if (l.includes(a)) {
          posA = i;
        }
        if (l.includes(b)) {
          posB = i;
        }
      }
      const dependenciesA = this.graph.get(a) || [];
      const dependenciesB = this.graph.get(b) || [];
      const medianA = this.median(layer, dependenciesA, posA);
      const medianB = this.median(layer, dependenciesB, posB);
      return medianA - medianB;
    });
  }

  private median(layer: string[], dependencies: string[], pos: number) {
    let median = 0;
    for (const d of dependencies) {
      if (layer.includes(d)) {
        median += layer.indexOf(d);
      } else {
        // @ts-ignore
        median += this.layerContents.get(pos - 1).indexOf(d);
      }
    }
    return median / dependencies.length;
  }




  public draw() {
    this.layerRanking();
    for (const [node, level] of this.levels.entries()) {
      if (!this.layerContents.has(level)) {
        this.layerContents.set(level, []);
      }
      // @ts-ignore
      this.layerContents.get(level).push(node);
    }

    for (const layer of this.layerContents.keys()) {
      //this.vertexOrdering(layer);
      let nodes = this.layerContents.get(layer) || [];
      this.sortByMedianHeuristicSweeps(nodes);

    }
  }
}
