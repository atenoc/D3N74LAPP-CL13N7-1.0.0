import Swal from 'sweetalert2';

export class Alerts {
  static success(message: string, description: string) {
    Swal.fire({
      position: 'top-end',
      html: `<h5>${message}</h5><span>${description}</span>`,
      showConfirmButton: false,
      backdrop: false,
      width: 400,
      background: 'rgb(40, 167, 69, .90)',
      color: 'white',
      timerProgressBar: true,
      timer: 3000,
    });
  }

  static warning(message: string, description: string) {
    Swal.fire({
      icon: 'warning',
      html: `<strong>${message}</strong><br/><span>${description}</span>`,
      showConfirmButton: false,
      timer: 2500
    });
  }

  static error(message: string, description: string, smallText: string) {
    Swal.fire({
      icon: 'error',
      html: `<strong>${message}</strong></br><span>${description}</span></br><small>${smallText}</small>`,
      showConfirmButton: false,
      timer: 4000
    });
  }

  static confirmDelete(message: string, description: string) {
    return Swal.fire({
      html: `<h5>${message}</h5> <strong>${description}</strong>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#aeaeae',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'No, cancelar'
    });
  }
}