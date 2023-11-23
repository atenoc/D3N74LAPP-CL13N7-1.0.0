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