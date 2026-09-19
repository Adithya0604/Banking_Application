import "dotenv/config";
import { kycDocumentsRepo } from "../repositories/kyc.repository";
import { generateUrl } from "../utils/GenerateS3Url.utils";
import { sendtoSqs } from "../services/sqs.service";
// import fs from "fs";
// import axios from "axios";

export type Payload = {
  customerId: string;
  PanCardNumber: string;
  AadharCardNumber: string;
  Pankey: string;
  AadharFrontkey: string;
  AadharBackkey: string;
};

export type UploadPayload = {
  PanFile: File;
  AadharFrontFile: File;
  AadharBackFile: File;
  PanGeneratedPutUrl: string;
  AadharFrontGeneratedPutUrl: string;
  AadharBackGeneratedPutUrl: string;
};

export type verificationPayload = {
  customer_id: string;
  PanCardNumber: string;
  AadharCardNumber: string;
};

export class kycDocumentsService {
  private submitkycdocuments: kycDocumentsRepo;
  constructor() {
    this.submitkycdocuments = new kycDocumentsRepo();
  }
  async UrlGenaration(customerId: string): Promise<any> {
    const timestamp = Date.now();

    //key genration
    const pankey = `pan/${customerId}-${timestamp}.jpg`;
    const aadharFrontImagekey = `doc/aF-${customerId}-${timestamp}.jpg`;
    const aadharBackImagekey = `doc/aB-${customerId}-${timestamp}.jpg`;

    //url generation
    const panurl = await generateUrl(pankey, "image/jpeg");
    const aadharFrontImageurl = await generateUrl(
      aadharFrontImagekey,
      "image/jpeg",
    );
    const aadharBackImageurl = await generateUrl(
      aadharBackImagekey,
      "image/jpeg",
    );

    return {
      pan: { uploadurl: panurl, s3key: pankey },
      aadharFI: { uploadurl: aadharFrontImageurl, s3key: aadharFrontImagekey },
      aadharBI: { uploadurl: aadharBackImageurl, s3key: aadharBackImagekey },
    };
  }

  async SubmitDocuments(input: Payload): Promise<any> {
    //1. The payload we got we have to turn s3 keys into hash & then store
    //2. After hashing that we will create another payload which will contains all the neccessarty details by which the db will be updated.

    //     const panhashkey = await GeneratingHash(input.pankey);
    //     const aadharFronthashkey = await GeneratingHash(input.aadharFrontkey);
    //     const aadharBackhashKey = await GeneratingHash(input.aadharBackKey);

    const inputData = {
      customerId: input.customerId,
      PanCardNumber: input.PanCardNumber,
      AadharCardNumber: input.AadharCardNumber,
      Pankey: input.Pankey,
      AadharFrontkey: input.AadharFrontkey,
      AadharBackkey: input.AadharBackkey,
    };

    await this.submitkycdocuments.submitKycDocuments(inputData);
    return { message: "Kyc Submitted Successfully" };
  }

  // Verification of documents after updating into DB.
  async VerificationDocuments(input: verificationPayload): Promise<any> {
    //Payload send into sqs queueing services
    const intoSqsQueue = await sendtoSqs(input);

    console.log(intoSqsQueue.MessageId);
    //attach the message here
    return {
      status: "PROCESSING",
      message: "The message is processing.",
      queueMessageId: intoSqsQueue?.MessageId || "QUEUED",
    };
  }
}
