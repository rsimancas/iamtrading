using System;
using System.Data.SqlClient;
using System.Reflection;
using Utilidades;

namespace IAMTradingWA.Models
{
    public static class EstatusImportacion
    {
        static EstatusImportacion()
        {
            _Asignado = getEstatus("ASIGNADO");
            _Cargando = getEstatus("CARGANDO");
            _Resguardo = getEstatus("RESGUARDO");
            _Transito = getEstatus("TRANSITO");

            _InPlantaGY = getEstatus("IN-PLANTA GY");
            _Descargando = getEstatus("DESCARGANDO");
            _OutPlantaGY = getEstatus("OUT-PLANTA GY");

            _Devuelto = getEstatus("DEVUELTO");
            _Completado = getEstatus("COMPLETADO");

            _Fallido = getEstatus("FALLIDO");
        }

        public static int? Asignado { get { return _Asignado; } }
        public static int? Cargando { get { return _Cargando; } }
        public static int? Resguardo { get { return _Resguardo; } }
        public static int? Transito { get { return _Transito; } }

        public static int? InPlantaGY { get { return _InPlantaGY; } }
        public static int? Descargando { get { return _Descargando; } }
        public static int? OutPlantaGY { get { return _OutPlantaGY; } }

        public static int? Devuelto { get { return _Devuelto; } }
        public static int? Completado { get { return _Completado; } }

        public static int? Fallido { get { return _Fallido; } }


        private static int? _Asignado { get; set; }
        private static int? _Cargando { get; set; }
        private static int? _Resguardo { get; set; }
        private static int? _Transito { get; set; }

        private static int? _InPlantaGY { get; set; }
        private static int? _Descargando { get; set; }
        private static int? _OutPlantaGY { get; set; }

        private static int? _Devuelto { get; set; }
        private static int? _Completado { get; set; }

        private static int? _Fallido { get; set; }

        private static int? getEstatus(string estatusName)
        {
            SqlConnection oConn = null;

            try
            {
                oConn = ConnManager.OpenConn();
            }
            catch (Exception ex)
            {
                LogManager.Write("ERROR:" + Environment.NewLine + "\tMETHOD = EstatusImportacion." + MethodBase.GetCurrentMethod().Name + Environment.NewLine + "\tMESSAGE = " + ex.Message);
                throw;
            };


            string sql = "select EstatusId " +
                         " from Estatus where EstatusNombre = '{0}'  and EstatusTipo='I'";

            sql = String.Format(sql, estatusName);

            SqlCommand cmd = new SqlCommand(sql, oConn);

            int id = Convert.ToInt32(cmd.ExecuteScalar());

            if (id > 0) return id;

            return null;
        }
    }
}