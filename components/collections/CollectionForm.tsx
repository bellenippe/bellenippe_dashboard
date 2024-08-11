"use client";
import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom-ui/ImageUpload";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Delete } from "../custom-ui/Delete";

// Définition du schéma des données du formulaire
const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(1000),
  image: z.string(),
});

interface CollectionFormProps {
  initialData?: CollectionType | null;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
  initialData,
}) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // Initialisation du formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? initialData
      : {
          title: "",
          description: "",
          image: "",
        },
  });

  // Fonction appelée lors de l'appui sur la touche "Entrée" pour empêcher le rechargement de la page et éviter le submit du formulaire (je crois)
  const handleKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  // Fonction appelée lors de la soumission du formulaire pour envoyer les données au serveur
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const url = initialData
        ? `/api/collections/${initialData._id}`
        : "/api/collections";
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        setLoading(false);
        toast.success(
          `"Collection ${
            initialData ? "modifié avec succès" : "créée avec succès"
          }`
        );
        window.location.href = "/collections";
        router.push("/collections");
      }
    } catch (error) {
      console.error("[CollectionForm_POST]", error);
      toast.error("Erreur lors de la création de la collection");
    }
    console.log(values);
  };

  return (
    <div className="p-10">
      {initialData ? (
        <div className="flex item-center justify-between">
          <p className="text-heading2-bold">Modifier la collection</p>
          <Delete item="collection" id={initialData._id} />
        </div>
      ) : (
        <p className="text-heading2-bold">Créer une collection</p>
      )}

      <Separator className="bg-black mt-4 mb-7" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titre</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nom de la collection..."
                    {...field}
                    onKeyDown={handleKeyPress}
                    className="rounded-xl focus:border-[#63817C] hover:border-[#63817C] transition-all duration-200 ease-in-out"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description de la collection..."
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                    className="rounded-xl focus:border-[#63817C] hover:border-[#63817C] transition-all duration-200 ease-in-out"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-10">
            <Button
              type="submit"
              className="text-white bg-[#63817C] text-[1rem] rounded-xl hover:bg-[#2d8072] transition-all duration-200 ease-in-out"
            >
              Confirmer
            </Button>
            <Button
              type="submit"
              className="text-white bg-[#696363] text-[1rem] rounded-xl hover:bg-[#3a3535] transition-all duration-200 ease-in-out"
              onClick={() => router.push("/collections")}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
