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
    fecha_creacion:Date;
    llave_status:number
    id_usuario:string;
    nombre_usuario_creador:string;
    id_clinica:string;
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