import { showAlert, showAlertError } from "../tools/message-functions";


export class Asistencia {

  bloqueInicio = 0;
  bloqueTermino = 0;
  dia = '';
  horaFin = '';
  horaInicio = '';
  idAsignatura = '';
  nombreAsignatura = '';
  nombreProfesor = '';
  seccion = '';
  sede = '';

  constructor() {}

  public getNewAsistencia(
    bloqueInicio: number,
    bloqueTermino: number,
    dia: string,
    horaFin: string,
    horaInicio: string,
    idAsignatura: string,
    nombreAsignatura: string,
    nombreProfesor: string,
    seccion: string,
    sede: string)
  {
    const miclase = new Asistencia();
    miclase.bloqueInicio = bloqueInicio;
    miclase.bloqueTermino = bloqueTermino;
    miclase.dia = dia;
    miclase.horaFin = horaFin;
    miclase.horaInicio = horaInicio;
    miclase.idAsignatura = idAsignatura;
    miclase.nombreAsignatura = nombreAsignatura;
    miclase.nombreProfesor = nombreProfesor;
    miclase.seccion = seccion;
    miclase.sede = sede;
    return miclase;
  }

  static isValidAsistenciaQrCode(datosQR: string, showError: boolean = false) {
    if (datosQR !== '') {
      try {
        const json = JSON.parse(datosQR);

        if (json.bloqueInicio !== undefined
          && json.bloqueTermino !== undefined
          && json.dia !== undefined
          && json.horaFin !== undefined
          && json.horaInicio !== undefined
          && json.idAsignatura !== undefined
          && json.nombreAsignatura !== undefined
          && json.nombreProfesor !== undefined
          && json.seccion !== undefined
          && json.sede !== undefined) 
          {
          return true;
        }
      } catch(error) {}
    }
    
    if (showError) {
      showAlert('El código QR escaneado no corresponde ');
    }
    return false;
  }


}


