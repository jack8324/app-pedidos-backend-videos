import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {llaves} from '../config/llaves';
import {Persona} from '../models';
import {PersonaRepository} from '../repositories';
const generator=require("password-generator");
const cryptoJS=require("crypto-js");
const jwt=require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PersonaRepository)
    public personaRepository : PersonaRepository
    ) {}

  /*
   * Add service methods here
   */
GenerarClave(){

  let clave= generator(8,false);
  return clave;
}
CifrarClave(clave:string){
  let claveCifrada = cryptoJS.MD5(clave).toString();
  return claveCifrada;
}
identificarPersona(usuario: string, clave: string){
  try {
    let p= this.personaRepository.findOne({where:{correo:usuario, clave:clave}});
    if(p){
    return p;
    }
    return false;
  }
  catch  {
    return false;
  }
}
generarTokenJWT(persona:Persona){
  let token = jwt.sign({
    data:{
      id:persona.id,
      correo:persona.correo,
      nombre:persona.nombre+" "+persona.apellidos
    }
  },
    llaves.claveJWT);
  return token;
}

validarTokenJWT(token:string){
  try{
    let datos=jwt.verify(token,llaves.claveJWT);
    return datos;
  }catch{
    return false;
  }

}
}
