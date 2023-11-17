export interface Evento{
    titulo:string;
    fecha_inicio:string;
    hora_inicio:string;
    fecha_fin:string;
    hora_fin:string;
    detalle:DetalleEvento
}

export interface DetalleEvento{
    id:string;
    motivo:string;
    notas:string;
    id_estatus_cita:string;
    id_estatus_pago:string;
    id_tipo_pago:string;
    id_medico:string;
    id_paciente:string;
    id_clinica:string;
    id_usuario:string;
    fecha_creacion:Date;
}