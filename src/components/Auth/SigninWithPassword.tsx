"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { FirebaseService } from "@/services/firebase-service";

export default function SigninWithPassword() {
  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleDataSync = async (user: any) => {
    // Sync user to Firestore to ensure role and data exists
    await FirebaseService.syncUser({
      uid: user.uid,
      email: user.email || "",
      displayName: user.displayName || ""
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const email = data.email === "admin@admin" ? "admin@admin.com" : data.email;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, data.password);
      await handleDataSync(userCredential.user);
      router.push("/dashboard");
    } catch (error: any) {
      // Auto-register logic mostly for admin
      if (email === "admin@admin.com") {
        try {
          const newUserCred = await createUserWithEmailAndPassword(auth, email, data.password);
          await handleDataSync(newUserCred.user);
          router.push("/dashboard");
          return;
        } catch (createError) {
          console.error("Auto-create failed", createError);
        }
      }

      console.error("Login failed:", error);
      if (error.code === 'auth/operation-not-allowed') {
        alert("Error de Configuración: El método de inicio de sesión (Email/Password) no está habilitado en tu proyecto de Firebase.\n\nVe a Firebase Console -> Authentication -> Sign-in method y habilita 'Email/Password'.");
      } else {
        alert("Error al iniciar sesión: " + (error.message || "Credenciales incorrectas"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDirectAdminLogin = async () => {
    setLoading(true);
    const adminEmail = "admin@admin.com";
    // Use env var or fallback. "password123" is a common dev default, or use a complex one if needed.
    // Since user asked for "no request password", we just use a known one.
    const adminPass = process.env.NEXT_PUBLIC_DEMO_USER_PASS || "admin123456";

    try {
      // Try login
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPass);
      await handleDataSync(userCredential.user);
      router.push("/dashboard");
    } catch (error: any) {
      // If fail, maybe user doesn't exist? Try create
      try {
        const newUserCred = await createUserWithEmailAndPassword(auth, adminEmail, adminPass);
        // Ensure it's admin role (syncUser handles this based on email)
        await handleDataSync(newUserCred.user);
        router.push("/dashboard");
      } catch (createError: any) {
        console.error("Direct admin login failed:", error, createError);
        alert("No se pudo acceder como administrador automáticamente. Por favor verifica los logs.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputGroup
        type="email"
        label="Email"
        className="[&_input]:py-[15px] [&_input]:bg-transparent [&_input]:border-white/20 [&_input]:text-white [&_input]:focus:border-primary [&_label]:text-white/80"
        placeholder="Enter your email"
        name="email"
        handleChange={handleChange}
        value={data.email}
        icon={<EmailIcon className="text-white/60" />}
      />

      <InputGroup
        type="password"
        label="Password"
        className="[&_input]:py-[15px] [&_input]:bg-transparent [&_input]:border-white/20 [&_input]:text-white [&_input]:focus:border-primary [&_label]:text-white/80"
        placeholder="Enter your password"
        name="password"
        handleChange={handleChange}
        value={data.password}
        icon={<PasswordIcon className="text-white/60" />}
      />

      <div className="flex items-center justify-between gap-2 py-2 font-medium text-white/80">
        <Checkbox
          label="Remember me"
          name="remember"
          withIcon="check"
          minimal
          radius="md"
          onChange={(e) =>
            setData({
              ...data,
              remember: e.target.checked,
            })
          }
        />

        <Link
          href="/auth/forgot-password"
          className="hover:text-primary transition-colors"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 hover:shadow-lg hover:shadow-primary/50"
        >
          Sign In
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent" />
          )}
        </button>

        <button
          type="button"
          onClick={handleDirectAdminLogin}
          disabled={loading}
          className="group relative flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 p-4 font-medium text-white backdrop-blur-sm transition hover:bg-white/20 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 transition group-hover:opacity-100" />
          <span className="relative flex items-center gap-2">
            🚀 Acceso Directo Admin
          </span>
        </button>
      </div>
    </form>
  );
}
