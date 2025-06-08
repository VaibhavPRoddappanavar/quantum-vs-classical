"use client";

import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";

/**
 * Shortest Path Visualizer
 *
 * Visualizes the shortest path problem in an unweighted graph using BFS (classical)
 * and a quantum-inspired approach (simulated). Uses Cytoscape.js for visualization.
 */
// Directed graph with multiple branches and at least one dead-end
const defaultElements = [
  // Nodes
  { data: { id: "A", label: "A" } },
  { data: { id: "B", label: "B" } },
  { data: { id: "C", label: "C" } },
  { data: { id: "D", label: "D" } },
  { data: { id: "E", label: "E" } },
  { data: { id: "F", label: "F" } },
  { data: { id: "G", label: "G" } },
  { data: { id: "H", label: "H" } }, // dead-end node
  // Edges
  { data: { id: "AB", source: "A", target: "B" } }, // dead-end branch
  { data: { id: "AC", source: "A", target: "C" } }, // correct branch
  { data: { id: "BH", source: "B", target: "H" } }, // B -> H (dead-end)
  { data: { id: "CD", source: "C", target: "D" } },
  { data: { id: "DE", source: "D", target: "E" } },
  { data: { id: "EG", source: "E", target: "G" } }, // shortcut for quantum
  { data: { id: "DF", source: "D", target: "F" } }, // detour
  { data: { id: "FG", source: "F", target: "G" } },
];

