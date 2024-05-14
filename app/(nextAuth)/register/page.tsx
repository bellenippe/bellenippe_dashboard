"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const router = useRouter();
  const [info, setInfo] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!info.name || !info.email || !info.password) {
      setError("Veuillez remplir tous les champs");
    }

    try {
      setPending(true);
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(info),
      });
      if (res.ok) {
        setPending(false);
        const form = e.target as HTMLFormElement;
        form.reset();
        router.push("/sign-in");
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        console.log("Erreur quelque part");
        setPending(false);
      }
    } catch (error) {
      setPending(false);
      console.error("[register_POST]", error);
      setError("Erreur lors de l'inscription");
    }
  }

  return (
    <div className="h-screen flex justify-center items-center">
      <section className="flex flex-col gap-5 justify-center items-center">
        <h1 className=" text-[2rem]">Inscription</h1>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="name">Nom & Prénom</label>
            <input
              type="text"
              id="name"
              className=" bg-slate-100"
              onChange={(e) => handleInput(e)}
            />
          </div>
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
            {pending ? "Inscription..." : "Inscription"}
          </button>
          <span>
            Vous avez déjà un compte ? <Link href="/sign-in">Connexion</Link>
          </span>
        </form>
      </section>
    </div>
  );
}
