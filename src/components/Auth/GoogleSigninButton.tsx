"use client";

import { GoogleIcon } from "@/assets/icons";
import { auth } from "@/lib/firebase";
import { ApiService } from "@/services/api-service";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function GoogleSigninButton({ text }: { text: string }) {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sync user to DB
      await ApiService.syncUser({
        uid: user.uid,
        email: user.email || "",
        displayName: user.displayName || ""
      });

      router.push("/");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      alert("Error al iniciar sesión con Google");
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="flex w-full items-center justify-center gap-3.5 rounded-xl border border-white/20 bg-white/5 p-[15px] font-medium text-white transition hover:bg-white/10 hover:shadow-lg"
    >
      <GoogleIcon />
      {text} with Google
    </button>
  );
}
