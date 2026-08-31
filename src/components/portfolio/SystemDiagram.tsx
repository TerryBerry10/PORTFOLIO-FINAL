import React, { useState } from 'react';
import { ArchitectureEdge, ArchitectureNode } from '../../types/project';
import { Code, Info, Layers, PlayCircle, Zap } from 'lucide-react';
import { AudioEngine } from '../../engine/AudioEngine';

interface SystemDiagramProps {
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
}

export const SystemDiagram: React.FC<SystemDiagramProps> = ({ nodes, edges }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(nodes[0]?.id || '');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const getNodeColor = (category: ArchitectureNode['category']) => {
    switch (category) {
      case 'input': return 'border-amber-600 bg-amber-50 text-amber-900';
      case 'state': return 'border-emerald-600 bg-emerald-50 text-emerald-900';
      case 'logic': return 'border-sky-600 bg-sky-50 text-sky-900';
      case 'physics': return 'border-rose-600 bg-rose-50 text-rose-900';
      case 'render': return 'border-purple-600 bg-purple-50 text-purple-900';
      case 'vfx': return 'border-orange-600 bg-orange-50 text-orange-900';
      case 'audio': return 'border-teal-600 bg-teal-50 text-teal-900';
      default: return 'border-charcoal-700 bg-charcoal-50 text-charcoal-900';
    }
  };

  const handleNodeClick = (id: string) => {
    AudioEngine.playSfx('buttonHover');
    setSelectedNodeId(id);
  };

  return (
    <div className="bg-paper-50 border border-paper-300 rounded-xl p-5 shadow-journal">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-paper-200">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-moss-700" />
          <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-charcoal-900">
            // INTERACTIVE SYSTEM ARCHITECTURE GRAPH
          </h4>
        </div>
        <span className="text-[11px] font-mono text-moss-700 bg-moss-50 px-2.5 py-0.5 rounded border border-moss-200">
          Click any node to inspect data flow
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Node Flow Canvas / Map */}
        <div className="lg:col-span-2 relative bg-paper-100 rounded-lg p-6 border border-paper-300 min-h-[300px] flex flex-col justify-center overflow-x-auto">
          {/* Animated Connecting Lines & Edge Labels */}
          <div className="flex flex-wrap gap-4 items-center justify-center">
            {nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              const colorClass = getNodeColor(node.category);

              return (
                <React.Fragment key={node.id}>
                  <button
                    onClick={() => handleNodeClick(node.id)}
                    className={`relative text-left p-3.5 rounded-lg border-2 transition-all duration-200 shadow-sm cursor-pointer min-w-[150px] max-w-[200px] ${colorClass} ${
                      isSelected ? 'ring-2 ring-gold-500 scale-105 shadow-md' : 'hover:scale-102 hover:shadow'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider opacity-75 mb-1 font-semibold">
                      {node.category}
                    </div>
                    <div className="font-bold text-xs leading-tight mb-1 text-charcoal-900">
                      {node.label}
                    </div>
                    <div className="text-[11px] font-mono opacity-80 truncate">
                      {node.sublabel}
                    </div>
                    {isSelected && (
                      <span className="absolute -top-2 -right-2 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-gold-500 text-[9px] text-charcoal-950 font-bold items-center justify-center">✓</span>
                      </span>
                    )}
                  </button>

                  {index < nodes.length - 1 && (
                    <div className="flex items-center text-moss-700 font-mono text-xs opacity-60">
                      →
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="bg-paper-200 border border-paper-300 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-moss-700" />
                <span className="text-[11px] font-mono uppercase tracking-wider text-moss-800 font-bold">
                  NODE // {selectedNode.category.toUpperCase()}
                </span>
              </div>
              <h5 className="font-bold text-sm text-charcoal-900 mb-1">{selectedNode.label}</h5>
              <p className="text-xs text-charcoal-700 font-mono mb-3">{selectedNode.sublabel}</p>
              
              <p className="text-xs text-charcoal-800 leading-relaxed mb-4">
                {selectedNode.description}
              </p>

              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] font-mono font-bold text-charcoal-700 uppercase">Key Characteristics:</span>
                {selectedNode.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-charcoal-800">
                    <span className="text-moss-600 font-mono">▸</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedNode.codeSnippet && (
              <div className="mt-3 pt-3 border-t border-paper-300">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-charcoal-700 mb-1.5 font-bold">
                  <Code className="w-3 h-3" />
                  <span>DATA DEFINITION</span>
                </div>
                <pre className="bg-charcoal-900 text-gold-300 p-2.5 rounded font-mono text-[11px] overflow-x-auto leading-tight">
                  <code>{selectedNode.codeSnippet}</code>
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
