"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { FirebaseService, User } from "@/services/firebase-service";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function UsersAdmin() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const data = await FirebaseService.getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleRoleChange = async (uid: string, newRole: "admin" | "client") => {
        if (confirm(`¿Cambiar rol a ${newRole === "admin" ? "Administrador" : "Cliente"}?`)) {
            try {
                await FirebaseService.updateUserRole(uid, newRole);
                loadUsers();
            } catch (error) {
                alert("Error al actualizar rol");
                console.error(error);
            }
        }
    };

    if (loading) {
        return <div className="p-10 text-center">Cargando usuarios...</div>;
    }

    return (
        <div className="mx-auto max-w-7xl">
            <Breadcrumb pageName="Gestión de Usuarios" />

            <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
                <div className="px-4 py-6 md:px-6 xl:px-7.5">
                    <h4 className="text-xl font-bold text-dark dark:text-white">
                        Usuarios Registrados
                    </h4>
                </div>

                <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5">
                    <div className="col-span-3 flex items-center">
                        <p className="font-medium">Usuario</p>
                    </div>
                    <div className="col-span-3 hidden items-center sm:flex">
                        <p className="font-medium">Email</p>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="font-medium">Rol</p>
                    </div>
                </div>

                {users.map((user, key) => (
                    <div
                        className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-dark-3 sm:grid-cols-8 md:px-6 2xl:px-7.5"
                        key={key}
                    >
                        <div className="col-span-3 flex items-center">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <div className="h-12.5 w-15 rounded-md">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary uppercase font-bold text-lg">
                                        {user.displayName?.charAt(0) || "U"}
                                    </div>
                                </div>
                                <p className="text-sm font-medium text-dark dark:text-white">
                                    {user.displayName || "Usuario sin nombre"}
                                </p>
                            </div>
                        </div>
                        <div className="col-span-3 hidden items-center sm:flex">
                            <p className="text-sm text-dark dark:text-white">
                                {user.email}
                            </p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <select
                                value={user.role || "client"}
                                onChange={(e) => handleRoleChange(user.uid, e.target.value as "admin" | "client")}
                                className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${user.role === "admin"
                                        ? "bg-success text-success"
                                        : "bg-warning text-warning"
                                    }`}
                            >
                                <option value="client" className="text-dark">Cliente</option>
                                <option value="admin" className="text-dark">Administrador</option>
                            </select>
                        </div>
                    </div>
                ))}

                {users.length === 0 && (
                    <div className="p-6 text-center text-sm text-gray-500">No hay usuarios registrados.</div>
                )}
            </div>
        </div>
    );
}
