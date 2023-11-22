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
    //nombre_usuario_creador:string;
    id_clinica:string;
    id_usuario:string;
    fecha_creacion:Date;
}