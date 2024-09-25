export interface Auditoria{
    contador:number;
    id_usuario:string;
    nombre_usuario:string;
    tipo_evento:string, 
    tabla_afectada:string, 
    fecha_evento:string
}

export interface AuditoriaPaginados {
    data: Auditoria[];
    pagination: {
      page: number;
      size: number;
      totalPages: number;
      totalElements: number;
    };
}