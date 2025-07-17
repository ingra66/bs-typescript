import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para limpiar imports no utilizados
function cleanImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remover imports de React no utilizados
    content = content.replace(/import React(?:, {[^}]*})? from 'react';?\n?/g, '');
    
    // Remover imports vacíos
    content = content.replace(/import {\s*}\s*from ['"][^'"]+['"];?\n?/g, '');
    
    // Remover imports de React individuales
    content = content.replace(/,\s*React\s*(?=,|\))/g, '');
    content = content.replace(/React,\s*/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`Cleaned: ${filePath}`);
  } catch (error) {
    console.error(`Error cleaning ${filePath}:`, error.message);
  }
}

// Función para procesar directorio recursivamente
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      cleanImports(filePath);
    }
  });
}

// Procesar el directorio src
const srcDir = path.join(__dirname, 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  console.log('Import cleaning completed!');
} else {
  console.error('src directory not found');
} 