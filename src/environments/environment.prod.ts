const ipHost:string ="http://localhost:4000"
//const ipHost:string ="https://d3n74l4pp-4p1-production.up.railway.app"

export const environment = {
  production: true,
  urlApiSeguridad: ipHost+'/api/seguridad',
  urlApiUsuarios: ipHost+'/api/usuarios',
  urlApiCentros: ipHost+'/api/centros',
  urlApiRoles: ipHost+'/api/roles',
  urlApiTitulos: ipHost+'/api/titulos',
  urlApiEspecialidades: ipHost+'/api/especialidades',
  urlApiCitas: ipHost+'/api/citas',
  secretKey: '123456'
};

