import { Link } from 'react-router-dom';
import { Pencil, Trash2, Eye } from 'lucide-react'; // Añadimos Eye

const TableActions = ({ 
  editLink, 
  viewLink, // Nueva prop para ver detalle
  onDelete, 
  deleteTitle = "Eliminar",
  viewTitle = "Ver detalle" 
}) => {
  return (
    <div className="flex justify-end gap-2">
      {/* Botón Ver Detalle (Lupa) */}
      {viewLink && (
        <Link
          to={viewLink}
          className="p-2 text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-white/10 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-white/20"
          title={viewTitle}
        >
          <Eye className="h-4 w-4" />
        </Link>
      )}

      {/* Botón Editar */}
      {editLink && (
        <Link
          to={editLink}
          className="p-2 text-biskoto bg-biskoto-50 dark:text-white dark:bg-white/10 rounded-lg transition-colors hover:bg-biskoto/10 dark:hover:bg-white/20"
          title="Editar"
        >
          <Pencil className="h-4 w-4" />
        </Link>
      )}

      {/* Botón Eliminar */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 rounded-lg transition-colors hover:bg-red-100 dark:hover:bg-red-900/40"
          title={deleteTitle}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default TableActions;