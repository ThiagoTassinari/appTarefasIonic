import { async } from '@angular/core/testing';
import { Usuario } from './../models/Usuario';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  public listaUsuarios = [];

  constructor(private armazenamentoService: ArmazenamentoService) { }

  public async buscarTodos() {
    this.listaUsuarios = await this.armazenamentoService.pegarDados('usuarios');
    
    if(!this.listaUsuarios) {
      this.listaUsuarios = [];
    }
  }

  public async salvar(usuario: Usuario) {
    await this.buscarTodos();

    if(!usuario) {
      return false;
    }

    if(!this.listaUsuarios) {
      this.listaUsuarios = [];
    }

    this.listaUsuarios.push(usuario);

    return await this.armazenamentoService.salvarDados('usuarios', this.listaUsuarios);
  }

  public async login(email: string, senha: string) {
    let usuario: Usuario;

    await this.buscarTodos(); // Primeiro precisamos buscar todos os usuários no banco de dados

    const listaTemporaria = this.listaUsuarios.filter(usuarioArmazenado => {
      return(usuarioArmazenado.email == email && usuarioArmazenado.senha == senha);
    }); // Retorna um array;

    if(listaTemporaria.length > 0) {
      usuario = listaTemporaria.reduce(item => item);
    }

    return usuario;
  }

  public salvarUsuarioLogado(usuario: Usuario) {
    delete usuario.senha;
    this.armazenamentoService.salvarDados('usuarioLogado', usuario);
  }

  public async buscarUsuarioLogado() {
    return await this.armazenamentoService.pegarDados('usuarioLogado');
  }
}
