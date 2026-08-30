import "dotenv/config";
import { kycDocumentsRepo } from "../repositories/kyc.repository";
import { generateUrl } from "../utils/GenerateS3Url.utils";
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

  // async UploadDocuments(input: UploadPayload): Promise<any> {
  //   // const PanUpload = await generateUrl();
  //   const UploadPayload = {
  //     PanFile: input.PanFile,
  //     AadharFrontFile: input.AadharFrontFile,
  //     AadharBackFile: input.AadharBackFile,
  //     PanGeneratedPutUrl: input.PanGeneratedPutUrl,
  //     AadharFrontGeneratedPutUrl: input.AadharFrontGeneratedPutUrl,
  //     AadharBackGeneratedPutUrl: input.AadharBackGeneratedPutUrl,
  //   };
  //   try {
  //     const panfilebuffer = fs.readFileSync(UploadPayload.PanFile);
  //     const fileupload = await axios.put(
  //       UploadPayload.PanGeneratedPutUrl,
  //       panfilebuffer,
  //       { headers: { "Content-Type": "image/jpeg" } },
  //     );
  //   } catch (error) {}
  // }

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
}
