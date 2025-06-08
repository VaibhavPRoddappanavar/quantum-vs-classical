"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const InputForm = ({ onInputChange, onValidityChange }) => {
  const [matrixSize, setMatrixSize] = useState(3); // Default to 3x3 matrix
  const [matrixValues, setMatrixValues] = useState(
    Array(3).fill().map(() => Array(3).fill(""))
  );
  const [vectorValues, setVectorValues] = useState(Array(3).fill(""));
  const [isValid, setIsValid] = useState(false);
  
  // Update form validity
  useEffect(() => {
    // Check if all matrix and vector inputs are valid numbers
    const matrixValid = matrixValues.every(row => 
      row.every(val => val !== "" && !isNaN(parseFloat(val)))
    );
    
    const vectorValid = vectorValues.every(val => 
      val !== "" && !isNaN(parseFloat(val))
    );
    
    const newIsValid = matrixValid && vectorValid;
    setIsValid(newIsValid);
    onValidityChange(newIsValid);
    
    // If valid, convert strings to numbers and pass to parent
    if (newIsValid) {
      const numericMatrix = matrixValues.map(row => 
        row.map(val => parseFloat(val))
      );
      
      const numericVector = vectorValues.map(val => parseFloat(val));
      
      onInputChange({
        matrix: numericMatrix,
        vector: numericVector
      });
    }
  }, [matrixValues, vectorValues]);

  // Handle matrix size change
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    setMatrixSize(newSize);
    
    // Resize matrix and vector
    const newMatrix = Array(newSize).fill().map((_, i) => 
      Array(newSize).fill().map((_, j) => 
        i < matrixValues.length && j < matrixValues[0].length ? matrixValues[i][j] : ""
      )
    );
    
    const newVector = Array(newSize).fill().map((_, i) => 
      i < vectorValues.length ? vectorValues[i] : ""
    );
    
    setMatrixValues(newMatrix);
    setVectorValues(newVector);
  };

  // Handle matrix value change
  const handleMatrixChange = (rowIdx, colIdx, value) => {
    const newMatrix = [...matrixValues];
    newMatrix[rowIdx][colIdx] = value;
    setMatrixValues(newMatrix);
  };

  // Handle vector value change
  const handleVectorChange = (idx, value) => {
    const newVector = [...vectorValues];
    newVector[idx] = value;
    setVectorValues(newVector);
  };

  // Set predefined example
  const setExample = () => {
    // Example 3x3 system with known solution
    const exampleMatrix = [
      [4, 1, 1],
      [1, 3, 1],
      [1, 1, 2]
    ];
    
    const exampleVector = [6, 5, 4];
    
    setMatrixSize(3);
    setMatrixValues(exampleMatrix.map(row => row.map(val => val.toString())));
    setVectorValues(exampleVector.map(val => val.toString()));
  };
  
  // Track if example has been loaded
  const [exampleLoaded, setExampleLoaded] = useState(false);
  
  // Set example on component mount
  useEffect(() => {
    if (!exampleLoaded) {
      setExample();
      setExampleLoaded(true);
    }
  }, [exampleLoaded]);

  return (
    <div className="bg-black/30 p-6 rounded-lg border border-indigo-500/30 max-w-4xl mx-auto mb-8">
      <h3 className="text-xl font-bold mb-4 text-white font-orbitron">
        Linear System Input
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <label htmlFor="matrix-size" className="text-sm text-gray-300">
              Matrix Size:
            </label>
            <select
              id="matrix-size"
              value={matrixSize}
              onChange={handleSizeChange}
              className="bg-black/30 border border-white/20 text-white rounded-lg p-2"
            >
              <option value="2">2×2</option>
              <option value="3">3×3</option>
              <option value="4">4×4</option>
            </select>
            
            <button
              onClick={setExample}
              className="px-3 py-1 bg-indigo-600/70 text-white text-sm rounded hover:bg-indigo-700/70 transition-colors"
            >
              Use Example
            </button>
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="mb-2 text-sm text-gray-300">
              Matrix A:
            </div>
            
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
              {matrixValues.map((row, rowIdx) => (
                row.map((value, colIdx) => (
                  <input
                    key={`matrix-${rowIdx}-${colIdx}`}
                    type="text"
                    value={value}
                    onChange={(e) => handleMatrixChange(rowIdx, colIdx, e.target.value)}
                    className="w-full p-2 bg-black/40 border border-gray-700 rounded text-white text-center"
                    placeholder="0"
                  />
                ))
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="mb-4 text-sm text-gray-300">
            Vector b:
          </div>
          
          <div className="bg-black/20 p-4 rounded-lg">
            <div className="grid gap-2" style={{ gridTemplateColumns: '1fr' }}>
              {vectorValues.map((value, idx) => (
                <input
                  key={`vector-${idx}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleVectorChange(idx, e.target.value)}
                  className="w-full p-2 bg-black/40 border border-gray-700 rounded text-white text-center"
                  placeholder="0"
                />
              ))}
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-400">
            <p>Enter the coefficients for the system Ax = b.</p>
            <p className="mt-1">We'll solve for the unknown vector x.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-gray-300 bg-black/40 p-3 rounded-lg">
        <div className="flex items-center">
          <div 
            className={`w-3 h-3 rounded-full mr-2`}
            style={{ backgroundColor: isValid ? '#22c55e' : '#f87171' }}
          ></div>
          <p>
            {isValid 
              ? "Input is valid. You can start the simulation." 
              : "Please fill all fields with valid numbers."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputForm;
