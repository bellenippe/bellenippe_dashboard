"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function Page() {
  const router = useRouter();
  const [info, setInfo] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const session = useSession();

  useEffect(() => {
    if (session?.status === "authenticated") router.replace("/collections");
  }, [session, router]);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!info.email || !info.password) {
      setError("Veuillez remplir tous les champs");
    }
    try {
      setPending(true);

      const res = await signIn("credentials", {
        email: info.email,
        password: info.password,
        redirect: false,
      });

      if (res?.error) {
        setError("L'email ou le mot de passe est erroné...");
        setPending(false);
        return;
      }

      router.replace("/");
    } catch (error) {
      setPending(false);
      console.error("[register_POST]", error);
      setError("Erreur lors de la connexion");
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      {/* <SignUp path="/sign-up" /> */}
      <section className="flex flex-col gap-5 justify-center items-center">
        <h1 className=" text-[2rem]">Connexion</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className=" bg-slate-100"
              onChange={(e) => handleInput(e)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              className=" bg-slate-100"
              onChange={(e) => handleInput(e)}
            />
          </div>
          {error && <span>{error}</span>}
          <button
            type="submit"
            disabled={pending ? true : false}
            className=" bg-slate-100"
          >
            {pending ? "Connexion..." : "Connexion"}
          </button>
          <span>
            Vous n'avez pas encore de compte ?{" "}
            <Link href="/login">Inscription</Link>
          </span>
        </form>
      </section>
    </div>
  );
}
