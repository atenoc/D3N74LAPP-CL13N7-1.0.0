export interface Usuario{
    contador:number;
    id:string;
    correo:string;
    llave:string;
    id_rol:string;
    rol:string
    desc_rol:string
    id_titulo:string,
    titulo:string
    desc_titulo:string,  
    nombre:string, 
    apellidop:string, 
    apellidom:string, 
    id_especialidad:string,
    especialidad:string, 
    telefono:string,
    llave_status:number
    id_clinica:string;
    id_plan:string
    plan :string
    id_usuario_creador:string;
    nombre_usuario_creador:string;
    fecha_creacion:string;
    nombre_usuario_actualizo:string;
    fecha_actualizacion:string;
}

export interface UsuariosPaginados {
    data: Usuario[];
    pagination: {
      page: number;
      size: number;
      totalPages: number;
      totalElements: number;
    };
}