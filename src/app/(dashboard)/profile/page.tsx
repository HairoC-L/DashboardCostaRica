"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import { ApiService } from "@/services/api-service";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  // Form States
  const [displayName, setDisplayName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // UI States
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSaving(true);
    try {
      if (user) {
        // Use syncUser or a new updateUser method. syncUser fits the "update info" pattern for now.
        // Or better: ApiService.updateUser if available. ApiService has syncUser which calls PUT /api/users/[uid]
        // properly.
        await ApiService.syncUser({
          uid: user.uid,
          email: user.email,
          displayName: displayName
        });
        setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Error al actualizar perfil.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    alert("El cambio de contraseña no está disponible en esta versión local aún.");
    return;
    /* 
    // Implementation pending API support
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres.' });
      return;
    }

    setIsSaving(true);
    try {
        // await ApiService.changePassword(user.uid, newPassword); 
        setMessage({ type: 'success', text: 'Contraseña actualizada correctamente.' });
        setNewPassword("");
        setConfirmPassword("");
    } catch (error: any) {
        setMessage({ type: 'error', text: error.message || 'Error al actualizar contraseña.' });
    } finally {
      setIsSaving(false);
    }
    */
  };

  if (loading) return <div className="p-10 text-center">Cargando...</div>;

  if (!user) {
    return (
      <div className="mx-auto w-full max-w-[970px] p-4">
        <div className="rounded-lg bg-red-50 p-4 text-red-500 border border-red-200">
          No has iniciado sesión.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[970px]">
      <Breadcrumb pageName="Configuración de Perfil" />

      {message && (
        <div className={`mb-6 rounded-lg border px-4 py-3 ${message.type === 'success'
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-red-50 text-red-700 border-red-200'
          }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* Profile Information */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Información Personal
              </h3>
            </div>
            <form onSubmit={handleUpdateProfile}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Email <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full rounded border-[1.5px] border-stroke bg-gray-100 py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">El email no se puede cambiar directamente.</p>
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-70"
                >
                  {isSaving ? "Guardando..." : "Actualizar Perfil"}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* Password Change */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Cambiar Contraseña
              </h3>
            </div>
            <form onSubmit={handleUpdatePassword}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Ingresa nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    placeholder="Confirma nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 disabled:opacity-70"
                >
                  {isSaving ? "Guardando..." : "Actualizar Contraseña"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Developer Helper */}
        <div className="rounded-[10px] border border-dashed border-primary/50 bg-primary/5 p-4">
          <h4 className="mb-2 font-bold text-primary">Área de Desarrollador</h4>
          <p className="mb-4 text-sm text-dark-6">Utilidad temporal para pruebas.</p>
          <button
            type="button"
            onClick={async () => {
              if (user && confirm("¿Asignar rol de Administrador a tu usuario actual?")) {
                await ApiService.updateUserRole(user.uid, "admin");
                alert("¡Ahora eres Administrador! La página se recargará.");
                window.location.reload();
              }
            }}
            className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-opacity-90"
          >
            Promoverme a Admin
          </button>
        </div>
      </div>
    </div>
  );
}
