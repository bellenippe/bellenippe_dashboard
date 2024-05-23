import { Button, Html } from "@react-email/components";
import * as React from "react";

export default function Email() {
  return (
    <Html>
      <Button
        href="https://example.com"
        style={{ background: "#000", color: "#fff", padding: "12px 20px" }}
      >
        Click me
      </Button>
    </Html>
  );
}

// import {
//   Body,
//   Button,
//   Column,
//   Container,
//   Heading,
//   Hr,
//   Html,
//   Img,
//   Row,
//   Section,
//   Text,
// } from "@react-email/components";
// import * as React from "react";

// export default function Email({ customerDetails }: { customerDetails: any }) {
//   return (
//     <Html>
//       <Body style={{ background: "#fff", color: "#000", padding: "12px 20px" }}>
//         <Container>
//           <Section>
//             <Row>
//               <Column>
//                 <Text>N° de commande : {customerDetails._id}</Text>
//               </Column>
//             </Row>
//           </Section>
//           <Hr />

//           <Section>
//             <Img
//               src={`${process.env.NEXT_PUBLIC_BASE_URL2}/public/logos/bnBlackLogo.png`}
//               width="50"
//               height="50"
//               alt="Bellenippe Logo"
//               style={{ margin: "auto" }}
//             />
//             <Heading style={{ textAlign: "center" }}>Sur la route !</Heading>
//             <Text>
//               Bonjour {customerDetails.name},<br></br>
//               <br></br> Votre commande a été prise en compte et sera livrée à
//               l'adresse suivante : {customerDetails.address}. <br></br>
//               <br></br> Pour voir les détails de votre commande, rendez-vous sur
//               bellenippe.fr afin d'accéder à votre espace client.
//             </Text>
//           </Section>
//           <Hr />

//           <Section>
//             <Row>
//               <Column>
//                 {customerDetails.order.products.map((product: any) => (
//                   <Row key={product._id}>
//                     <Column>
//                       <Text>{product.product.title}</Text>
//                       <Text>
//                         {product.quantity} x {product.product.price} €
//                       </Text>
//                     </Column>
//                   </Row>
//                 ))}
//               </Column>
//             </Row>
//           </Section>
//           <Hr />

//           <Section>
//             <Row>
//               <Column>
//                 <Text>Total : {customerDetails.order.totalAmount} €</Text>
//               </Column>
//               <Column>
//                 <Text>Total : {customerDetails.order.createdAt}</Text>
//               </Column>
//             </Row>
//           </Section>
//         </Container>
//       </Body>
//     </Html>
//   );
// }
