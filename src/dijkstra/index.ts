import isEmpty from "lodash/isEmpty";
import PriorityQueue, { Comparator } from "priorityqueuejs";

class Vertex {
  constructor(readonly name: string) {}
}

class Edge {
  constructor(readonly from: Vertex, readonly to: Vertex, readonly distance: number) {}
}

class Graph {
  /**
   * Keep track of best distances from source to given Vertex.
   */
  private bestDistances: Map<string, number> = new Map();
  /**
   * Keep track of paths from all Vertices to source via previous Vertex
   */
  private prevVertex: Map<string, Vertex> = new Map();
  /**
   * Keep track of all neighbours of all Vertices
   */
  private neighbours: Map<string, Edge[]> = new Map();

  /**
   * Constructs a graph with best distance to source optimized paths.
   * @param startV source Vertex, for which graph would be optimized with best distance
   * @param edges all edges, that would construct a Graph.
   */
  constructor(readonly startV: Vertex, readonly edges: Edge[]) {
    Graph.validateInput(startV, edges);

    const allVertices: Set<string> = new Set();

    for (const e of edges) {
      const from = e.from.name;
      if (this.neighbours.has(from)) {
        this.neighbours.set(from, [...this.neighbours.get(from)!, e]);
      } else {
        this.neighbours.set(from, [e]);
      }

      allVertices.add(from);
      allVertices.add(e.to.name);
    }

    for (const vName of allVertices) {
      this.bestDistances.set(vName, Infinity);
    }

    this.bestDistances.set(startV.name, 0);

    this.dijkstraShortPathAlgo();
  }

  /**
   * Prints path to given Vertex to Source.
   * @param v vertex to construct path to.
   */
  printPathTo(v: Vertex): string | undefined {
    if (v.name === this.startV.name) {
      return `Vertex(${v.name}) is a source`;
    }

    let prevVertex = this.prevVertex.get(v.name);

    if (!prevVertex) {
      return undefined;
    }

    let path = `Vertex(${v.name}) - total ${this.bestDistances.get(v.name)} away from source`;

    while (prevVertex) {
      path = `Vertex(${prevVertex.name}) -> ${path}`;

      prevVertex = this.prevVertex.get(prevVertex.name);
    }

    return path;
  }

  /**
   * Gives best distance from source to given Vertex if it is exist in graph.
   * @param v vertex to check.
   */
  shortestPathTo(v: Vertex): number | undefined {
    return this.bestDistances.get(v.name);
  }

  /**
   * Dijkstra's Algorithm finds best distance from source in a Graph.
   * In this algorithm implementation used Priority Queue.
   * No negative weight/distance allowed.
   * O(E log V) complexity, where E - number of Edges and V - number of Vertices.
   * Can be used in both directed and undirected graphs.
   */
  private dijkstraShortPathAlgo() {
    const comparator: Comparator<[Vertex, number]> =
      ([v1, bestDist1], [v2, bestDist2]) => bestDist2 - bestDist1;

    const q = new PriorityQueue(comparator);

    const visited: Set<string> = new Set();

    q.enq([this.startV, 0]);

    while (!q.isEmpty()) {
      const [vertexToCheck, bestDistSoFar] = q.deq();

      if (!this.neighbours.get(vertexToCheck.name)) {
        continue;
      }

      for (const neighbour of this.neighbours.get(vertexToCheck.name)!) {
        const distVertex = neighbour.to;

        if (visited.has(distVertex.name)) {
          continue;
        }

        const altDist = bestDistSoFar + neighbour.distance;
        if (altDist < this.bestDistances.get(distVertex.name)!) {
          this.bestDistances.set(distVertex.name, altDist);
          this.prevVertex.set(distVertex.name, vertexToCheck);
          q.enq([distVertex, altDist]);
        }
      }

      visited.add(vertexToCheck.name);
    }
  }

  /**
   * Basic input validation.
   * @param startV source Vertex.
   * @param edges all given edges, that would construct a Graph.
   */
  private static validateInput(startV: Vertex, edges: Edge[]) {
    if (isEmpty(edges)) {
      throw new Error("Edges should not be empty");
    }

    const fromVNames: string[] = edges.map(e => e.from.name);
    const toVNames: string[] = edges.map(e => e.to.name);

    if (!fromVNames.includes(startV.name) && !toVNames.includes(startV.name)) {
      throw new Error("Edges should include given start Vertex");
    }
  }
}

// TODO: create unit tests, instead of manual output tests.

/**
 *          B(1)
 *       / 1   \ 1
 *     /       \
 *  A(0) -3-  C(2)
 *   \        | 5
 * 10 \      D(7)
 *     \   / 4
 *      E(10)
 */
const vA = new Vertex("A");
const vB = new Vertex("B");
const vC = new Vertex("C");
const vD = new Vertex("D");
const vE = new Vertex("E");

const edges: Edge[] = [
  new Edge(vA, vB, 1),
  new Edge(vA, vC, 3),
  new Edge(vA, vE, 10),
  new Edge(vB, vC, 1),
  new Edge(vC, vD, 5),
  new Edge(vD, vE, 4)
];

const g = new Graph(vA, edges);

console.log(g.shortestPathTo(vA));
console.log(g.shortestPathTo(vB));
console.log(g.shortestPathTo(vC));
console.log(g.shortestPathTo(vD));
console.log(g.shortestPathTo(vE));

console.log(g.printPathTo(vA));
console.log(g.printPathTo(vB));
console.log(g.printPathTo(vC));
console.log(g.printPathTo(vD));
console.log(g.printPathTo(vE));
