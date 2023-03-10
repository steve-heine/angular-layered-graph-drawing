export class LayeredGraphDrawing {
  private graph: Map<string, string[]>;
  private levels: Map<string, number>;
  private layerContents: Map<number, string[]>;

  constructor(graph: Map<string, string[]>) {
    this.graph = graph;
    this.levels = new Map<string, number>();
    this.layerContents = new Map<number, string[]>();
  }

  // Helper function to perform layer ranking
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

  // Helper function to perform vertex ordering
  private vertexOrdering(layer: number) {
    let nodes = this.layerContents.get(layer) || [];
    const sortable = [];
    for (const node of nodes) {
      let inDegree = 0;
      for (const [_, dependencies] of this.graph.entries()) {
        if (dependencies.includes(node)) inDegree += 1;
      }
      sortable.push([node, inDegree]);
    }

    // Sort nodes based on in-degree to reduce edge crossings
    // @ts-ignore
    sortable.sort((a, b) => a[1] - b[1]);
    // @ts-ignore
    nodes = sortable.map(node => node[0]);

    this.layerContents.set(layer, nodes);
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
