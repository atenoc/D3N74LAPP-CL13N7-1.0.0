export class DateUtil {
    static getCurrentFormattedDate(): string {
      const date = new Date();
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const seconds = ('0' + date.getSeconds()).slice(-2);
  
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    static getDateNoTime(): string {
      const date = new Date();
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2); 

      return `${day}-${month}-${year}`;
    }

    static getDateYYYYMMDD(): string {
      const date = new Date();
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2); 

      return `${year}-${month}-${day}`;
    }

    /*
    obtenerFechaHoraHoy(){
      this.date = new Date();
      const mes = this.date.getMonth() +1
      this.fecha_actual = this.date.getFullYear()+"-"+mes+"-"+this.date.getDate()+" "+this.date.getHours()+":"+this.date.getMinutes()+":00"
      return this.fecha_actual
    }*/
}
