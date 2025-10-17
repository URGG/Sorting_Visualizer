import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Plus, Trash2, Info, Sparkles } from 'lucide-react';

const DataStructureVisualizer = () => {
  const [dataStructure, setDataStructure] = useState('array');
  const [algorithm, setAlgorithm] = useState('bubble');
  const [data, setData] = useState([64, 34, 25, 12, 22, 11, 90]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [searchValue, setSearchValue] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [showComplexity, setShowComplexity] = useState(true);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const [bstRoot, setBstRoot] = useState(null);
  const [celebrationMode, setCelebrationMode] = useState(false);
  const [bstSteps, setBstSteps] = useState([]);
  const [bstCurrentStep, setBstCurrentStep] = useState(0);
  const [highlightedNodes, setHighlightedNodes] = useState([]);

  const algorithmComplexity = {
    bubble: { time: 'O(n²)', space: 'O(1)', best: 'O(n)', worst: 'O(n²)', description: 'Repeatedly swaps adjacent elements if they are in wrong order' },
    selection: { time: 'O(n²)', space: 'O(1)', best: 'O(n²)', worst: 'O(n²)', description: 'Finds minimum element and places it at beginning' },
    insertion: { time: 'O(n²)', space: 'O(1)', best: 'O(n)', worst: 'O(n²)', description: 'Builds final sorted array one item at a time' },
    quick: { time: 'O(n log n)', space: 'O(log n)', best: 'O(n log n)', worst: 'O(n²)', description: 'Divides array using pivot and recursively sorts' },
    merge: { time: 'O(n log n)', space: 'O(n)', best: 'O(n log n)', worst: 'O(n log n)', description: 'Divides array into halves, sorts and merges them' },
    linear: { time: 'O(n)', space: 'O(1)', best: 'O(1)', worst: 'O(n)', description: 'Sequentially checks each element until found' },
    binary: { time: 'O(log n)', space: 'O(1)', best: 'O(1)', worst: 'O(log n)', description: 'Repeatedly divides sorted array in half' },
    bst: { time: 'O(log n)', space: 'O(n)', best: 'O(log n)', worst: 'O(n)', description: 'Binary search tree with left < parent < right' },
  };

  class BSTNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }

  const insertBST = (root, value) => {
    if (root === null) {
      return new BSTNode(value);
    }
    if (value < root.value) {
      root.left = insertBST(root.left, value);
    } else if (value > root.value) {
      root.right = insertBST(root.right, value);
    }
    return root;
  };

  const buildBSTWithSteps = (arr) => {
    const steps = [];
    let root = null;
    
    arr.forEach((val, idx) => {
      const path = [];
      root = insertBSTWithPath(root, val, path);
      steps.push({
        tree: JSON.parse(JSON.stringify(root)),
        inserting: val,
        path: [...path],
        inserted: idx === arr.length - 1
      });
    });
    
    return { root, steps };
  };

  const insertBSTWithPath = (root, value, path) => {
    if (root === null) {
      path.push(value);
      return new BSTNode(value);
    }
    
    path.push(root.value);
    
    if (value < root.value) {
      root.left = insertBSTWithPath(root.left, value, path);
    } else if (value > root.value) {
      root.right = insertBSTWithPath(root.right, value, path);
    }
    return root;
  };

  const buildBSTFromArray = (arr) => {
    let root = null;
    arr.forEach(val => {
      root = insertBST(root, val);
    });
    return root;
  };

  const renderBST = (node, x, y, xOffset, level = 0) => {
    if (!node) return null;

    const nodeRadius = 28;
    const verticalGap = 70;
    const elements = [];
    
    const isHighlighted = highlightedNodes.includes(node.value);
    const isInserting = bstSteps.length > 0 && bstSteps[bstCurrentStep]?.inserting === node.value;

    // Draw lines to children first (so they appear behind nodes)
    if (node.left) {
      const leftX = x - xOffset;
      const leftY = y + verticalGap;
      elements.push(
        <line
          key={`line-left-${node.value}-${level}-${x}`}
          x1={x}
          y1={y}
          x2={leftX}
          y2={leftY}
          stroke="white"
          strokeWidth="3"
          opacity="0.6"
          className="transition-all duration-300"
        />
      );
      elements.push(...renderBST(node.left, leftX, leftY, xOffset / 2, level + 1));
    }

    if (node.right) {
      const rightX = x + xOffset;
      const rightY = y + verticalGap;
      elements.push(
        <line
          key={`line-right-${node.value}-${level}-${x}`}
          x1={x}
          y1={y}
          x2={rightX}
          y2={rightY}
          stroke="white"
          strokeWidth="3"
          opacity="0.6"
          className="transition-all duration-300"
        />
      );
      elements.push(...renderBST(node.right, rightX, rightY, xOffset / 2, level + 1));
    }

    // Determine node color based on state
    let fillColor = '#18181b';
    let strokeColor = 'white';
    let strokeWidth = 3;
    let glowClass = '';
    
    if (isInserting) {
      fillColor = '#4ade80'; // green
      strokeColor = '#4ade80';
      strokeWidth = 4;
      glowClass = 'animate-pulse';
    } else if (isHighlighted) {
      fillColor = '#60a5fa'; // blue
      strokeColor = '#60a5fa';
      strokeWidth = 4;
      glowClass = 'animate-pulse';
    }

    // Draw node with glow effect
    elements.push(
      <g key={`node-${node.value}-${level}-${x}`} className="transition-all duration-500">
        {/* Glow effect */}
        {(isHighlighted || isInserting) && (
          <circle
            cx={x}
            cy={y}
            r={nodeRadius + 8}
            fill={strokeColor}
            opacity="0.3"
            className={glowClass}
          />
        )}
        
        {/* Main node */}
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          className="transition-all duration-300"
          style={{
            filter: isInserting || isHighlighted ? 'drop-shadow(0 0 10px currentColor)' : 'none'
          }}
        />
        
        {/* Value text */}
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="18"
          fontWeight="bold"
          className="transition-all duration-300"
        >
          {node.value}
        </text>
      </g>
    );

    return elements;
  };

  // Sorting Algorithms with metrics
  const bubbleSort = (arr) => {
    const steps = [];
    const array = [...arr];
    let compCount = 0;
    let swapCount = 0;
    steps.push({ array: [...array], comparing: [], sorted: [], active: [], comparisons: 0, swaps: 0 });
    
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        compCount++;
        steps.push({ array: [...array], comparing: [j, j + 1], sorted: [], active: [j, j + 1], comparisons: compCount, swaps: swapCount });
        if (array[j] > array[j + 1]) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          swapCount++;
          steps.push({ array: [...array], comparing: [j, j + 1], sorted: [], active: [j, j + 1], swapped: true, comparisons: compCount, swaps: swapCount });
        }
      }
      steps.push({ array: [...array], comparing: [], sorted: Array.from({length: i + 1}, (_, k) => array.length - 1 - k), active: [], comparisons: compCount, swaps: swapCount });
    }
    return steps;
  };

  const selectionSort = (arr) => {
    const steps = [];
    const array = [...arr];
    let compCount = 0;
    let swapCount = 0;
    steps.push({ array: [...array], comparing: [], sorted: [], active: [], comparisons: 0, swaps: 0 });
    
    for (let i = 0; i < array.length - 1; i++) {
      let minIdx = i;
      steps.push({ array: [...array], comparing: [i], sorted: [], active: [i], comparisons: compCount, swaps: swapCount });
      
      for (let j = i + 1; j < array.length; j++) {
        compCount++;
        steps.push({ array: [...array], comparing: [minIdx, j], sorted: [], active: [j], comparisons: compCount, swaps: swapCount });
        if (array[j] < array[minIdx]) {
          minIdx = j;
        }
      }
      
      if (minIdx !== i) {
        [array[i], array[minIdx]] = [array[minIdx], array[i]];
        swapCount++;
        steps.push({ array: [...array], comparing: [i, minIdx], sorted: [], active: [i, minIdx], swapped: true, comparisons: compCount, swaps: swapCount });
      }
      steps.push({ array: [...array], comparing: [], sorted: Array.from({length: i + 1}, (_, k) => k), active: [], comparisons: compCount, swaps: swapCount });
    }
    return steps;
  };

  const insertionSort = (arr) => {
    const steps = [];
    const array = [...arr];
    let compCount = 0;
    let swapCount = 0;
    steps.push({ array: [...array], comparing: [], sorted: [], active: [], comparisons: 0, swaps: 0 });
    
    for (let i = 1; i < array.length; i++) {
      let key = array[i];
      let j = i - 1;
      steps.push({ array: [...array], comparing: [i], sorted: [], active: [i], comparisons: compCount, swaps: swapCount });
      
      while (j >= 0 && array[j] > key) {
        compCount++;
        steps.push({ array: [...array], comparing: [j, j + 1], sorted: [], active: [j, j + 1], comparisons: compCount, swaps: swapCount });
        array[j + 1] = array[j];
        swapCount++;
        j--;
        steps.push({ array: [...array], comparing: [j + 1], sorted: [], active: [j + 1], comparisons: compCount, swaps: swapCount });
      }
      if (j >= 0) compCount++;
      array[j + 1] = key;
      steps.push({ array: [...array], comparing: [], sorted: Array.from({length: i + 1}, (_, k) => k), active: [], comparisons: compCount, swaps: swapCount });
    }
    return steps;
  };

  const quickSort = (arr, low = 0, high = arr.length - 1, steps = [], metrics = { comp: 0, swap: 0 }) => {
    const array = steps.length === 0 ? [...arr] : steps[steps.length - 1].array;
    
    if (steps.length === 0) {
      steps.push({ array: [...array], comparing: [], sorted: [], active: [], comparisons: 0, swaps: 0 });
    }
    
    if (low < high) {
      const pi = partition(array, low, high, steps, metrics);
      quickSort(array, low, pi - 1, steps, metrics);
      quickSort(array, pi + 1, high, steps, metrics);
    }
    return steps;
  };

  const partition = (array, low, high, steps, metrics) => {
    const pivot = array[high];
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      metrics.comp++;
      steps.push({ array: [...array], comparing: [j, high], sorted: [], active: [j, high], pivot: high, comparisons: metrics.comp, swaps: metrics.swap });
      if (array[j] < pivot) {
        i++;
        [array[i], array[j]] = [array[j], array[i]];
        metrics.swap++;
        steps.push({ array: [...array], comparing: [i, j], sorted: [], active: [i, j], swapped: true, comparisons: metrics.comp, swaps: metrics.swap });
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    metrics.swap++;
    steps.push({ array: [...array], comparing: [i + 1, high], sorted: [], active: [i + 1, high], swapped: true, comparisons: metrics.comp, swaps: metrics.swap });
    return i + 1;
  };

  const mergeSort = (arr, start = 0, end = arr.length - 1, steps = [], array = null, metrics = { comp: 0, swap: 0 }) => {
    if (!array) {
      array = [...arr];
      steps.push({ array: [...array], comparing: [], sorted: [], active: [], merging: [], comparisons: 0, swaps: 0 });
    }
    
    if (start < end) {
      const mid = Math.floor((start + end) / 2);
      
      steps.push({ array: [...array], comparing: [], sorted: [], active: [], dividing: [start, mid, end], comparisons: metrics.comp, swaps: metrics.swap });
      
      mergeSort(arr, start, mid, steps, array, metrics);
      mergeSort(arr, mid + 1, end, steps, array, metrics);
      merge(array, start, mid, end, steps, metrics);
    }
    
    return steps;
  };

  const merge = (array, start, mid, end, steps, metrics) => {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    
    let i = 0, j = 0, k = start;
    
    steps.push({ array: [...array], comparing: [], sorted: [], active: [], merging: [start, end], comparisons: metrics.comp, swaps: metrics.swap });
    
    while (i < left.length && j < right.length) {
      metrics.comp++;
      steps.push({ array: [...array], comparing: [start + i, mid + 1 + j], sorted: [], active: [k], merging: [start, end], comparisons: metrics.comp, swaps: metrics.swap });
      
      if (left[i] <= right[j]) {
        array[k] = left[i];
        i++;
      } else {
        array[k] = right[j];
        j++;
      }
      metrics.swap++;
      steps.push({ array: [...array], comparing: [], sorted: [], active: [k], merging: [start, end], comparisons: metrics.comp, swaps: metrics.swap });
      k++;
    }
    
    while (i < left.length) {
      array[k] = left[i];
      metrics.swap++;
      steps.push({ array: [...array], comparing: [], sorted: [], active: [k], merging: [start, end], comparisons: metrics.comp, swaps: metrics.swap });
      i++;
      k++;
    }
    
    while (j < right.length) {
      array[k] = right[j];
      metrics.swap++;
      steps.push({ array: [...array], comparing: [], sorted: [], active: [k], merging: [start, end], comparisons: metrics.comp, swaps: metrics.swap });
      j++;
      k++;
    }
    
    steps.push({ array: [...array], comparing: [], sorted: Array.from({length: end - start + 1}, (_, idx) => start + idx), active: [], merging: [], comparisons: metrics.comp, swaps: metrics.swap });
  };

  // Search Algorithms
  const linearSearch = (arr, target) => {
    const steps = [];
    let compCount = 0;
    steps.push({ array: [...arr], comparing: [], found: -1, active: [], comparisons: 0 });
    
    for (let i = 0; i < arr.length; i++) {
      compCount++;
      steps.push({ array: [...arr], comparing: [i], found: -1, active: [i], comparisons: compCount });
      if (arr[i] === target) {
        steps.push({ array: [...arr], comparing: [i], found: i, active: [i], comparisons: compCount });
        return steps;
      }
    }
    steps.push({ array: [...arr], comparing: [], found: -1, active: [], comparisons: compCount });
    return steps;
  };

  const binarySearch = (arr, target) => {
    const steps = [];
    const sorted = [...arr].sort((a, b) => a - b);
    let compCount = 0;
    steps.push({ array: sorted, comparing: [], found: -1, active: [], comparisons: 0 });
    
    let left = 0;
    let right = sorted.length - 1;
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      compCount++;
      steps.push({ array: sorted, comparing: [mid], found: -1, range: [left, right], active: [mid], comparisons: compCount });
      
      if (sorted[mid] === target) {
        steps.push({ array: sorted, comparing: [mid], found: mid, active: [mid], comparisons: compCount });
        return steps;
      } else if (sorted[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    steps.push({ array: sorted, comparing: [], found: -1, active: [], comparisons: compCount });
    return steps;
  };

  const runAlgorithm = () => {
    let newSteps = [];
    setCelebrationMode(false);
    setBstRoot(null);
    setBstSteps([]);
    setBstCurrentStep(0);
    setHighlightedNodes([]);
    
    if (algorithm === 'bst') {
      const { root, steps } = buildBSTWithSteps(data);
      setBstRoot(root);
      setBstSteps(steps);
      setBstCurrentStep(0);
      setIsRunning(true);
      return;
    }
    
    if (algorithm === 'linear' || algorithm === 'binary') {
      const target = parseInt(searchValue);
      if (isNaN(target)) {
        alert('Please enter a valid number to search');
        return;
      }
      newSteps = algorithm === 'linear' ? linearSearch(data, target) : binarySearch(data, target);
    } else {
      switch (algorithm) {
        case 'bubble':
          newSteps = bubbleSort(data);
          break;
        case 'selection':
          newSteps = selectionSort(data);
          break;
        case 'insertion':
          newSteps = insertionSort(data);
          break;
        case 'quick':
          newSteps = quickSort(data);
          break;
        case 'merge':
          newSteps = mergeSort(data);
          break;
        default:
          newSteps = bubbleSort(data);
      }
    }
    
    setSteps(newSteps);
    setCurrentStep(0);
    setIsRunning(true);
  };

  useEffect(() => {
    if (algorithm === 'bst' && isRunning && bstCurrentStep < bstSteps.length - 1) {
      const timer = setTimeout(() => {
        const currentStepData = bstSteps[bstCurrentStep];
        setHighlightedNodes(currentStepData.path);
        setBstCurrentStep(bstCurrentStep + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (algorithm === 'bst' && bstCurrentStep === bstSteps.length - 1) {
      setIsRunning(false);
      setHighlightedNodes([]);
      setCelebrationMode(true);
      setTimeout(() => setCelebrationMode(false), 3000);
    } else if (isRunning && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
        if (steps[currentStep]) {
          setComparisons(steps[currentStep].comparisons || 0);
          setSwaps(steps[currentStep].swaps || 0);
        }
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentStep === steps.length - 1) {
      setIsRunning(false);
      setCelebrationMode(true);
      setTimeout(() => setCelebrationMode(false), 3000);
    }
  }, [isRunning, currentStep, steps, speed, bstCurrentStep, bstSteps, algorithm]);

  const reset = () => {
    setIsRunning(false);
    setCurrentStep(0);
    setSteps([]);
    setComparisons(0);
    setSwaps(0);
    setCelebrationMode(false);
    setBstRoot(null);
  };

  const addValue = () => {
    const val = parseInt(inputValue);
    if (!isNaN(val)) {
      setData([...data, val]);
      setInputValue('');
      reset();
    }
  };

  const removeValue = (index) => {
    setData(data.filter((_, i) => i !== index));
    reset();
  };

  const randomizeData = () => {
    const newData = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100));
    setData(newData);
    reset();
  };

  const currentData = steps.length > 0 ? steps[currentStep] : { array: data, comparing: [], sorted: [], found: -1, active: [] };
  const maxValue = Math.max(...currentData.array, 100);

  return (
    <div className="min-h-screen bg-black p-8 relative overflow-hidden">
      {celebrationMode && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <Sparkles className="text-white" size={24} />
            </div>
          ))}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-2 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Algorithm Visualizer
        </h1>
        <p className="text-gray-400 text-center mb-8">Watch sorting and searching algorithms come to life</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-zinc-900 rounded-xl p-6 border border-white shadow-lg shadow-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-white mb-2 font-semibold">Data Structure</label>
                <select
                  value={dataStructure}
                  onChange={(e) => setDataStructure(e.target.value)}
                  className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-gray-600 hover:border-white transition-colors"
                >
                  <option value="array">Array</option>
                  <option value="bst">Binary Search Tree</option>
                  <option value="list">Linked List</option>
                  <option value="stack">Stack</option>
                  <option value="queue">Queue</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Algorithm</label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-gray-600 hover:border-white transition-colors"
                >
                  <optgroup label="Sorting">
                    <option value="bubble">Bubble Sort</option>
                    <option value="selection">Selection Sort</option>
                    <option value="insertion">Insertion Sort</option>
                    <option value="merge">Merge Sort</option>
                    <option value="quick">Quick Sort</option>
                  </optgroup>
                  <optgroup label="Searching">
                    <option value="linear">Linear Search</option>
                    <option value="binary">Binary Search</option>
                  </optgroup>
                  <optgroup label="Tree">
                    <option value="bst">BST Insert</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {(algorithm === 'linear' || algorithm === 'binary') && (
              <div className="mb-6">
                <label className="block text-white mb-2 font-semibold">Search Value</label>
                <input
                  type="number"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Enter value to search"
                  className="w-full p-3 rounded-lg bg-zinc-800 text-white border border-gray-600 hover:border-white transition-colors placeholder-gray-400"
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={runAlgorithm}
                disabled={isRunning}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 disabled:bg-gray-600 text-black disabled:text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Play size={20} /> Run
              </button>
              <button
                onClick={() => setIsRunning(!isRunning)}
                disabled={steps.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 disabled:bg-gray-600 text-black disabled:text-white rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                {isRunning ? <Pause size={20} /> : <Play size={20} />}
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <RotateCcw size={20} /> Reset
              </button>
              <button
                onClick={randomizeData}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Randomize
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-white mb-2 font-semibold">Speed: {speed}ms</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(parseInt(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div className="flex gap-3">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add value"
                className="flex-1 p-3 rounded-lg bg-zinc-800 text-white border border-gray-600 hover:border-white transition-colors placeholder-gray-400"
              />
              <button
                onClick={addValue}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-200 text-black rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Plus size={20} /> Add
              </button>
            </div>
          </div>

          {showComplexity && (
            <div className="bg-zinc-900 rounded-xl p-6 border border-white shadow-lg shadow-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Info size={20} /> Complexity
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-zinc-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Average Time</div>
                  <div className="text-2xl font-bold text-white">{algorithmComplexity[algorithm].time}</div>
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Space Complexity</div>
                  <div className="text-2xl font-bold text-white">{algorithmComplexity[algorithm].space}</div>
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Best Case</div>
                  <div className="text-xl font-bold text-green-400">{algorithmComplexity[algorithm].best}</div>
                </div>
                
                <div className="bg-zinc-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-1">Worst Case</div>
                  <div className="text-xl font-bold text-red-400">{algorithmComplexity[algorithm].worst}</div>
                </div>

                <div className="bg-zinc-800 p-4 rounded-lg border border-gray-700">
                  <div className="text-sm text-gray-400 mb-2">Description</div>
                  <div className="text-sm text-gray-300">{algorithmComplexity[algorithm].description}</div>
                </div>

                {steps.length > 0 && (
                  <>
                    <div className="bg-zinc-800 p-4 rounded-lg border border-gray-700">
                      <div className="text-sm text-gray-400 mb-1">Comparisons</div>
                      <div className="text-2xl font-bold text-blue-400">{comparisons}</div>
                    </div>
                    
                    {swaps > 0 && (
                      <div className="bg-zinc-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-sm text-gray-400 mb-1">Swaps</div>
                        <div className="text-2xl font-bold text-purple-400">{swaps}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 rounded-xl p-6 border border-white shadow-lg shadow-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Visualization</h2>
            {steps.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-white font-semibold">
                  Step {currentStep + 1} / {steps.length}
                </span>
                <div className="bg-zinc-800 px-4 py-2 rounded-lg border border-gray-700">
                  <span className="text-gray-400 text-sm">Progress: </span>
                  <span className="text-white font-bold">{Math.round((currentStep / steps.length) * 100)}%</span>
                </div>
              </div>
            )}
          </div>

          <div className="bg-black rounded-lg p-6 border border-gray-800 mb-6">
            {algorithm === 'bst' && bstRoot ? (
              <div className="flex justify-center items-center min-h-96">
                <svg width="800" height="400" className="overflow-visible">
                  {renderBST(bstRoot, 400, 50, 150)}
                </svg>
              </div>
            ) : (
              <div className="flex items-end justify-center gap-2 h-80">
                {currentData.array.map((value, index) => {
                  const isComparing = currentData.comparing?.includes(index);
                  const isSorted = currentData.sorted?.includes(index);
                  const isFound = currentData.found === index;
                  const isActive = currentData.active?.includes(index);
                  const isMerging = currentData.merging && index >= currentData.merging[0] && index <= currentData.merging[1];
                  const isPivot = currentData.pivot === index;
                  const inRange = currentData.range ? index >= currentData.range[0] && index <= currentData.range[1] : true;
                  
                  let bgColor = 'bg-white';
                  let shadowColor = 'shadow-white/50';
                  let borderColor = 'border-white';
                  let glowIntensity = '';
                  
                  if (isFound) {
                    bgColor = 'bg-green-400';
                    shadowColor = 'shadow-green-400/80';
                    borderColor = 'border-green-400';
                    glowIntensity = 'shadow-2xl';
                  } else if (isPivot) {
                    bgColor = 'bg-yellow-400';
                    shadowColor = 'shadow-yellow-400/80';
                    borderColor = 'border-yellow-400';
                    glowIntensity = 'shadow-xl';
                  } else if (isComparing) {
                    bgColor = 'bg-red-400';
                    shadowColor = 'shadow-red-400/80';
                    borderColor = 'border-red-400';
                    glowIntensity = 'shadow-xl';
                  } else if (isMerging) {
                    bgColor = 'bg-blue-400';
                    shadowColor = 'shadow-blue-400/80';
                    borderColor = 'border-blue-400';
                    glowIntensity = 'shadow-lg';
                  } else if (isSorted) {
                    bgColor = 'bg-green-300';
                    shadowColor = 'shadow-green-300/60';
                    borderColor = 'border-green-300';
                    glowIntensity = 'shadow-lg';
                  } else if (isActive) {
                    bgColor = 'bg-gray-300';
                    shadowColor = 'shadow-gray-300/60';
                    borderColor = 'border-gray-300';
                    glowIntensity = 'shadow-md';
                  } else if (!inRange) {
                    bgColor = 'bg-gray-700';
                    shadowColor = 'shadow-gray-700/30';
                    borderColor = 'border-gray-700';
                  }
                  
                  return (
                    <div key={index} className="flex flex-col items-center gap-2 flex-1 max-w-24">
                      <div
                        className={`w-full ${bgColor} rounded-t-lg transition-all duration-300 flex items-end justify-center pb-2 ${glowIntensity} ${shadowColor} border-2 ${borderColor} relative overflow-hidden`}
                        style={{ 
                          height: `${(value / maxValue) * 100}%`,
                          transform: isActive || isComparing ? 'scale(1.08) translateY(-4px)' : isSorted ? 'scale(1.02)' : 'scale(1)',
                          filter: isSorted ? 'brightness(1.2)' : 'brightness(1)'
                        }}
                      >
                        {(isComparing || isActive) && (
                          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/30 to-white/10 animate-pulse"></div>
                        )}
                        {isSorted && (
                          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"></div>
                        )}
                        <span className="text-black font-bold text-sm relative z-10 drop-shadow-lg">{value}</span>
                      </div>
                      <button
                        onClick={() => removeValue(index)}
                        className="p-1 bg-zinc-800 hover:bg-white hover:text-black border border-gray-600 rounded text-white transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="text-white text-center">
            <div className="flex justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white rounded border-2 border-white shadow-lg shadow-white/50"></div>
                <span>Default</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-red-400 rounded border-2 border-red-400 shadow-lg shadow-red-400/50"></div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-400 rounded border-2 border-blue-400 shadow-lg shadow-blue-400/50"></div>
                <span>Merging</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-400 rounded border-2 border-yellow-400 shadow-lg shadow-yellow-400/50"></div>
                <span>Pivot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-300 rounded border-2 border-green-300 shadow-lg shadow-green-300/50"></div>
                <span>Sorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-400 rounded border-2 border-green-400 shadow-lg shadow-green-400/50"></div>
                <span>Found</span>
              </div>
            </div>
          </div>
        </div>

        {celebrationMode && (
          <div className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-8 text-center border-2 border-white shadow-2xl shadow-green-500/50 animate-pulse">
            <h2 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
              <Sparkles size={32} /> Sorting Complete! <Sparkles size={32} />
            </h2>
            <p className="text-white text-xl">All elements are now in perfect order! </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataStructureVisualizer;