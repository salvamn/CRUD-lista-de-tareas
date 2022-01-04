import os
from flask import Flask, render_template, request, url_for, redirect
from flaskr.db import get_db
from flaskr.util.fechas import obtener_fecha_actual


def create_app():
    app = Flask(__name__)

    app.config.from_mapping(
        SECRET_KEY="xixo", # Para la Sesiones
        DATABASE_HOST="localhost",#os.environ.get("FLASK_DATABASE_HOST")
        DATABASE_PASSWORD="root",#os.environ.get("FLASK_DATABASE_PASSWORD")
        DATABASE_USER="root",#os.environ.get("FLASK_DATABASE_USER")
        DATABASE="todo_flask",#os.environ.get("FLASK_DATABASE")
    )

    from . import db
    db.init_app(app)



    @app.route("/")
    def index():
        lista_tareas = {}

        db, cursor = get_db()

        cursor.execute("SELECT * FROM tarea ")
        filas = cursor.fetchall()

        for tarea in filas:
            lista_tareas[tarea["id"]] = tarea

        return render_template("index.html", datos=lista_tareas)
        



    # ------------------------------- RUTAS DE CONSULTAS A LA BASE DE DATOS

    @app.route("/registrar-tarea/<string:nombre_tarea>/<string:contenido_tarea>")
    def registrar_tarea(nombre_tarea, contenido_tarea):
        db, cursor = get_db()
        
        cursor.execute(
            "INSERT INTO tarea (nombre_tarea, contenido_tarea, fecha, estado) VALUES (%s, %s, %s, %s)",
            (nombre_tarea, contenido_tarea, obtener_fecha_actual(), False)
        )

        db.commit()

        return redirect(url_for("index"))


    @app.route("/mostrar-tareas", methods=["GET", "POST"])
    def mostrar_tareas():
        lista_tareas = {}
        if request.method == "POST":
            db, cursor = get_db()

            cursor.execute("SELECT * FROM tarea ")
            filas = cursor.fetchall()

            for tarea in filas:
                lista_tareas[tarea["id"]] = tarea


            return lista_tareas
        return lista_tareas


    @app.route("/mostrar-tarea-id/<int:id>")
    def mostrar_tarea_id(id):
        db, cursor = get_db()   

        sql = "SELECT * FROM tarea WHERE id = %s"
        cursor.execute(sql, (id, ))
        fila = cursor.fetchone()

        if len(fila) >= 1:
            return fila
        else:
            return ""


    @app.route("/actualizar-tarea/<int:id>")
    def actualizar_tarea(id):
        db, cursor = get_db()   

        sql = "UPDATE tarea SET estado = 1 WHERE id = %s"
        cursor.execute(sql, (id, ))
        db.commit()

        return {"tarea_actualizada" : True}


    @app.route("/eliminar-tarea/<int:id>")
    def eliminar_tarea(id):
        db, cursor = get_db()   

        sql = "DELETE FROM tarea WHERE id = %s"
        cursor.execute(sql, (id, ))
        db.commit()

        return {"tarea_eliminada" : True}


    return app
