import { useState, useRef } from 'react';
import { Shield, Send, Image, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../../lib/context/AuthContext';

export function StudentReport() {
    const { currentUser } = useAuth();
    const [reportData, setReportData] = useState({
        incidentType: '',
        description: '',
        date: '',
        location: '',
        anonymous: false,
        image: null as File | null
    });
    
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setReportData({ ...reportData, image: file });
            
            // Crear URL para vista previa
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const removeImage = () => {
        setReportData({ ...reportData, image: null });
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Crear FormData para enviar el reporte con la imagen
            const formData = new FormData();
            
            // Añadir todos los campos del reporte
            formData.append('type', 'bullying');
            formData.append('title', `Reporte de ${reportData.incidentType}`);
            formData.append('description', reportData.description);
            formData.append('date', reportData.date);
            formData.append('location', reportData.location);
            formData.append('priority', 'high'); // Por defecto, los reportes de bullying son alta prioridad
            formData.append('anonymous', String(reportData.anonymous));
            
            // Añadir información del estudiante si no es anónimo
            if (!reportData.anonymous && currentUser) {
                formData.append('studentName', currentUser.displayName || 'Estudiante');
                formData.append('studentId', currentUser.id);
            }
            
            // Añadir la imagen si existe
            if (reportData.image instanceof File) {
                formData.append('image', reportData.image);
            }
            
            // Enviar el reporte al servidor
            const response = await fetch('/api/reports', { 
                method: 'POST', 
                body: formData 
            });
            
            if (!response.ok) {
                throw new Error('Error al enviar el reporte');
            }
            
            toast.success('Tu reporte ha sido enviado. Gracias por ayudar a mantener un ambiente seguro.');
            setReportData({
                incidentType: '',
                description: '',
                date: '',
                location: '',
                anonymous: false,
                image: null
            });
            setImagePreview(null);
        } catch (error) {
            console.error('Error al enviar reporte:', error);
            toast.error('Hubo un error al enviar tu reporte. Por favor, intenta de nuevo.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-center mb-6">
                    <Shield className="h-12 w-12 text-violet-600" />
                </div>
                <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                    Reportar Incidente
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Tu reporte es confidencial y nos ayuda a mantener un ambiente seguro para todos.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Incidente
                        </label>
                        <select
                            value={reportData.incidentType}
                            onChange={(e) => setReportData({ ...reportData, incidentType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        >
                            <option value="">Selecciona un tipo</option>
                            <option value="bullying">Bullying</option>
                            <option value="cyberbullying">Cyberbullying</option>
                            <option value="discriminacion">Discriminación</option>
                            <option value="acoso">Acoso</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            value={reportData.description}
                            onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            rows={4}
                            placeholder="Describe lo que sucedió..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha del Incidente
                        </label>
                        <input
                            type="date"
                            value={reportData.date}
                            onChange={(e) => setReportData({ ...reportData, date: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Lugar
                        </label>
                        <input
                            type="text"
                            value={reportData.location}
                            onChange={(e) => setReportData({ ...reportData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
                            placeholder="¿Dónde ocurrió?"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="anonymous"
                            checked={reportData.anonymous}
                            onChange={(e) => setReportData({ ...reportData, anonymous: e.target.checked })}
                            className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                        />
                        <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                            Mantener mi reporte anónimo
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Adjuntar Imagen (opcional)
                        </label>
                        <div className="mt-1 flex items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                            >
                                <Image className="h-5 w-5 mr-2 text-gray-500" />
                                Seleccionar Imagen
                            </label>
                        </div>
                        
                        {imagePreview && (
                            <div className="mt-3 relative">
                                <div className="relative">
                                    <img 
                                        src={imagePreview} 
                                        alt="Vista previa" 
                                        className="mt-2 max-h-40 rounded-md" 
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {reportData.image?.name}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
                        >
                            <Send className="h-5 w-5 mr-2" />
                            Enviar Reporte
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>
                        Si estás en una situación de emergencia, por favor contacta inmediatamente a un profesor o adulto de confianza.
                    </p>
                </div>
            </div>
        </div>
    );
}