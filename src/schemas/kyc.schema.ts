import { z } from "zod";

// const ALLOWED_FILE_SIZE = 10 * 1024 * 1024;
// const ALLOWED_FILE_MIME_TYPE = ["image/jpeg", "image/jpg", "image/png"];

// const Documents = z.object({
//   mimetype: z
//     .string()
//     .refine((fileVal) => ALLOWED_FILE_MIME_TYPE.includes(fileVal), {
//       message: "Only .JPEG, .JPG, .PNG are allowed",
//     }),
//   size: z.number().max(ALLOWED_FILE_SIZE, "Only 10MB or lesser allowed"),
// });

export const KycCards = z.object({
  PanCardNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, "Invalid Pan Number"),
  AadharCardNumber: z.string().regex(/^\d{12}$/, "Invalid Aadhar Number"),
  Pankey: z.string().min(1, "Provide pan Key"),
  AadharFrontkey: z.string().min(1, "Provide aadhar front Key"),
  AadharBackkey: z.string().min(1, "Provide aadhar back Key"),
});

// const KycDocuments = z.object({
//   PanCardFrontImage: z.array(Documents).min(1, "Pan Front Image mandatory"),
//   AadharCardFrontImage: z
//     .array(Documents)
//     .min(1, "Aadhar Front Image mandatory"),
//   AadharCardBackImage: z.array(Documents).min(1, "Aadhar Back Image mandatory"),
// });

export type kyccards = z.infer<typeof KycCards>;

/*
When we are expecting the mixed type of input from frontend like string & files/documents then that will be handled in diff way but in same box. 
1. User will be seeing a section which contains 5 input boxes from which 2 are text & remaing are files. 
2. User will upload the data inside that & then clicks submit. 
3. The pacakge sent by user is single but the way the files & text is been handled is diff. 
4. The text is simple you can handle by zod or any validation But the file validation is simple it's depends on the size & type. 
5. When backend recivies the request then we will be processing this two boxes in two different ways. Text is normal & files are using multer for unpacking. 
6. MIME = Multipurpose Internet Mail Extensions(the label telling the server what kind of content/file this is).
*/
