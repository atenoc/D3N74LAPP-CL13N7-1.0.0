export interface Historia{
    id:string;
    id_paciente:string, 
    ultima_visita_dentista:string, 
    problemas_dentales_pasados:string,
    tratamientos_previos_cuando:string,
    dolor_sensibilidad:string,

    condicion_medica_actual:string, 
    medicamentos_actuales:string,
    alergias_conocidas:string;
    cirugias_enfermedades_graves:string,

    frecuencia_cepillado:string;
    uso_hilo_dental:string;
    uso_productos_especializados:string;
    tabaco_frecuencia:string;
    habito_alimenticio:string;

    nombre_usuario_creador:string;
    fecha_creacion:string;
    nombre_usuario_actualizo:string;
    fecha_actualizacion:string;
}