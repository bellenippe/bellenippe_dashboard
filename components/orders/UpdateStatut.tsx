"use client";
import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast from "react-hot-toast";

const UpdateStatut = ({ orderDetails }: { orderDetails: OrderColumnType }) => {
  const formSchema = z.object({
    // statut: z.enum(["pending", "processing", "shipped", "delivered"]),
    statut: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      statut: orderDetails.statut,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      const response = await fetch(`/api/orders/${orderDetails._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ statut: values.statut }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      toast.success("Statut de la commande modifié avec succès");

      const updatedOrder = await response.json();
      console.log(updatedOrder);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification du statut de la commande");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center items-center gap-4"
        >
          <FormField
            control={form.control}
            name="statut"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold pr-4">Statut :</FormLabel>
                <FormControl>
                  <Controller
                    control={form.control}
                    name="statut"
                    render={({ field }) => (
                      <select {...field} className=" py-2 px-1">
                        <option value="En attente">En attente</option>
                        <option value="En cours de traitement">
                          En cours de traitement
                        </option>
                        <option value="Expédié">Expédié</option>
                        <option value="Livré">Livré</option>
                      </select>
                    )}
                  />
                </FormControl>
                {/* <FormControl>
                  <Input
                    placeholder="Nom du produit..."
                    {...field}
                    // onKeyDown={handleKeyPress}
                    className="rounded-xl focus:border-[#63817C] hover:border-[#63817C] transition-all duration-200 ease-in-out"
                  />
                </FormControl> */}
                <FormMessage className="text-red-1" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="text-white bg-[#63817C] text-[1rem] rounded-xl hover:bg-[#2d8072] transition-all duration-200 ease-in-out"
          >
            Confirmer
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UpdateStatut;

// "use client";
// import React, { useState } from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
// } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";

// const UpdateStatut = ({ orderDetails }: { orderDetails: OrderColumnType }) => {
//   const [statut, setStatut] = useState(orderDetails.statut);

//   const formSchema = z.object({
//     statut: z.enum(["pending", "processing", "shipped", "delivered"]),
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       statut: orderDetails.statut,
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     try {
//       const response = await fetch(`/api/orders/${orderDetails._id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ statut: values.statut }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update order status");
//       }
//       if (response.ok) {
//         toast.success("Statut de la commande modifié avec succès");
//       }
//       // const updatedOrder = await response.json();
//       // setStatut(updatedOrder.statut);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(onSubmit)}>
//         <FormField
//           control={form.control}
//           name="statut"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Statut</FormLabel>
//               <FormControl>
//                 <select
//                   {...field}
//                   value={statut}
//                   onChange={(e) =>
//                     setStatut(
//                       e.target.value as
//                         | "pending"
//                         | "processing"
//                         | "shipped"
//                         | "delivered"
//                     )
//                   }
//                 >
//                   <option value="pending">En attente</option>
//                   <option value="processing">En cours de traitement</option>
//                   <option value="shipped">Expédié</option>
//                   <option value="delivered">Livré</option>
//                 </select>
//               </FormControl>
//             </FormItem>
//           )}
//         />

//         <Button
//           type="submit"
//           className="text-white bg-[#63817C] text-[1rem] rounded-xl hover:bg-[#2d8072] transition-all duration-200 ease-in-out"
//         >
//           Confirmer
//         </Button>
//       </form>
//     </Form>
//   );
// };

// export default UpdateStatut;
