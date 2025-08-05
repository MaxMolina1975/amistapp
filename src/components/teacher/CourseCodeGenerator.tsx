import React, { useState } from 'react';
import { Copy, RefreshCw, Check, Edit, Save } from 'lucide-react';

interface CourseCodeGeneratorProps {
  courseId: string;
  currentCode?: string;
  onGenerateCode: (courseId: string) => Promise<string>;
  onUpdateCode?: (courseId: string, code: string) => Promise<boolean>;
}

export function CourseCodeGenerator({ 
  courseId, 
  currentCode, 
  onGenerateCode, 
  onUpdateCode 
}: CourseCodeGeneratorProps) {
  const [code, setCode] = useState<string>(currentCode || '');
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedCode, setEditedCode] = useState<string>(currentCode || '');


  const generateNewCode = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newCode = await onGenerateCode(courseId);
      setCode(newCode);
      setEditedCode(newCode);
      
      if (onUpdateCode) {
        await onUpdateCode(courseId, newCode);
      }
      
      setCopied(false);
      setIsEditing(false);
    } catch (err) {
      setError('Error al generar el código');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const saveEditedCode = async () => {
    if (!editedCode.trim()) {
      setError('El código no puede estar vacío');
      return;
    }
    
    // Validar formato del código (letras, números, guiones)
    const codeRegex = /^[A-Za-z0-9\-]+$/;
    if (!codeRegex.test(editedCode)) {
      setError('El código solo puede contener letras, números y guiones');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (onUpdateCode) {
        const success = await onUpdateCode(courseId, editedCode);
        if (!success) {
          throw new Error('No se pudo actualizar el código');
        }
      }
      
      setCode(editedCode);
      setCopied(false);
      setIsEditing(false);
    } catch (err) {
      setError('Error al actualizar el código');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditedCode(code);
  };

  const copyToClipboard = () => {
    if (!code) return;
    
    navigator.clipboard.writeText(code)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        setError('Error al copiar al portapapeles');
      });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-medium text-gray-800 mb-3">Código del Curso</h3>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-2 rounded-md text-sm mb-3">
          {error}
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <div className="flex-1">
          {isEditing ? (
            <input 
              type="text" 
              value={editedCode} 
              onChange={(e) => setEditedCode(e.target.value)}
              className="font-mono text-lg w-full p-3 rounded-md border border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="Ingresa el código del curso"
            />
          ) : code ? (
            <div className="font-mono text-lg bg-gray-50 p-3 rounded-md border border-gray-200">
              {code}
            </div>
          ) : (
            <div className="text-gray-500 italic">
              No hay código generado
            </div>
          )}
        </div>
      </div>
      
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <button
              onClick={saveEditedCode}
              disabled={loading}
              className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Código'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
            >
              <span>Cancelar</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={generateNewCode}
              disabled={loading}
              className="flex items-center justify-center px-3 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {loading ? 'Generando...' : code ? 'Regenerar Código' : 'Generar Código'}
            </button>
            
            {code && (
              <>
                <button
                  onClick={toggleEditing}
                  className="flex items-center justify-center px-3 py-2 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span>Editar</span>
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Este código permite a los estudiantes unirse a tu curso durante el registro.</p>
      </div>
    </div>
  );
}