const ShortestPathVisualizer = ({ onComplete }) => {
  const cyRef = useRef(null);
  const containerRef = useRef(null);
  const [elements, setElements] = useState(defaultElements);
  // Set start/end to maximize difference (A to G)
  const [startNode, setStartNode] = useState("A");
  const [endNode, setEndNode] = useState("G");
  // Stores the final shortest path
  const [dfsPath, setDfsPath] = useState([]);
  // Stores the full DFS exploration order (nodes/edges visited, including dead-ends)
  const [dfsExploration, setDfsExploration] = useState([]);
  const [quantumPath, setQuantumPath] = useState([]);
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("dfs"); // "dfs" or "quantum"
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Initialize Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;
    cyRef.current = cytoscape({
      container: containerRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#6366f1",
            label: "data(label)",
            color: "#fff",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "18px",
          },
        },
        {
          selector: "edge",
          style: {
            width: 4,
            "line-color": "#a5b4fc",
            "target-arrow-color": "#a5b4fc",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
        {
          selector: ".highlighted",
          style: {
            "background-color": "#22d3ee",
            "line-color": "#22d3ee",
            "target-arrow-color": "#22d3ee",
            "transition-property": "background-color, line-color, target-arrow-color",
            "transition-duration": "0.5s",
          },
        },
        {
          selector: ".backtrack",
          style: {
            "background-color": "#f59e42",
            "line-color": "#f59e42",
            "target-arrow-color": "#f59e42",
          },
        },
        {
          selector: ".deadend",
          style: {
            "background-color": "#ef4444",
            "line-color": "#ef4444",
            "target-arrow-color": "#ef4444",
          },
        },
        {
          selector: ".path",
          style: {
            "background-color": "#22c55e",
            "line-color": "#22c55e",
            "target-arrow-color": "#22c55e",
          },
        },
      ],
      layout: { name: "circle" },
    });
    return () => cyRef.current?.destroy();
  }, [elements]);

  // Visually distinct highlighting for BFS vs Quantum-inspired
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass("highlighted path backtrack deadend");
    if (mode === "dfs") {
      // Animate the full DFS exploration, including dead-ends and backtracking
      let exploration = dfsExploration;
      for (let i = 0; i <= step && i < exploration.length; i++) {
        const action = exploration[i];
        if (action.type === 'explore') {
          const fromEl = cy.getElementById(action.from);
          const toEl = cy.getElementById(action.to);
          if (fromEl) fromEl.addClass("highlighted");
          if (toEl) toEl.addClass("highlighted");
          // Only highlight the edge if it is actually explored (not just A→B by default)
          const edge = cy.edges().filter(e => (
            e.data("source") === action.from && e.data("target") === action.to
          ));
          if (edge.length > 0) edge.addClass("highlighted");
        } else if (action.type === 'backtrack') {
          const fromEl = cy.getElementById(action.from);
          if (fromEl) fromEl.addClass("backtrack");
          const edge = cy.edges().filter(e => (
            e.data("source") === action.from && e.data("target") === action.to
          ));
          edge.addClass("backtrack");
        } else if (action.type === 'deadend') {
          const nodeEl = cy.getElementById(action.node);
          if (nodeEl) nodeEl.addClass("deadend");
        }
      }
      // After all exploration steps, highlight the final path
      if (step >= dfsExploration.length && dfsPath.length > 0) {
        dfsPath.forEach((id, i) => {
          const el = cy.getElementById(id);
          if (el) el.addClass("path");
          if (i > 0) {
            const prev = dfsPath[i - 1];
            const edge = cy.edges().filter(e => (
              e.data("source") === prev && e.data("target") === id
            ));
            if (edge.length > 0) edge.addClass("path");
          }
        });
      }
    } else {
      // Quantum-inspired: highlight all nodes in the current layer (parallel)
      let layers = [];
      let graph = {};
      elements.forEach(el => {
        if (el.data && el.data.id && !el.data.source) graph[el.data.id] = [];
      });
      elements.forEach(el => {
        if (el.data && el.data.source && el.data.target) {
          graph[el.data.source].push(el.data.target);
        }
      });
      let visited = new Set([startNode]);
      let currentLayer = [startNode];
      layers.push([startNode]);
      let found = false;
      while (!found && currentLayer.length > 0) {
        let nextLayer = [];
        for (let node of currentLayer) {
          for (let neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              nextLayer.push(neighbor);
              if (neighbor === endNode) found = true;
            }
          }
        }
        if (nextLayer.length > 0) layers.push([...nextLayer]);
        currentLayer = nextLayer;
      }
      // Highlight all nodes in current layer (step = layer index)
      for (let i = 0; i <= step && i < layers.length; i++) {
        for (let node of layers[i]) {
          const el = cy.getElementById(node);
          if (el) el.addClass("highlighted");
        }
      }
      // Highlight shortcut edge if found
      if (step === layers.length - 1 && quantumPath.length > 0) {
        quantumPath.forEach((id, i) => {
          const el = cy.getElementById(id);
          if (el) el.addClass("path");
          if (i > 0) {
            const prev = quantumPath[i - 1];
            const edge = cy.edges().filter(e => (
              (e.data("source") === prev && e.data("target") === id) ||
              (e.data("target") === prev && e.data("source") === id)
            ));
            edge.addClass("path");
          }
        });
      }
    }
  }, [step, mode, dfsPath, dfsExploration, quantumPath, startNode, endNode]);

  // DFS algorithm: returns both the path and full exploration order
  // DFS with explicit backtracking and dead-end tracking
  const runDFS = React.useCallback(() => {
    const graph = {};
    elements.forEach(el => {
      if (el.data && el.data.id && !el.data.source) graph[el.data.id] = [];
    });
    elements.forEach(el => {
      if (el.data && el.data.source && el.data.target) {
        graph[el.data.source].push(el.data.target);
      }
    });
    let stack = [[startNode]];
    let visited = new Set();
    let exploration = [];
    let foundPath = [];
    let inPath = new Set();
    let finished = false;
    function dfs(path) {
      let node = path[path.length - 1];
      inPath.add(node);
      if (path.length > 1) {
        exploration.push({ type: 'explore', from: path[path.length - 2], to: node });
      }
      if (node === endNode && !finished) {
        foundPath = [...path];
        finished = true;
        inPath.delete(node);
        return true;
      }
      visited.add(node);
      let hasUnvisited = false;
      for (let neighbor of graph[node]) {
        if (!visited.has(neighbor) && !inPath.has(neighbor)) {
          hasUnvisited = true;
          if (dfs([...path, neighbor])) {
            inPath.delete(node);
            return true;
          }
        }
      }
      if (!hasUnvisited) {
        // Dead-end
        if (node !== endNode) {
          exploration.push({ type: 'deadend', node });
        }
      }
      if (path.length > 1) {
        exploration.push({ type: 'backtrack', from: node, to: path[path.length - 2] });
      }
      inPath.delete(node);
      return false;
    }
    dfs([startNode]);
    return { path: foundPath, exploration };
  }, [elements, startNode, endNode]);

  // Quantum-inspired: Simulate a parallel exploration (for demo)
  const runQuantum = React.useCallback(() => {
    // Simulate quantum parallelism: explore all neighbors at each step
    const graph = {};
    elements.forEach(el => {
      if (el.data && el.data.id && !el.data.source) graph[el.data.id] = [];
    });
    elements.forEach(el => {
      if (el.data && el.data.source && el.data.target) {
        graph[el.data.source].push(el.data.target);
        // Directed graph: do not add the reverse edge
      }
    });
    let layers = [[startNode]];
    let visited = new Set([startNode]);
    let parent = {};
    let found = false;
    // Each layer simulates a 'quantum step' (parallel)
    while (layers.length && !found) {
      let nextLayer = [];
      for (let node of layers[layers.length - 1]) {
        for (let neighbor of graph[node]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            parent[neighbor] = node;
            nextLayer.push(neighbor);
            if (neighbor === endNode) {
              found = true;
            }
          }
        }
      }
      if (nextLayer.length > 0) layers.push(nextLayer);
    }
    // Reconstruct path
    let path = [];
    let current = endNode;
    while (current && current !== startNode) {
      path.push(current);
      current = parent[current];
    }
    if (current === startNode) path.push(startNode);
    path.reverse();
    return path;
  }, [elements, startNode, endNode]);

  // On mount or when input changes, compute paths
  useEffect(() => {
    const dfsResult = runDFS();
    setDfsPath(dfsResult.path || []);
    setDfsExploration(dfsResult.exploration || []);
    setQuantumPath(runQuantum());
    setStep(0);
    setSimulationComplete(false);
  }, [elements, startNode, endNode, runDFS, runQuantum]);

  // Step through the path
  const stepForward = () => {
    if (mode === "dfs") {
      // dfsExploration + 1 for final path step
      if (step < dfsExploration.length + (dfsPath.length > 0 ? 1 : 0) - 1) {
        setStep(step + 1);
      }
    } else {
      // quantum: quantumLayers + 1 for final path step
      let quantumLayers = getQuantumLayers(elements, startNode, endNode);
      if (step < quantumLayers.length + (quantumPath.length > 0 ? 1 : 0) - 1) {
        setStep(step + 1);
      }
    }
  };


  const stepBackward = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const reset = () => {
    setStep(0);
    setSimulationComplete(false);
  };

  return (
    <div className="bg-black/30 p-6 rounded-lg border border-indigo-500/30">
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/simulator';
          }
        }}
        className="mb-4 px-4 py-2 bg-indigo-900 text-indigo-100 rounded hover:bg-indigo-700 transition-colors flex items-center"
        style={{ fontWeight: 600, fontSize: 16 }}
        aria-label="Go Back"
      >
        <span style={{ fontSize: 22, marginRight: 8 }}>←</span> Back
      </button>
      <h2 className="text-2xl font-bold mb-4 text-white font-orbitron">Shortest Path Visualizer</h2>
      <div className="mb-4 p-4 bg-indigo-900/40 rounded-lg text-white">
        <strong>How to use:</strong><br />
        <span className="text-indigo-200">DFS (Classical):</span> Explores as deep as possible along each branch before backtracking. You will see DFS go down dead-ends before finding the goal.<br />
        <span className="text-indigo-200">Quantum-inspired:</span> Explores all nodes at each layer in parallel, reaching the destination with fewer steps.<br />
        <span className="text-indigo-300 italic">Step through each mode to see the difference in exploration and efficiency!</span>
      </div>
      <div className="flex space-x-8 mb-4">
        <div>
          <label className="block text-white mb-1">Start Node</label>
          <select value={startNode} onChange={e => setStartNode(e.target.value)} className="p-2 rounded bg-indigo-950 text-white border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {elements.filter(el => el.data && !el.data.source).map(el => (
              <option key={el.data.id} value={el.data.id}>{el.data.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-1">End Node</label>
          <select value={endNode} onChange={e => setEndNode(e.target.value)} className="p-2 rounded bg-indigo-950 text-white border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {elements.filter(el => el.data && !el.data.source).map(el => (
              <option key={el.data.id} value={el.data.id}>{el.data.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-white mb-1">Mode</label>
          <select value={mode} onChange={e => { setMode(e.target.value); setStep(0); setSimulationComplete(false); }} className="p-2 rounded bg-indigo-950 text-white border border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="dfs">Classical (DFS)</option>
            <option value="quantum">Quantum-inspired</option>
          </select>
        </div>
      </div>
      <div ref={containerRef} style={{ width: "100%", height: 400, background: "#18181b", borderRadius: 12, marginBottom: 24 }} />
      <div className="flex space-x-4 justify-center">
        <button onClick={stepBackward} disabled={step === 0} className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50">Prev</button>
        <button onClick={reset} className="px-4 py-2 bg-gray-700 text-white rounded">Reset</button>
        <button
          onClick={stepForward}
          disabled={(() => {
            if (mode === "dfs") {
              return step >= dfsExploration.length + (dfsPath.length > 0 ? 1 : 0) - 1;
            } else {
              // Quantum: steps = layers + 1 (for final path)
              let quantumLayers = getQuantumLayers(elements, startNode, endNode);
              return step >= quantumLayers.length + (quantumPath.length > 0 ? 1 : 0) - 1;
            }
          })()}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >Next</button>
      </div>
      {/* Narration Box */}
      <div className="mt-4 mb-2 p-4 rounded bg-indigo-800/80 text-white min-h-[56px]">
        {mode === "dfs" ? (
          step < dfsExploration.length ? (
            (() => {
              const action = dfsExploration[step];
              if (!action) return null;
              if (action.type === 'explore') return <span>DFS explores <b>{action.to}</b> from <b>{action.from}</b>.</span>;
              if (action.type === 'deadend') return <span>DFS reaches a <b>dead-end</b> at <b>{action.node}</b>.</span>;
              if (action.type === 'backtrack') return <span>DFS <b>backtracks</b> from <b>{action.from}</b> to <b>{action.to}</b>.</span>;
            })()
          ) : (
            dfsPath.length > 0 ? <span><b>DFS found a path:</b> {dfsPath.join(' → ')}</span> : <span>DFS did not find a path.</span>
          )
        ) : (
          (() => {
            let layers = getQuantumLayers(elements, startNode, endNode);
            if (step < layers.length) {
              return <span>Quantum explores layer: <b>{layers[step].join(', ')}</b> in parallel.</span>;
            } else {
              return quantumPath.length > 0 ? <span><b>Quantum found the shortest path:</b> {quantumPath.join(' → ')}</span> : <span>Quantum did not find a path.</span>;
            }
          })()
        )}
      </div>
      <div className="mt-6 text-white">
        <strong>Steps:</strong> {step + 1} / {(mode === "dfs" ? dfsExploration.length + (dfsPath.length > 0 ? 1 : 0) : getQuantumLayers(elements, startNode, endNode).length + (quantumPath.length > 0 ? 1 : 0))}<br />
        <strong>Path:</strong> {(mode === "dfs" ? dfsPath : quantumPath).join(" → ")}
      </div>
      {/* FINAL SUMMARY BOX */}
      {(step >= (mode === "dfs" ? dfsExploration.length : getQuantumLayers(elements, startNode, endNode).length) && (mode === "dfs" ? dfsPath.length : quantumPath.length)) && (
        <div className="mt-6 p-4 bg-indigo-900/80 rounded-lg text-white text-center">
          <h3 className="text-lg font-bold mb-2">Algorithm Summary</h3>
          <div className="mb-2">
            <span className="font-semibold">DFS:</span> Explored <b>{dfsExploration.filter(a => a.type === 'explore').length}</b> nodes, hit <b>{dfsExploration.filter(a => a.type === 'deadend').length}</b> dead-ends, backtracked <b>{dfsExploration.filter(a => a.type === 'backtrack').length}</b> times.<br />
            <span className="font-semibold">Quantum-inspired:</span> Explored <b>{getQuantumLayers(elements, startNode, endNode).reduce((acc, layer) => acc + layer.length, 0)}</b> nodes in <b>{getQuantumLayers(elements, startNode, endNode).length}</b> parallel layers.<br />
            <span className="font-semibold">DFS Path:</span> {dfsPath.length > 0 ? dfsPath.join(' → ') : 'No path found.'}<br />
            <span className="font-semibold">Quantum Path:</span> {quantumPath.length > 0 ? quantumPath.join(' → ') : 'No path found.'}
          </div>
          <div className="mt-2">
            <span className="inline-block px-3 py-1 rounded bg-green-600 text-white font-bold mr-2">{dfsPath.length && quantumPath.length && dfsPath.length > quantumPath.length ? 'Quantum is more efficient!' : dfsPath.length && quantumPath.length && dfsPath.length < quantumPath.length ? 'DFS is more efficient!' : 'Both found the shortest path.'}</span>
          </div>
          {/* Time Complexity Analysis */}
          <div className="mt-6 text-left bg-indigo-800/90 rounded p-4">
            <h4 className="font-bold mb-2 text-indigo-200">Time Complexity Analysis</h4>
            <div className="mb-2">
              <span className="font-semibold">DFS (Classical):</span> <span className="text-indigo-100">O(V + E)</span> <br />
              <span className="text-sm text-indigo-300">DFS explores each vertex and edge at most once. In the worst case, it may visit all nodes and edges, especially in graphs with many dead-ends or branches.</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Quantum-inspired (Parallel BFS):</span> <span className="text-indigo-100">O(V + E)</span> (classically), <span className="text-indigo-100">O(√N)</span> (quantum theoretical speedup)<br />
              <span className="text-sm text-indigo-300">Layered/parallel exploration finds the shortest path faster in practice, and quantum algorithms can offer a theoretical quadratic speedup for certain search problems.</span>
            </div>
            <div className="mt-2 text-indigo-100">
              <b>Comparison:</b> DFS can be inefficient on graphs with many branches or dead-ends, while quantum-inspired parallel search can reach the goal in fewer steps by exploring all possibilities at each layer simultaneously.
            </div>
          </div>
        </div>
      )}
      {simulationComplete && (
        <div className="mt-6 flex justify-center">
          <button onClick={() => onComplete && onComplete({ dfs: { steps: dfsExploration.length + dfsPath.length, path: dfsPath }, quantum: { steps: quantumPath.length, path: quantumPath } })} className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold">Show Comparison</button>
        </div>
      )}
      <div className="mt-6">
        {mode === "dfs" ? (
          <ol className="list-decimal ml-6 text-sm">
            {dfsExploration.slice(0, Math.min(step + 1, dfsExploration.length)).map((expl, idx) => (
              <li key={idx}>
                {expl.type === 'explore' && <>DFS explores from <b>{expl.from}</b> to <b>{expl.to}</b></>}
                {expl.type === 'deadend' && <>DFS reaches a <b>dead-end</b> at <b>{expl.node}</b></>}
                {expl.type === 'backtrack' && <>DFS <b>backtracks</b> from <b>{expl.from}</b> to <b>{expl.to}</b></>}
              </li>
            ))}
            {step >= dfsExploration.length && dfsPath.length > 0 && (
              <li key="final-path">
                DFS found a path: {dfsPath.join(" → ")}
              </li>
            )}
          </ol>
        ) : (
          <ol className="list-decimal ml-6 text-sm">
            {getQuantumLayers(elements, startNode, endNode).slice(0, Math.min(step + 1, getQuantumLayers(elements, startNode, endNode).length)).map((layer, idx) => (
              <li key={idx}>
                {idx === 0
                  ? `Start at node ${layer[0]}`
                  : `Parallel scan: visit nodes ${layer.join(", ")}`}
              </li>
            ))}
            {step >= getQuantumLayers(elements, startNode, endNode).length && quantumPath.length > 0 && (
              <li key="final-quantum-path">
                Quantum found the shortest path: {quantumPath.join(" → ")}
              </li>
            )}
          </ol>
        )}
      </div>
      {/* Helper for quantum layers - now a real JS function */}
    </div>
  );
}

// Utility: getQuantumLayers as a real function
function getQuantumLayers(elements, startNode, endNode) {
  const graph = {};
  elements.forEach(el => {
    if (el.data && el.data.id && !el.data.source) graph[el.data.id] = [];
  });
  elements.forEach(el => {
    if (el.data && el.data.source && el.data.target) {
      graph[el.data.source].push(el.data.target);
    }
  });
  let layers = [[startNode]];
  let visited = new Set([startNode]);
  let found = false;
  let currentLayer = [startNode];
  while (!found && currentLayer.length > 0) {
    let nextLayer = [];
    for (let node of currentLayer) {
      for (let neighbor of graph[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          nextLayer.push(neighbor);
          if (neighbor === endNode) found = true;
        }
      }
    }
    if (nextLayer.length > 0) layers.push([...nextLayer]);
    currentLayer = nextLayer;
  }
  return layers;
}


export default ShortestPathVisualizer;
