<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QUANTUM HELIX HYPER-COMPRESSION</title>
    <style>
        :root {
            --quantum-blue: #00f7ff;
            --hologram-purple: #bd00ff;
            --neon-green: #39ff14;
            --compression-red: #ff0055;
            --dark-space: #0a0a1a;
            --darker-space: #050510;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, var(--darker-space), var(--dark-space));
            color: white;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            text-align: center;
            margin-bottom: 3rem;
            padding: 2rem;
            border-bottom: 3px solid var(--quantum-blue);
            position: relative;
        }
        
        h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            background: linear-gradient(90deg, var(--quantum-blue), var(--hologram-purple));
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            text-shadow: 0 0 20px rgba(0, 247, 255, 0.3);
            letter-spacing: 2px;
        }
        
        .subtitle {
            font-size: 1.2rem;
            opacity: 0.8;
            margin-bottom: 1rem;
        }
        
        .stats-bar {
            display: flex;
            justify-content: space-around;
            background: rgba(10, 20, 40, 0.7);
            padding: 1rem;
            border-radius: 10px;
            margin-top: 1rem;
            border: 1px solid var(--quantum-blue);
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--neon-green);
            text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.7;
        }
        
        .main-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        
        @media (max-width: 768px) {
            .main-content {
                grid-template-columns: 1fr;
            }
        }
        
        .panel {
            background: rgba(15, 15, 35, 0.8);
            border-radius: 15px;
            padding: 1.5rem;
            border: 1px solid var(--quantum-blue);
            box-shadow: 0 0 20px rgba(0, 247, 255, 0.1);
            position: relative;
            overflow: hidden;
        }
        
        .panel::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 200%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent, 
                rgba(0, 247, 255, 0.1), 
                transparent);
            animation: scan 3s linear infinite;
        }
        
        @keyframes scan {
            0% { left: -100%; }
            100% { left: 100%; }
        }
        
        .panel-header {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: var(--quantum-blue);
            display: flex;
            align-items: center;
        }
        
        .panel-header i {
            margin-right: 10px;
        }
        
        .compression-visualization {
            height: 300px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .file-representation {
            width: 180px;
            height: 240px;
            background: rgba(30, 50, 100, 0.5);
            border: 2px solid var(--quantum-blue);
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
            transition: all 0.5s ease;
        }
        
        .file-representation.compressed {
            transform: scale(0.3);
            background: rgba(189, 0, 255, 0.3);
            border-color: var(--hologram-purple);
        }
        
        .file-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            color: var(--quantum-blue);
        }
        
        .file-size {
            font-size: 1.2rem;
            font-weight: bold;
        }
        
        .file-name {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-top: 0.5rem;
        }
        
        .compression-animation {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            pointer-events: none;
        }
        
        .helix {
            position: absolute;
            width: 200px;
            height: 400px;
            transform-style: preserve-3d;
            animation: rotate 15s linear infinite;
        }
        
        @keyframes rotate {
            0% { transform: rotateY(0deg) rotateX(20deg); }
            100% { transform: rotateY(360deg) rotateX(20deg); }
        }
        
        .helix-dna {
            position: absolute;
            width: 100%;
            height: 100%;
            transform: translateZ(100px);
        }
        
        .helix-node {
            position: absolute;
            width: 10px;
            height: 10px;
            background: var(--quantum-blue);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 15px var(--quantum-blue);
        }
        
        .helix-connection {
            position: absolute;
            height: 2px;
            background: var(--hologram-purple);
            transform-origin: 0 0;
        }
        
        .format-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
            gap: 1rem;
        }
        
        .format-card {
            background: rgba(25, 30, 60, 0.7);
            border-radius: 8px;
            padding: 1rem;
            text-align: center;
            border: 1px solid rgba(0, 247, 255, 0.3);
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .format-card:hover {
            transform: translateY(-5px);
            border-color: var(--quantum-blue);
            box-shadow: 0 5px 15px rgba(0, 247, 255, 0.3);
        }
        
        .format-icon {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: var(--quantum-blue);
        }
        
        .format-name {
            font-weight: bold;
            margin-bottom: 0.3rem;
        }
        
        .format-stats {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .progress-container {
            background: rgba(20, 25, 50, 0.7);
            border-radius: 10px;
            padding: 1rem;
            margin-top: 1rem;
        }
        
        .progress-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
        }
        
        .progress-bar {
            height: 20px;
            background: rgba(10, 15, 30, 0.8);
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--hologram-purple), var(--quantum-blue));
            border-radius: 10px;
            width: 0%;
            transition: width 1.5s ease-in-out;
        }
        
        .compression-controls {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        select, button {
            padding: 0.8rem 1.2rem;
            border: none;
            border-radius: 5px;
            background: rgba(30, 50, 100, 0.7);
            color: white;
            font-size: 1rem;
            border: 1px solid var(--quantum-blue);
        }
        
        button {
            background: linear-gradient(90deg, var(--hologram-purple), var(--quantum-blue));
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        
        button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 247, 255, 0.4);
        }
        
        .results-panel {
            margin-top: 2rem;
        }
        
        .result-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
        }
        
        .result-card {
            background: rgba(25, 30, 60, 0.7);
            border-radius: 8px;
            padding: 1rem;
            border: 1px solid rgba(0, 247, 255, 0.3);
        }
        
        .result-value {
            font-size: 1.8rem;
            font-weight: bold;
            color: var(--neon-green);
            text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
        }
        
        .result-label {
            font-size: 0.9rem;
            opacity: 0.8;
            margin-top: 0.3rem;
        }
        
        .history-panel {
            margin-top: 2rem;
        }
        
        .history-item {
            display: flex;
            justify-content: space-between;
            padding: 0.8rem;
            border-bottom: 1px solid rgba(0, 247, 255, 0.2);
        }
        
        .history-item:last-child {
            border-bottom: none;
        }
        
        .history-name {
            flex: 2;
        }
        
        .history-stats {
            flex: 1;
            text-align: right;
            color: var(--neon-green);
        }
        
        footer {
            text-align: center;
            margin-top: 3rem;
            padding-top: 2rem;
            border-top: 1px solid var(--quantum-blue);
            opacity: 0.7;
            font-size: 0.9rem;
        }
        
        .quantum-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--quantum-blue);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--quantum-blue);
            pointer-events: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>QUANTUM HELIX HYPER-COMPRESSION</h1>
            <div class="subtitle">Beyond Traditional Limits with Quantum-Entangled Compression Algorithms</div>
            
            <div class="stats-bar">
                <div class="stat-item">
                    <div class="stat-value">220:1</div>
                    <div class="stat-label">Compression Ratio</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">99.8%</div>
                    <div class="stat-label">Accuracy</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">340x</div>
                    <div class="stat-label">Faster</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">0.02W</div>
                    <div class="stat-label">Per GB</div>
                </div>
            </div>
        </header>
        
        <div class="main-content">
            <div class="panel">
                <div class="panel-header">
                    <i>📁</i> Compression Visualization
                </div>
                
                <div class="compression-visualization">
                    <div class="file-representation" id="fileOriginal">
                        <div class="file-icon">📄</div>
                        <div class="file-size" id="originalSize">2.4 GB</div>
                        <div class="file-name">original_data.bin</div>
                    </div>
                    
                    <div class="file-representation compressed" id="fileCompressed">
                        <div class="file-icon">💾</div>
                        <div class="file-size" id="compressedSize">11.2 MB</div>
                        <div class="file-name">compressed.hlc</div>
                    </div>
                    
                    <div class="compression-animation" id="helixAnimation"></div>
                </div>
                
                <div class="progress-container">
                    <div class="progress-header">
                        <span>Compression Progress</span>
                        <span id="progressPercent">0%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" id="progressFill"></div>
                    </div>
                </div>
                
                <div class="compression-controls">
                    <select id="formatSelect">
                        <option value="llm">LLM Models (.bin, .safetensors)</option>
                        <option value="db">Databases (.db, .sqlite)</option>
                        <option value="sci">Scientific Data (.csv, .json)</option>
                        <option value="media">Media Files (.mp4, .jpg)</option>
                        <option value="logs">Logs (.log, .txt)</option>
                        <option value="backup">Backups (.bak, .backup)</option>
                    </select>
                    
                    <button id="compressBtn">COMPRESS NOW</button>
                </div>
            </div>
            
            <div class="panel">
                <div class="panel-header">
                    <i>🔧</i> Compression Formats
                </div>
                
                <div class="format-grid">
                    <div class="format-card">
                        <div class="format-icon">🧠</div>
                        <div class="format-name">LLM Models</div>
                        <div class="format-stats">85-92% Reduction</div>
                    </div>
                    
                    <div class="format-card">
                        <div class="format-icon">🗃️</div>
                        <div class="format-name">Databases</div>
                        <div class="format-stats">78-84% Reduction</div>
                    </div>
                    
                    <div class="format-card">
                        <div class="format-icon">🔬</div>
                        <div class="format-name">Scientific Data</div>
                        <div class="format-stats">80-88% Reduction</div>
                    </div>
                    
                    <div class="format-card">
                        <div class="format-icon">🎬</div>
                        <div class="format-name">Media Files</div>
                        <div class="format-stats">65-75% Reduction</div>
                    </div>
                    
                    <div class="format-card">
                        <div class="format-icon">📝</div>
                        <div class="format-name">Logs</div>
                        <div class="format-stats">90-95% Reduction</div>
                    </div>
                    
                    <div class="format-card">
                        <div class="format-icon">💾</div>
                        <div class="format-name">Backups</div>
                        <div class="format-stats">60-70% Reduction</div>
                    </div>
                </div>
                
                <div class="results-panel">
                    <div class="panel-header">
                        <i>📊</i> Compression Results
                    </div>
                    
                    <div class="result-grid">
                        <div class="result-card">
                            <div class="result-value" id="ratioValue">220:1</div>
                            <div class="result-label">Compression Ratio</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-value" id="timeValue">0.48s</div>
                            <div class="result-label">Processing Time</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-value" id="energyValue">0.02W</div>
                            <div class="result-label">Energy Used</div>
                        </div>
                        
                        <div class="result-card">
                            <div class="result-value" id="savingsValue">2.39 GB</div>
                            <div class="result-label">Space Saved</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="panel history-panel">
            <div class="panel-header">
                <i>🕒</i> Compression History
            </div>
            
            <div id="historyList">
                <div class="history-item">
                    <div class="history-name">llm_model_v4.safetensors</div>
                    <div class="history-stats">7.2GB → 32MB (225:1)</div>
                </div>
                <div class="history-item">
                    <div class="history-name">research_data.json</div>
                    <div class="history-stats">890MB → 4.1MB (217:1)</div>
                </div>
                <div class="history-item">
                    <div class="history-name">database_backup.db</div>
                    <div class="history-stats">4.3GB → 19.5MB (225:1)</div>
                </div>
                <div class="history-item">
                    <div class="history-name">system_logs_2023.log</div>
                    <div class="history-stats">2.1GB → 9.2MB (228:1)</div>
                </div>
                <div class="history-item">
                    <div class="history-name">training_video.mp4</div>
                    <div class="history-stats">3.7GB → 17.2MB (220:1)</div>
                </div>
            </div>
        </div>
        
        <footer>
            Quantum HELIX Compression System v2.0 | Beyond Traditional Limits | 220:1 Compression Ratio Achieved
        </footer>
    </div>

    <script>
        // Create quantum particles
        function createQuantumParticles() {
            const container = document.querySelector('.container');
            const particleCount = 20;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.classList.add('quantum-particle');
                
                // Random position
                const left = Math.random() * 100;
                const top = Math.random() * 100;
                particle.style.left = `${left}%`;
                particle.style.top = `${top}%`;
                
                // Random animation
                const duration = 2 + Math.random() * 3;
                const delay = Math.random() * 5;
                
                particle.style.animation = `float ${duration}s ${delay}s infinite ease-in-out`;
                
                // Add to container
                container.appendChild(particle);
            }
        }
        
        // Add keyframes for floating animation
        function addKeyframes() {
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes float {
                    0% { transform: translate(0, 0); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Create DNA helix animation
        function createHelix() {
            const container = document.getElementById('helixAnimation');
            const helix = document.createElement('div');
            helix.classList.add('helix');
            
            // Create DNA structure
            for (let i = 0; i < 36; i++) {
                const angle = (i * 10) * (Math.PI / 180);
                const radius = 80;
                
                // Left node
                const leftNode = document.createElement('div');
                leftNode.classList.add('helix-node');
                leftNode.style.left = `${50 + Math.sin(angle) * radius}px`;
                leftNode.style.top = `${50 + i * 10}px`;
                
                // Right node
                const rightNode = document.createElement('div');
                rightNode.classList.add('helix-node');
                rightNode.style.left = `${50 + Math.sin(angle + Math.PI) * radius}px`;
                rightNode.style.top = `${50 + i * 10}px`;
                
                // Connection
                if (i > 0) {
                    const connection = document.createElement('div');
                    connection.classList.add('helix-connection');
                    connection.style.left = `${50 + Math.sin(angle) * radius}px`;
                    connection.style.top = `${50 + i * 10}px`;
                    
                    const prevAngle = ((i-1) * 10) * (Math.PI / 180);
                    const prevX = 50 + Math.sin(prevAngle + Math.PI) * radius;
                    const prevY = 50 + (i-1) * 10;
                    
                    const deltaX = prevX - (50 + Math.sin(angle) * radius);
                    const deltaY = prevY - (50 + i * 10);
                    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const rotation = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
                    
                    connection.style.width = `${length}px`;
                    connection.style.transform = `rotate(${rotation}deg)`;
                    
                    helix.appendChild(connection);
                }
                
                helix.appendChild(leftNode);
                helix.appendChild(rightNode);
            }
            
            container.appendChild(helix);
        }
        
        // Simulate compression
        function simulateCompression() {
            const progressFill = document.getElementById('progressFill');
            const progressPercent = document.getElementById('progressPercent');
            const compressBtn = document.getElementById('compressBtn');
            const originalSize = document.getElementById('originalSize');
            const compressedSize = document.getElementById('compressedSize');
            const ratioValue = document.getElementById('ratioValue');
            const timeValue = document.getElementById('timeValue');
            const energyValue = document.getElementById('energyValue');
            const savingsValue = document.getElementById('savingsValue');
            const fileOriginal = document.getElementById('fileOriginal');
            const fileCompressed = document.getElementById('fileCompressed');
            
            // Disable button during compression
            compressBtn.disabled = true;
            compressBtn.textContent = 'COMPRESSING...';
            
            // Reset progress
            progressFill.style.width = '0%';
            progressPercent.textContent = '0%';
            
            // Generate random file size between 500MB and 5GB
            const originalSizeMB = 500 + Math.floor(Math.random() * 4500);
            const originalSizeGB = (originalSizeMB / 1000).toFixed(1);
            originalSize.textContent = `${originalSizeGB} GB`;
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 2;
                if (progress > 100) progress = 100;
                
                progressFill.style.width = `${progress}%`;
                progressPercent.textContent = `${progress}%`;
                
                // Visual effects
                if (progress > 30) {
                    fileOriginal.style.opacity = `${1 - (progress-30)/70}`;
                }
                
                if (progress > 70) {
                    fileCompressed.style.opacity = `${(progress-70)/30}`;
                }
                
                if (progress === 100) {
                    clearInterval(interval);
                    
                    // Compression complete
                    const compressionRatio = 200 + Math.floor(Math.random() * 40); // 200:1 to 240:1
                    const compressedSizeMB = originalSizeMB / compressionRatio;
                    
                    compressedSize.textContent = compressedSizeMB > 1 ? 
                        `${compressedSizeMB.toFixed(1)} MB` : 
                        `${(compressedSizeMB * 1000).toFixed(0)} KB`;
                    
                    ratioValue.textContent = `${compressionRatio}:1`;
                    timeValue.textContent = `${(0.3 + Math.random() * 0.4).toFixed(2)}s`;
                    energyValue.textContent = `${(0.01 + Math.random() * 0.02).toFixed(2)}W`;
                    savingsValue.textContent = `${(originalSizeMB * 0.999).toFixed(1)} MB`;
                    
                    // Re-enable button
                    compressBtn.disabled = false;
                    compressBtn.textContent = 'COMPRESS NOW';
                    
                    // Add to history
                    addToHistory(`data_${Date.now()}.bin`, originalSizeMB, compressedSizeMB, compressionRatio);
                }
            }, 50);
        }
        
        // Add to history
        function addToHistory(name, originalMB, compressedMB, ratio) {
            const historyList = document.getElementById('historyList');
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            
            const originalGB = (originalMB / 1000).toFixed(1);
            const compressedSize = compressedMB > 1 ? 
                `${compressedMB.toFixed(1)}MB` : 
                `${(compressedMB * 1000).toFixed(0)}KB`;
            
            historyItem.innerHTML = `
                <div class="history-name">${name}</div>
                <div class="history-stats">${originalGB}GB → ${compressedSize} (${ratio}:1)</div>
            `;
            
            // Add to top of list
            historyList.insertBefore(historyItem, historyList.firstChild);
        }
        
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createHelix();
            createQuantumParticles();
            addKeyframes();
            
            // Set up button event
            document.getElementById('compressBtn').addEventListener('click', simulateCompression);
            
            // Initial simulation
            setTimeout(simulateCompression, 1000);
        });
    </script>
</body>
</html>