import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, AlertCircle, Package, DollarSign, List, 
  Info, Database, X, Image as ImageIcon, CheckCircle2, ChevronDown, Plus, Loader2
} from 'lucide-react';

import { getCategorias } from '../../api/categoriaService';
import { getSignedUploadUrl } from '../../api/storageService';
import { supabase } from '../../config/supabaseClient';

const ProductoForm = ({ initialData, onSubmit, loading: submitting, error, buttonText = 'Guardar Producto' }) => {
  const [formData, setFormData] = useState(initialData || {
    nombre: '', precio: '', descripcion: '', categoria_id: '', stock_actual: 0
  });

  const [categorias, setCategorias] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Sincroniza el formulario cuando llegan los datos de edición
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        precio: initialData.precio || '',
        descripcion: initialData.descripcion || '',
        categoria_id: initialData.categoria_id || '',
        stock_actual: initialData.stock_actual || 0
      });

      // Carga las imágenes existentes en la previsualización
      if (initialData.producto_imagenes) {
        const imagenesExistentes = initialData.producto_imagenes.map(img => ({
          id: img.id,
          preview: img.url, // Usamos la URL directa de Supabase como preview
          url: img.url,
          isPrincipal: img.es_principal,
          isExisting: true // Marcador para no volver a subirlas
        }));
        setFiles(imagenesExistentes);
      }
    }
  }, [initialData]);

  // EFECTO DE AUTO-SCROLL: Si el componente recibe un error, sube la pantalla automáticamente
  useEffect(() => {
    if (error) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [error]);

  useEffect(() => {
    const cargarCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (err) { 
        console.error("Error al cargar categorías", err); 
      }
    };
    cargarCategorias();
  }, []);

  const onDrop = useCallback(acceptedFiles => {
    const newFiles = acceptedFiles.slice(0, 10 - files.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isPrincipal: files.length === 0,
      id: Math.random().toString(36).substr(2, 9)
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 10
  });

  const removeFile = (id) => {
    setFiles(prev => {
      const filtered = prev.filter(f => f.id !== id);
      if (filtered.length > 0 && !filtered.some(f => f.isPrincipal)) {
        filtered[0].isPrincipal = true;
      }
      return filtered;
    });
  };

  const setPrincipal = (id) => {
    setFiles(prev => prev.map(f => ({ ...f, isPrincipal: f.id === id })));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'precio' || name === 'stock_actual' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      // Procesamos cada archivo del listado
      const uploadPromises = files.map(async (f, index) => {
        // SI LA IMAGEN YA EXISTÍA: No se sube nada, solo devolvemos sus datos actuales
        if (f.isExisting) {
          return {
            url: f.url,
            es_principal: f.isPrincipal,
            orden: index
          };
        }

        // SI LA IMAGEN ES NUEVA: Iniciamos el flujo seguro de subida
        const fileExt = f.file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { token, path } = await getSignedUploadUrl(fileName);

        const { error: uploadError } = await supabase.storage
          .from('productos')
          .uploadToSignedUrl(path, token, f.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('productos').getPublicUrl(path);
        
        return {
          url: publicUrl,
          es_principal: f.isPrincipal,
          orden: index
        };
      });

      // Esperamos a que se procesen todas (viejas y nuevas)
      const imagenesFinales = await Promise.all(uploadPromises);
      
      // Enviamos el objeto final al componente padre (Crear o Editar)
      await onSubmit({ ...formData, imagenes: imagenesFinales });

    } catch (err) {
      console.error("Error en el proceso de guardado:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 shadow-xl rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/50 flex items-center text-red-700 dark:text-red-400"
        >
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
{/* Sección de Imágenes con Contraste Dinámico */}
<div className="space-y-4">
  <label className="block text-sm font-semibold flex items-center gap-2 text-gray-700 dark:text-white transition-colors">
    <ImageIcon size={18} className="text-biskoto dark:text-white" /> 
    Imágenes del Producto <span className="text-xs font-normal opacity-60">(Máx. 10)</span>
  </label>
  
  <div 
    {...getRootProps()} 
    className={`border-2 border-dashed rounded-xl p-10 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3
    ${isDragActive 
      ? 'border-biskoto bg-biskoto/10 dark:border-white dark:bg-white/20' 
      : 'border-biskoto/40 bg-biskoto/5 dark:border-white/30 dark:bg-white/5 hover:border-biskoto dark:hover:border-white dark:hover:bg-white/10'
    }`}
  >
    <input {...getInputProps()} />
    
    {/* Círculo del Icono: Blanco puro en modo oscuro */}
    <div className="p-4 rounded-full bg-white dark:bg-transparent shadow-sm border border-biskoto/20 dark:border-white/40">
      <Plus size={28} className="text-biskoto dark:text-white" />
    </div>
    
    <div className="text-center">
      <p className="text-sm font-bold text-biskoto dark:text-white">
        Haz clic para subir <span className="font-normal opacity-80">o arrastra tus fotos</span>
      </p>
      <p className="text-[11px] uppercase tracking-widest text-biskoto/60 dark:text-white/50 mt-1 font-bold">
        PNG, JPG o WEBP hasta 2MB
      </p>
    </div>
  </div>

  {/* Grid de Previsualización con bordes blancos en modo oscuro */}
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
    <AnimatePresence>
      {files.map((file) => (
        <motion.div 
          key={file.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`relative aspect-square rounded-xl overflow-hidden border-2 shadow-xl transition-all ${
            file.isPrincipal 
              ? 'border-biskoto ring-4 ring-biskoto/20 dark:border-white dark:ring-white/30' 
              : 'border-white/10 dark:border-white/10'
          }`}
        >
          <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
          
          <button 
            type="button" 
            onClick={() => removeFile(file.id)} 
            className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur-md transition-colors"
          >
            <X size={14} />
          </button>

          <button 
            type="button" 
            onClick={() => setPrincipal(file.id)}
            className={`absolute bottom-2 left-2 right-2 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
              file.isPrincipal 
                ? 'bg-biskoto text-white dark:bg-white dark:text-slate-900' 
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-white backdrop-blur-sm'
            }`}
          >
            {file.isPrincipal ? '✓ Principal' : 'Usar Portada'}
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
</div>

        {/* Campos de texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2"><Package size={16} /> Nombre *</label>
            <input name="nombre" type="text" required value={formData.nombre} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-biskoto" />
          </div>

          <div className="relative">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2"><List size={16} /> Categoría</label>
            <div className="relative">
              <select name="categoria_id" value={formData.categoria_id} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-biskoto outline-none">
                <option value="">Sin categoría</option>
                {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nombre}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2"><DollarSign size={16} /> Precio *</label>
            <input name="precio" type="number" step="0.01" min="0" required value={formData.precio} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-biskoto" />
          </div>

{/* Campo de Stock Actual */}
<div>
  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
    <Database size={16} /> Stock Disponible
  </label>
  <input 
    name="stock_actual" 
    type="number" 
    min="0"
    value={formData.stock_actual} 
    onChange={handleChange} 
    className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-biskoto" 
    placeholder="0"
  />
</div>

          <div className="md:col-span-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2"><Info size={16} /> Descripción</label>
            {/* CORREGIDO: name="descripcion" para que coincida con el estado */}
            <textarea name="descripcion" rows="3" value={formData.descripcion} onChange={handleChange} className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-biskoto resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <Link to="/admin/productos" className="px-6 py-3 text-gray-500 font-medium">Cancelar</Link>
          <button 
            type="submit" 
            disabled={uploading || submitting} 
            className="bg-biskoto text-white px-10 py-3 rounded-xl font-bold hover:bg-biskoto-700 disabled:opacity-50 flex items-center gap-2 shadow-lg"
          >
            {uploading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {uploading ? 'Subiendo Imágenes...' : buttonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductoForm;