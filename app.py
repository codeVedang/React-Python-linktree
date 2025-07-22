from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import os
import traceback

print("--- PYTHON SCRIPT V4 --- THIS IS THE FINAL VERSION ---")

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database_v4.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_SECRET_KEY"] = "the-final-key-i-swear-on-my-reputation"

db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    links = db.relationship('Link', backref='owner', lazy=True, cascade="all, delete-orphan")

class Link(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    def to_json(self): return {'id': self.id, 'title': self.title, 'url': self.url}

# --- SCRIPT SECTION: LOGIN ENDPOINT ---
# This is the /login endpoint you will discuss in the video.
# It securely checks the user's password and issues a JWT token.
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username, password = data.get('username'), data.get('password')
        user = User.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password, password):
            access_token = create_access_token(identity=str(user.id))
            return jsonify(access_token=access_token)
        return jsonify({"msg": "Bad username or password"}), 401
    except Exception as e:
        return jsonify({"msg": "Error in login", "error": str(e)}), 500

# --- SCRIPT SECTION: GET LINKS ENDPOINT ---
# This is the protected /api/links endpoint you will discuss.
# The @jwt_required() decorator ensures only logged-in users can access it.
@app.route('/api/links', methods=['GET'])
@jwt_required()
def get_links():
    try:
        current_user_id = get_jwt_identity()
        user_links = Link.query.filter_by(user_id=int(current_user_id)).all()
        return jsonify([link.to_json() for link in user_links])
    except Exception as e:
        print("---! ERROR IN GET_LINKS !---")
        print(traceback.format_exc())
        return jsonify({"msg": "A major error occurred in get_links on the server.", "error": str(e)}), 500

# --- Other Endpoints ---
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username, password = data.get('username'), data.get('password')
    if not username or not password: return jsonify({"msg": "Missing data"}), 400
    if User.query.filter_by(username=username).first(): return jsonify({"msg": "Username exists"}), 400
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created"}), 201

@app.route('/api/links', methods=['POST'])
@jwt_required()
def add_link():
    data = request.get_json()
    if not data or not data.get('title') or not data.get('url'):
        return jsonify({"msg": "Missing title or url"}), 422
    current_user_id = get_jwt_identity()
    new_link = Link(title=data['title'], url=data['url'], user_id=int(current_user_id))
    db.session.add(new_link)
    db.session.commit()
    return jsonify(new_link.to_json()), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    print("--- PYTHON SERVER V4 IS RUNNING ---")
    app.run(debug=True, port=5000)
