import datetime

def obtener_fecha_actual():
    fecha_sin_formato = datetime.datetime.now()
    fecha_formateada = fecha_sin_formato.strftime("%d-%m-%Y %H:%M:%S %p")

    return fecha_formateada


# print(obtener_fecha_actual())