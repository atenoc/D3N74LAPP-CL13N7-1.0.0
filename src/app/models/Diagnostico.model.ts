export interface Diagnostico{
    id:string;
    descripcion_problema:string;
    codigo_diagnostico:string;
    evidencias:string;
    id_paciente:string;
    id_clinica:string;
    id_usuario_creador:string;
    nombre_usuario_creador:string
    fecha_creacion:string
    id_usuario_actualizo:string
    fecha_actualizacion:string
    nombre_usuario_actualizo:string
    imagenes: Imagen[];
}

export interface Imagen {
    id: string;
    url: string;
    descripcion?: string; // La descripción puede ser opcional
}