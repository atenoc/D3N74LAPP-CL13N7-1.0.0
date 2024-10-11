export class ValidateInfo {
    static getUserInfo() {
      return {
        id: localStorage.getItem('_us'),
        correo: localStorage.getItem('_em'),
        id_clinica: localStorage.getItem('_cli')
        };
    }
}
