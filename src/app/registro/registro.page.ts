import { async } from '@angular/core/testing';
import { Usuario } from './../models/Usuario';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CpfValidator } from './../validators/cpf-validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';

import { UsuariosService } from './../services/usuarios.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;
  
  mensagens_validacao = {
    nome: [
      { tipo: 'required', mensagem: 'O campo Nome é obrigatório.' },
      { tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 caracteres' },
    ],
    cpf: [
      { tipo: 'required', mensagem: 'O campo CPF é obrigatório.' },
      { tipo: 'minlength', mensagem: 'O CPF deve ter pelo menos 11 caracteres.' },
      { tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 caracteres.' },
      { tipo: 'invalido', mensagem: 'CPF Inválido!' }
    ],
    dataNascimento: [
      { tipo: 'required', mensagem: 'O campo Data de Nascimento é obrigatório.' },
    ],
    genero: [
      { tipo: 'required', mensagem: 'O campo Gênero é obrigatório. '},
    ],
    celular: [
      { tipo: 'minlength', mensagem: 'O celular deve ter pelo menos 10 caracteres.' },
      { tipo: 'maxlength', mensagem: 'O celular deve ter pelo menos 16 caracteres.' },
    ],
    email: [
      { tipo: 'required', mensagem: 'O campo Email é obrigatório.' },
      { tipo: 'email', mensagem: 'E-mail Inválido.' },
    ],
    senha: [
      { tipo: 'required', mensagem: 'O campo Senha é obrigatório.' },
      {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres.' },
    ],
    confirmaSenha: [
      { tipo: 'required', mensagem: 'É obrigatório confirmar a senha.' },
      { tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 caracteres' },
      { tipo: 'comparacao', mensagem: 'Deve ser igual a senha!' }
    ]
  };

  constructor(
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    public alertController: AlertController,
    public router: Router
    ) {

    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(11),
        Validators.maxLength(14),
        CpfValidator.cpfValido
      ])],
      dataNascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirmaSenha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    }, {
      validator: ComparacaoValidator('senha', 'confirmaSenha')
    });

   }

  async ngOnInit() {
    await this.usuariosService.buscarTodos();
    console.log(this.usuariosService.listaUsuarios);
    
  }

  public async salvarFormulario() {
    if(this.formRegistro.valid){
      
      let usuario = new Usuario();
      usuario.nome = this.formRegistro.value.nome;
      usuario.cpf = this.formRegistro.value.cpf;
      usuario.dataNascimento = new Date(this.formRegistro.value.dataNascimento);
      usuario.genero = this.formRegistro.value.genero;
      usuario.celular = this.formRegistro.value.celular;
      usuario.email = this.formRegistro.value.email;
      usuario.senha = this.formRegistro.value.senha;

      if(await this.usuariosService.salvar(usuario)) {
        this.exibirAlerta('SUCESSO', 'Usuário salvo com sucesso!');
        this.router.navigateByUrl('/login');
      } else {
        this.exibirAlerta('ERRO!', 'Erro ao salvar o usuário!');
      }

    } else {
      this.exibirAlerta('ADVERTÊNCIA!', 'Formulário inválido<br/>Verifique os campos do seu formulário!');
    }
  }

  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }
}
