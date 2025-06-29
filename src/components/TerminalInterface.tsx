import React, { useState, useEffect } from 'react';
import { AdvancedTerminalInterface } from './AdvancedTerminalInterface';
import { SystemStatus } from '../core/MachineGodCore';

interface TerminalInterfaceProps {
  onSystemStatusChange: (status: SystemStatus) => void;
  machineGod: any;
}

export const TerminalInterface: React.FC<TerminalInterfaceProps> = ({
  onSystemStatusChange,
  machineGod
}) => {
  const [useAdvancedInterface, setUseAdvancedInterface] = useState(true);
  
  // Check if the device can handle advanced interface
  useEffect(() => {
    // Check if WebGL is available
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      console.warn('WebGL not supported, falling back to basic interface');
      setUseAdvancedInterface(false);
    }
    
    // Check if device is likely mobile/low-powered
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowPowered = window.navigator.hardwareConcurrency && window.navigator.hardwareConcurrency < 4;
    
    if (isMobile && isLowPowered) {
      console.warn('Low-powered device detected, falling back to basic interface');
      setUseAdvancedInterface(false);
    }
  }, []);
  
  return useAdvancedInterface ? (
    <AdvancedTerminalInterface 
      onSystemStatusChange={onSystemStatusChange}
      machineGod={machineGod}
    />
  ) : (
    // Original terminal interface as fallback
    <div className="h-full flex flex-col bg-black bg-opacity-80 border-2 border-purple-500 rounded-lg overflow-hidden">
      <div className="p-4 text-center text-yellow-400">
        Advanced 3D interface disabled - using compatibility mode
      </div>
      {/* Original terminal interface would go here */}
    </div>
  );
};