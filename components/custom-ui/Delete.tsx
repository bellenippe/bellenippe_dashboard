"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { set } from "mongoose";

interface DeleteProps {
  id: string;
  item: string;
}

export const Delete: React.FC<DeleteProps> = ({ id, item }) => {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      const itemType = item === "product" ? "products" : "collections";
      const res = await fetch(`/api/${itemType}/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        window.location.href = `/${itemType}`;
        toast.success(`${item} supprimé(e)`);
        setLoading(false);
      }
    } catch (error) {
      console.error("[Collection_DELETE]", error);
      toast.error("Une erreur s'est produite lors de la suppression");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button className="bg-red-1 text-white">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className=" bg-white text-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-1">
            Etes-vous sûr de vouloir supprimer {item} ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Vous ne pourrez pas récupérer les
            données supprimées.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction className=" bg-red-1" onClick={onDelete}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
