export interface Cita{
    title: string;
    start: string; 
    end: string;   
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
    id_clinica:string;
    id_usuario:string;
    nombre_usuario_creador:string;
    fecha_creacion:Date;
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
    id_paciente;
}