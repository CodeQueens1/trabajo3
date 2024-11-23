import { NivelEducacional } from './nivel-educacional';
import { Persona } from "./persona";
import { DataBaseService } from '../services/data-base.service';
import { Optional } from '@angular/core';

export class Usuario extends Persona {
    public cuenta: string;
    public correo: string;
    public password: string;
    public preguntaSecreta: string;
    public respuestaSecreta: string;
    public listaUsuarios: Usuario[];
    public direccion: string;// NUEVO CAMPO

    constructor(@Optional() private db?: DataBaseService) {
        super();
        this.cuenta = '';
        this.correo = '';
        this.password = '';
        this.preguntaSecreta = '';
        this.respuestaSecreta = '';
        this.nombre = '';
        this.apellido = '';
        this.nivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
        this.fechaNacimiento = undefined;
        this.listaUsuarios = [];
        this.direccion = ''; // INICIALIZACIÓN DEL NUEVO CAMPO
    }

    public static getNewUsuario(
        cuenta: string,
        correo: string,
        password: string,
        preguntaSecreta: string,
        respuestaSecreta: string,
        nombre: string,
        apellido: string,
        nivelEducacional: NivelEducacional,
        fechaNacimiento: Date | undefined,
        direccion: string
    ) {
        let usuario = new Usuario();
        usuario.cuenta = cuenta;
        usuario.correo = correo;
        usuario.password = password;
        usuario.preguntaSecreta = preguntaSecreta;
        usuario.respuestaSecreta = respuestaSecreta;
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.nivelEducacional = nivelEducacional;
        usuario.fechaNacimiento = fechaNacimiento ? new Date(fechaNacimiento) : undefined;

        if (usuario.fechaNacimiento && isNaN(usuario.fechaNacimiento.getTime())) {
            console.warn('Fecha de nacimiento inválida, se establecerá como undefined');
            usuario.fechaNacimiento = undefined;
        }

        usuario.direccion = direccion || 'Sin dirección definida'; // Valor por defecto si falta
        return usuario;
    }

    async guardarUsuario(usuario: Usuario): Promise<void> {
        if (!this.db) {
            console.error('Conexión a la base de datos no inicializada.');
            throw new Error('La conexión a la base de datos no está inicializada.');
        }

        if (!usuario.cuenta || !usuario.correo || !usuario.password) {
            throw new Error('Los campos cuenta, correo y contraseña son obligatorios.');
        }

        if (!usuario.direccion) {
            usuario.direccion = 'Sin dirección definida'; // Valor por defecto
        }

        console.log('Preparando datos para guardar en la base de datos:', usuario);

        try {
            await this.db.guardarUsuario(usuario); // Llama al servicio de base de datos
            console.log('Usuario guardado correctamente en la base de datos.');
        } catch (error) {
            console.error('Error al guardar usuario en la base de datos:', error);
            throw error;
        }
    }

    public override toString(): string {
        return `
            Cuenta: ${this.cuenta}
            Correo: ${this.correo}
            Contraseña: ${this.password}
            Pregunta Secreta: ${this.preguntaSecreta}
            Respuesta Secreta: ${this.respuestaSecreta}
            Nombre: ${this.nombre}
            Apellido: ${this.apellido}
            Nivel Educacional: ${this.nivelEducacional.getEducacion()}
            Fecha de Nacimiento: ${this.fechaNacimiento ? this.fechaNacimiento.toISOString() : 'No definida'}
            Dirección: ${this.direccion}
        `;
    }
}
