// Simple schema which contains 4 entries named sender_id(sender account), reciver_id(reciver account), amount, description
import z from "zod";

//Schema creation
export const moneyTransfer = {
  sender_id: z.string().length(15, "Sender's Account Number Is Mandatory"),
  reciver_id: z.string().length(15, "Reciver's Account Number Is Mandatory"),
  amount: z.number().min(1, "Greater than 1 Is Mandatory"),
  description: z
    .string()
    .trim()
    .max(50, "Description cannot exceed 50 characters")
    .optional(),
};

export type moneytransfer = z.infer<typeof moneyTransfer>;

//The diff bet interface & object is that one will tell about the shape & other will tell about the data or payload.
//interface & class one describes shape 7 can't create object but other one can create an run time object and have functions too.
