export interface Paciente{
    id:string;
    nombre:string, 
    apellidop:string, 
    apellidom:string,
    edad:string,
    fecha_nac:string,
    id_sexo:string, 
    telefono:string,
    correo:string;
    direccion:string,
    id_clinica:string;
    //id_usuario_creador:string;
    nombre_usuario_creador:string;
    fecha_creacion:string;
    nombre_usuario_actualizo:string;
    fecha_actualizacion:string;
}

export interface PacientesPaginados {
    data: Paciente[];
    pagination: {
      page: number;
      size: number;
      totalPages: number;
      totalElements: number;
    };
}