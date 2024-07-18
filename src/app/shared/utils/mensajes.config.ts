export const Mensajes = {

    // Http Error
    ERROR_500: 'Oopss, ocurrió un error ',
    WARNING: 'Aviso ',
    SUCCESS: 'Genial ',
    INTENTAR_MAS_TARDE: 'Por favor inténtalo más tarde ',
    SIN_CONEXION_RED: 'Lo sentimos, no pudimos conectarnos',

    // Cuenta
    CUENTA_ELIMINADA:'Tu cuenta ha sido eliminada de forma permanente',
    CUENTA_NO_ELIMINADA:'No se puedo eliminar tu cuenta',

    // Registro
    REGISTRO_VALIDACION: 'Por favor, rellena todos los campos ',
    REGISTRO_EXITOSO: 'Todo listo para administrar tu clínica dental ',
    REGISTRO_ERROR: 'No pudimos registrar tu información ',
    
    // Validaciones de formulario
    CAMPO_REQUERIDO: 'Este campo es requerido ',
    CORREO_VALIDO: 'Por favor, ingresa un correo válido ',
    CORREO_EXISTENTE: 'Este correo ya se encuentra registrado ',
    TELEFONO_LONGITUD:'El teléfono debe contener al menos 10 dígitos ',
    SOLO_NUMEROS: 'Por favor, ingresa sólo números ', 
    SOLO_LETRAS: 'Por favor, ingresa sólo letras ', 
    BUSQUEDA_NO_COINCIDENCIAS: 'No hay coincidencias ',
    CAMPOS_OBLIGATORIOS: 'Los campos marcados con (*) son obligatorios ',

    //Contraseña
    CONTRASENA_INVALIDA: 'La contraseña debe contener al menos una letra mayúscula (A-Z), un número (0-9) y un caracter especial (#, $, %, &, ect) ',
    CONTRASENA_LONGITUD: 'La contraseña debe contener al menos 6 caracteres ',
    CONTRASENA_ACTUALIZAR: 'Por favor, actualiza tu contraseña ', 
    CONTRASENA_VERIFICAR: 'Por favor, verifica tu correo y/o contraseña ', 
    CONTRASENA_CONFIRMACION: 'Por favor confirma tu nueva contraseña ',
    CONTRASENAS_NO_COINCIDEN: 'Las contraseñas no coinciden, verifica que sean iguales ',
    CONTRASENA_ACTUALIZADA: 'La contraseña se actualizó correctamente',
    CONTRASENA_NO_ACTUALIZADA: 'No se pudo actualizar la contraseña',

    // Usuarios
    USUARIO_EXISTENTE: 'Este usuario ya se encuentra registrado ',
    USUARIO_NO_ENCONTRADO: 'Usuario no encontrado ',
    USUARIO_REGISTRADO: 'El usuario se registró correctamente ',
    USUARIO_NO_REGISTRADO: 'No se pudo registrar el usuario ',
    USUARIO_ACTUALIZADO: 'La información del usuario se actualizó correctamente ',
    USUARIO_NO_ACTUALIZADO: 'No se pudo actualizar la información del usuario ',
    USUARIO_ELIMINAR_QUESTION: '¿Estás seguro que quieres eliminar el usuario?',
    USUARIO_ELIMINADO: 'El usuario se eliminó correctamente ',
    USUARIO_NO_ELIMINADO: 'No se pudo eliminar el usuario ',

    // Clinicas
    CLINICA_REGISTRADA: 'La clínica se registró correctamente ',
    CLINICA_NO_REGISTRADA: 'No se pudo registrar tu clínica ',
    CLINICA_ACTUALIZADA: 'La información de tu clínica se actualizó correctamente ',
    CLINICA_NO_ACTUALIZADA: 'No se pudo actualizar la información de tu clínica ',
    CLINICA_ELIMINAR_QUESTION: '¿Estás seguro que quieres eliminar tu clínica? ',
    CLINICA_ELIMINADA: 'La información de la clínica se eliminó correctamente ',
    CLINICA_NO_ELIMINADA: 'No se pudo eliminar la información de la clínica ',

    //Citas
    FECHA_INICIO_REQUERIDA: 'La fecha inicio es obligatoria ',
    FECHAS_NO_VALIDAS: 'La fecha fin debe ser igual o posterior a la fecha de inicio',
    HORARIO_INICIO_REQUERIDO: 'El horario de inicio es obligatorio ',
    HORARIO_INICIO_NO_VALIDO: 'Selecciona un horario válido ',
    HORARIOS_NO_VALIDOS: 'El horario fin debe ser posterior al horario de inicio',
    CITA_REGISTRADA: 'La cita se registró correctamente ',
    CITA_NO_REGISTRADA: 'La cita no se puedo registrar ',
    CITA_ACTUALIZADA: 'La cita se actualizó correctamente ',
    CITA_NO_ACTUALIZADA: 'No se pudo actualizar la cita ',
    CITA_ELIMINAR_QUESTION: '¿Estás seguro que quieres eliminar?',
    CITA_ELIMINADA: 'La cita se eliminó correctamente ',
    CITA_NO_ELIMINADA: 'No se pudo eliminar la cita ',
    CITA_CAMPOS_OBLIGATORIOS: 'Por favor, verifica todos los campos obligatorios',
    SELECCIONA_MEDICO_ESPECIALISTA: 'Selecciona un médico especialista',

    //Pacientes
    PACIENTE_REGISTRADO: 'El paciente se registró correctamente ',
    PACIENTE_NO_REGISTRADO: 'No se pudo registrar el paciente ',
    PACIENTE_EXISTENTE: 'Este paciente ya se encuentra registrado. ',
    PACIENTE_ACTUALIZADO: 'La información del paciente se actualizó correctamente ',
    PACIENTE_NO_ACTUALIZADO: 'No se pudo actualizar la información del paciente ',
    PACIENTE_ELIMINAR_QUESTION: '¿Estás seguro que quieres eliminar el paciente?',
    PACIENTE_ELIMINADO: 'El paciente se eliminó correctamente ',
    PACIENTE_NO_ELIMINADO: 'No se pudo eliminar el paciente ',

    //Eventos
    EVENTO_REGISTRADO: 'El evento se registró correctamente ',
    EVENTO_NO_REGISTRADO: 'El evento no se puedo registrar ',

    //Planes
    PRUEBA_GRATUITA_30: 'Prueba gratuita por 30 días ',
    PRUEBA_TERMINADA: 'Tu prueba gratuita ha terminado ', 
    PRUEBA_TERMINADA_USER: 'Algunas funcionalidades no están disponibles, contacta a tu administrador ', 

    //Historias dentales
    HISTORIA_REGISTRADA: 'La información se guardó correctamente ',
    HISTORIA_NO_REGISTRADA: 'No se pudo guardar la información ',
    HISTORIA_ACTUALIZADA: 'La información se actualizó correctamente ',
    HISTORIA_NO_ACTUALIZADA: 'No se pudo actualizar la información ',

    //Diagnosticos
    DIAGNOSTICO_REGISTRADO: 'El diagnóstico se guardó correctamente ',
    DIAGNOSTICO_NO_REGISTRADO: 'No se pudo guardar el diagnóstico ',
    DIAGNOSTICO_ACTUALIZADO: 'El diagnóstico se actualizó correctamente ',
    DIAGNOSTICO_NO_ACTUALIZADO: 'No se pudo actualizar el diagnóstico ',
    DIAGNOSTICO_ELIMINAR_QUESTION: '¿Estás seguro que quieres eliminar el diagnóstico?',
    DIAGNOSTICO_ELIMINADO: 'El diagnóstico se eliminó correctamente ',
    DIAGNOSTICO_NO_ELIMINADO: 'No se pudo eliminar el diagnóstico ',

    //Tratamientos
    TRATAMIENTO_REGISTRADO: 'El tratamiento se guardó correctamente ',
    TRATAMIENTO_NO_REGISTRADO: 'No se pudo guardar el tratamiento ',
    TRATAMIENTO_ACTUALIZADO: 'El tratamiento se actualizó correctamente ',
    TRATAMIENTO_NO_ACTUALIZADO: 'No se pudo actualizar el tratamiento ',
    TRATAMIENTO_ELIMINAR_QUESTION: '¿Estás seguro que quieres eliminar el tratamiento?',
    TRATAMIENTO_ELIMINADO: 'El tratamiento se eliminó correctamente ',
    TRATAMIENTO_NO_ELIMINADO: 'No se pudo eliminar el tratamiento ',

    //Seguimientos
    SEGUIMIENTO_REGISTRADO: 'El seguimiento se guardó correctamente ',
    SEGUIMIENTO_NO_REGISTRADO: 'No se pudo guardar el seguimiento ',
    SEGUIMIENTO_ACTUALIZADO: 'El seguimiento se actualizó correctamente ',
    SEGUIMIENTO_NO_ACTUALIZADO: 'No se pudo actualizar el seguimiento ',
    SEGUIMIENTO_ELIMINAR_QUESTION: '¿Estás seguro que quieres eliminar el seguimiento?',
    SEGUIMIENTO_ELIMINADO: 'El seguimiento se eliminó correctamente ',
    SEGUIMIENTO_NO_ELIMINADO: 'No se pudo eliminar el seguimiento ',

};