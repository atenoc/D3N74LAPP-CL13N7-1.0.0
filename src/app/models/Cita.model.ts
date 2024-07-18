export interface Cita{
    title: string;
    start: Date; 
    end: Date;   
    backgroundColor: string;
    borderColor: string;
    editable: boolean;
    data: DetalleCita;
}

export interface DetalleCita{
    id:string;
    motivo:string;
    nombreP:string;
    apellidopP:string
    apellidomP:string
    nombre_paciente:string;
    notas:string;
    id_estatus_cita:string;
    id_estatus_pago:string;
    id_tipo_pago:string;
    id_medico:string;
    id_paciente:string;
    nombre_usuario_medico:string;
    id_clinica:string;
    id_usuario_creador:string;
    nombre_usuario_creador:string;
    fecha_creacion:Date;
    nombre_usuario_actualizo:string;
    fecha_actualizacion:string
}

export interface CitaEditar{
    id:string;
    title: string;
    start: string; 
    end: string;   
    backgroundColor: string;
    motivo:string;
    nombre:string;
    apellidop:string
    apellidom:string
    edad: string
    telefono:string;
    id_paciente:string;
    id_usuario_medico:string;
    nombre_usuario_medico:string;
    nombre_usuario_creador:string;
    fecha_creacion:string;
    nombre_usuario_actualizo:string;
    fecha_actualizacion:string
}

export interface CitaPaciente{
    id:string;
    titulo: string;
    fecha_hora_inicio:string;
    motivo: string;
    nombre_usuario_medico:string;
}