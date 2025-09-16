from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Configuração do banco de dados
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///docgestor.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Modelos de dados
class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='Pendente') # OK, Pendente, Alerta
    documents = db.relationship('Document', backref='employee', lazy=True)

    def __repr__(self):
        return f'<Employee {self.name}>'

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.Integer, db.ForeignKey('employee.id'), nullable=False)
    doc_type = db.Column(db.String(100), nullable=False) # Ex: Contrato, ASO, Recibo
    file_path = db.Column(db.String(200), nullable=False)
    upload_date = db.Column(db.DateTime, default=db.func.current_timestamp())
    due_date = db.Column(db.DateTime, nullable=True) # Para documentos com vencimento
    status = db.Column(db.String(50), default='OK') # OK, Vencido, Pendente

    def __repr__(self):
        return f'<Document {self.doc_type} for Employee {self.employee_id}>'

# Rotas da API
@app.route('/')
def home():
    return 'API Doc-Gestor RH está funcionando!'

# Rota para criar o banco de dados (apenas para desenvolvimento)
@app.route('/init_db')
def init_db():
    with app.app_context():
        db.create_all()
    return 'Banco de dados inicializado!'

if __name__ == '__main__':
    with app.app_context():
        db.create_all() # Cria as tabelas se não existirem
    app.run(debug=True, host='0.0.0.0', port=5000)


