const ipHost:string ="http://localhost:4000"

//const ipHost:string ="https://d3n74l4pp-4p1-100-production.up.railway.app" // V1

export const environment = {
  production: true,
  urlApiSeguridad: ipHost+'/api/seguridad',
  urlApiUsuarios: ipHost+'/api/usuarios',
  urlApiCentros: ipHost+'/api/centros',
  urlApiRoles: ipHost+'/api/roles',
  urlApiTitulos: ipHost+'/api/titulos',
  urlApiEspecialidades: ipHost+'/api/especialidades',
  urlApiSexo: ipHost+'/api/sexo',
  urlApiMedicos: ipHost+'/api/medicos',
  urlApiPacientes: ipHost+'/api/pacientes',
  urlApiCitas: ipHost+'/api/citas',
  urlApiHistorias: ipHost+'/api/historias',
  urlApiDiagnosticos: ipHost+'/api/diagnosticos',
  urlApiTratamientos: ipHost+'/api/tratamientos',
  urlApiSeguimientos: ipHost+'/api/seguimientos',
  urlApiPlanes: ipHost+'/api/planes',
  urlApiUploads: ipHost+'/api/uploads',
  secretKey: '123456'
};

