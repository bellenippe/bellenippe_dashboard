"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Separator } from "../ui/separator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import ImageUpload from "../custom-ui/ImageUpload";
import toast from "react-hot-toast";
import { Delete } from "../custom-ui/Delete";
import MultiText from "../custom-ui/MultiText";
import MultiSelect from "../custom-ui/MultiSelect";
import { Loader } from "../custom-ui/Loader";

// Définition du schéma des données du formulaire
const formSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().min(2).max(500),
  media: z.array(z.string()),
  category: z.string(),
  collections: z.array(z.string()),
  tags: z.array(z.string()),
  size: z.array(z.string()),
  colors: z.array(z.string()),
  price: z.coerce.number().min(0.1),
  expense: z.coerce.number().min(0.1),
});

interface ProductFormProps {
  initialData?: ProductType | null;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<CollectionType[]>([]);

  const getCollections = async () => {
    try {
      const res = await fetch("/api/collections", {
        method: "GET",
      });

      const data = await res.json();
      setCollections(data);
      setLoading(false);
    } catch (error) {
      console.error("[Collections_GET]", error);
      toast.error("Erreur lors de la récupération des collections");
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  // Initialisation du formulaire
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          collections:
            initialData.collections?.map((collection) => collection._id) || [],
        }
      : {
          title: "",
          description: "",
          media: [],
          category: "",
          collections: [],
          tags: [],
          size: [],
          colors: [],
          price: 0.1,
          expense: 0.1,
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
      const url = initialData
        ? `/api/products/${initialData._id}`
        : "/api/products";
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
          `"Produit ${
            initialData ? "modifié avec succès" : "créée avec succès"
          }`
        );
        window.location.href = "/products";
        router.push("/products");
      }
    } catch (error) {
      console.error("[ProductForm_POST]", error);
      toast.error("Erreur lors de la création du produit");
    }
  };

  console.log("initialData", initialData);
  console.log("collections", collections);

  return loading ? (
    <Loader />
  ) : (
    <div className="p-10">
      {initialData ? (
        <div className="flex item-center justify-between">
          <p className="text-heading2-bold">Modifier le produit</p>
          <Delete item="product" id={initialData._id} />
        </div>
      ) : (
        <p className="text-heading2-bold">Créer un produit</p>
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
                    placeholder="Nom du produit..."
                    {...field}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
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
                    placeholder="Description du produit..."
                    {...field}
                    rows={5}
                    onKeyDown={handleKeyPress}
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="media"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={(url) => field.onChange([...field.value, url])}
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((image) => image !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Prix du produit..."
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expense"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expense (€)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Expense du produit..."
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Catégorie du produit..."
                      {...field}
                      onKeyDown={handleKeyPress}
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Tags du produit..."
                      value={field.value}
                      onChange={(tag) => field.onChange([...field.value, tag])}
                      onRemove={(tagToRemove) =>
                        field.onChange([
                          ...field.value.filter((tag) => tag !== tagToRemove),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            {collections.length > 0 && (
              <FormField
                control={form.control}
                name="collections"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collections</FormLabel>
                    <FormControl>
                      <MultiSelect
                        placeholder="Collection du produit..."
                        collections={collections}
                        value={field.value}
                        onChange={(_id) =>
                          field.onChange([...field.value, _id])
                        }
                        onRemove={(idToRemove) =>
                          field.onChange([
                            ...field.value.filter(
                              (collectionId) => collectionId !== idToRemove
                            ),
                          ])
                        }
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taille</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Taille du produit..."
                      value={field.value}
                      onChange={(taille) =>
                        field.onChange([...field.value, taille])
                      }
                      onRemove={(tailleToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (taille) => taille !== tailleToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="colors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <FormControl>
                    <MultiText
                      placeholder="Couleurs du produit..."
                      value={field.value}
                      onChange={(color) =>
                        field.onChange([...field.value, color])
                      }
                      onRemove={(colorToRemove) =>
                        field.onChange([
                          ...field.value.filter(
                            (color) => color !== colorToRemove
                          ),
                        ])
                      }
                    />
                  </FormControl>
                  <FormMessage className="text-red-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-10">
            <Button type="submit" className=" bg-blue-600 text-white">
              Confirmer
            </Button>
            <Button
              type="submit"
              className=" bg-blue-600 text-white"
              onClick={() => router.push("/products")}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
