import {Component, OnInit} from '@angular/core';
import {DependencyGraphService} from "../services/dependency-graph.service";

@Component({
  selector: 'app-dependency-node-manager',
  templateUrl: './dependency-node-manager.component.html',
  styleUrls: ['./dependency-node-manager.component.scss']
})
export class DependencyNodeManagerComponent implements OnInit{

  nodeDetails: {dependencies: string[] | undefined,
              selectedNode: string} = {
    dependencies: undefined,
    selectedNode: ''
  };
  constructor(private dependencyGraphService: DependencyGraphService) {}

  ngOnInit(): void {
    this.dependencyGraphService.selectedNode.subscribe(node=>{
      this.nodeDetails = {
        selectedNode: node!,
        dependencies: this.dependencyGraphService.graph.get(node!)
      };

    })
  }


}
