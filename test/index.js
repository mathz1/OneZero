//sample test
//Para rodar os testes, use: npm test
//PS: Os testes não estão completos e alguns podem comnter erros.

// veja mais infos em:
//https://mochajs.org/
//https://www.chaijs.com/
//https://www.chaijs.com/plugins/chai-json-schema/
//https://developer.mozilla.org/pt-PT/docs/Web/HTTP/Status (http codes)

const app =  require('../src/server.js');
const db = require('../src/database/index');

const assert = require('assert');
const chai = require('chai')
const chaiHttp = require('chai-http');
const chaiJson = require('chai-json-schema');

chai.use(chaiHttp);
chai.use(chaiJson);

const expect = chai.expect;

//Define o minimo de campos que o usuário deve ter. Geralmente deve ser colocado em um arquivo separado
const userSchema = {
    title: "Schema do Usuario, define como é o usuario, linha 24 do teste",
    type: "object",
    required: ['name', 'email', 'password', 'age'],
    properties: {
        id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        age: {
            type: 'number',
            minimum: 18
        }
    }
}

let rauppId; //variavel para armazenar o id de raupp e poder editar, ler e excluir o usuario depois

//Inicio dos testes

//este teste é simplesmente pra enteder a usar o mocha/chai
describe('Um simples conjunto de testes', function () {
    it('deveria retornar -1 quando o valor não esta presente', function () {
        assert.equal([1, 2, 3].indexOf(4), -1);
    });
});

//testes da aplicação
describe('Testes da aplicaçao',  () => {
    before(async () => {
        await db.migrate.rollback();
        await db.migrate.latest();
    });

    after(async () => {
        await db.destroy();
    });

    it('deveria ser uma lista vazia de usuarios', function (done) {
        chai.request(app)
        .get('/users')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.users).to.eql([]);
        done();
        });
    });

    it('deveria criar o usuario raupp', function (done) {
        chai.request(app)
        .post('/user/create')
        .send({name: "raupp", email: "jose.raupp@devoz.com.br", password: "1010", age: 35})
        .end(function (err, res) {
            rauppId = res.body.id;
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
        });
    });

    it('deveria criar o usuario matheus', function (done) {
        chai.request(app)
        .post('/user/create')
        .send({name: "matheus", email: "matheus.alves@devoz.com.br", password: "2020", age: 21})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
        });
    });

    it('nao deveria criar um usuario com email ja em uso', function (done) {
        chai.request(app)
        .post('/user/create')
        .send({name: "matheuzin", email: "matheus.alves@devoz.com.br", password: "2020", age: 21})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(409);
            expect(res.text).to.be.equal('{"error":"User already exists!"}');
            done();
        });
    });

    it('deveria criar a usuaria paola', function (done) {
        chai.request(app)
        .post('/user/create')
        .send({name: "paola", email: "paola.machado@devoz.com.br", password: "3030", age: 25})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
        });
    });

    it('deveria criar o usuario francisco', function (done) {
        chai.request(app)
        .post('/user/create')
        .send({name: "francisco", email: "francisco.alves@devoz.com.br", password: "4040", age: 41})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
        });
    });

    it('deveria criar a usuaria roselita', function (done) {
        chai.request(app)
        .post('/user/create')
        .send({name: "roselita", email: "roselita.flor@devoz.com.br", password: "5050", age: 40})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
        });
    });

    it('deveria criar a usuaria jennifer', function (done) {
        chai.request(app)
        .post('/user/create')
        .send({name: "jennifer", email: "jennifer.marinho@devoz.com.br", password: "6060", age: 21})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(201);
            done();
        });
    });

    it('o usuario bolinha tem menos de 18 anos', function (done) {
        chai.request(app)
        .post('/user/create')
        .send({name:"bolinha", email:"bolinha@devoz.com.br", password: "7070", age: 16})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.text).to.be.equal('{"error":"Under age!"}');
            expect(res).to.have.status(400);
            done();
        });
    });

    it('o usuario naoExiste não existe no sistema', function (done) {
        chai.request(app)
        .get('/user/read')
        .set('authorization', '6b2ca6ca')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res.text).to.be.equal('{"error":"User not exists!"}');
            expect(res).to.have.status(404);
            expect(res.body).to.be.jsonSchema(userSchema.properties);
            done();
        });
    });

    it('nao deveria retornar usuario se o id nao for passado no header', function (done) {
        chai.request(app)
        .get('/user/read')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            done();
        });
    });

    it('o usuario raupp existe e é valido', function (done) {
        chai.request(app)
        .get('/user/read')
        .set('authorization', rauppId)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.jsonSchema(userSchema.properties);
            done();
        });
    });

    it('nao deveria editar um usuario que nao existe', function (done) {
        chai.request(app)
        .patch('/user/update')
        .set('authorization', '6b2ca6ca')
        .send({name:'naoexiste'})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.text).to.be.equal('{"error":"User not exists!"}');
            done();
        });
    });

    it('nao deveria editar se o id nao for passado no header', function (done) {
        chai.request(app)
        .patch('/user/update')
        .send({name:'naoexiste'})
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            done();
        });
    });

    it('deveria editar o usuario raupp', function (done) {
        chai.request(app)
        .patch('/user/update')
        .set('authorization', rauppId)
        .send({name:'jose raupp'})
        .end(function (err,res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            done();
        });
    });

    it('nao deveria excluir um usuario que nao existe', function (done) {
        chai.request(app)
        .delete('/user/delete')
        .set('authorization', '6b2ca6ca')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.text).to.be.equal('{"error":"User not exists!"}');
            done();
        });
    });

    it('nao deveria excluir se o id nao for passado no header', function (done) {
        chai.request(app)
        .delete('/user/delete')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(400);
            done();
        });
    });

    it('deveria excluir o usuario raupp', function (done) {
        chai.request(app)
        .delete('/user/delete')
        .set('authorization', rauppId)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
            expect(res.body).to.be.jsonSchema(userSchema.properties);
            done();
        });
    });

    it('o usuario raupp não deve existir mais no sistema', function (done) {
        chai.request(app)
        .get('/user/read')
        .set('authorization', rauppId)
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(404);
            expect(res.text).to.be.equal('{"error":"User not exists!"}');
            done();
        });
    });

    it('deveria ser uma lista com pelomenos 5 usuarios', function (done) {
        chai.request(app)
        .get('/users')
        .end(function (err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body.users).to.have.lengthOf(5);
        done();
        });
    });
})