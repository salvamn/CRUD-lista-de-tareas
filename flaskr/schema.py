instructions = [
    "SET FOREIGN_KEY_CHECKS=0;",
    "DROP TABLE IF EXISTS tarea;",
    "SET FOREIGN_KEY_CHECKS=1;",
    """
        CREATE TABLE tarea (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nombre_tarea VARCHAR(50),
            contenido_tarea VARCHAR(200),
            fecha VARCHAR(50),
            estado INT
        );
    """

]



