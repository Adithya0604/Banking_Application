import { Request, Response, NextFunction } from "express";
import { kycDocumentsService } from "../services/kycDocuments.service";

export class KycDocumentsController {
  //Need more investigation regarding private and constructor. Some part if clarity is missing. we are using this two for working on to be inside this controller but what else we have to know belongs to this . I have seen an things inside login or logout. that constructor is not present only private is been takening care off.
  private kycService: kycDocumentsService;

  constructor() {
    this.kycService = new kycDocumentsService();
  }

  generateUrl = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const customerId = req.user?.sub;
      if (!customerId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthrozised User" });
      }

      const urls = await this.kycService.UrlGenaration(customerId);

      return res.status(200).json({ success: true, message: { urls } });
    } catch (error) {
      next(error);
    }
  };

  // UploadDocuments = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction,
  // ): Promise<any> => {
  //   try {
  //     const InputPayload = await this.generateUrl(req, res, next);

  //     const { PanFile, AadharFrontFile, AadharBackFile } = req.body;

  //     const Payload = {
  //       PanFile,
  //       AadharFrontFile,
  //       AadharBackFile,
  //       PanGeneratedPutUrl: InputPayload.pan.uploadurl,
  //       AadharFrontGeneratedPutUrl: InputPayload.aadharFI.uploadurl,
  //       AadharBackGeneratedPutUrl: InputPayload.aadharBI.uploadurl,
  //     };

  //     const results = this.kycService.UploadDocuments(Payload);
  //   } catch (error) {}
  // };

  submitKyc = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const customerId = req.user?.sub;
      if (!customerId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthrozised User" });
      }
      const {
        PanCardNumber,
        AadharCardNumber,
        Pankey,
        AadharFrontkey,
        AadharBackkey,
      } = req.body;

      const payload = {
        customerId,
        PanCardNumber,
        AadharCardNumber,
        Pankey,
        AadharFrontkey,
        AadharBackkey,
      };
      const result = await this.kycService.SubmitDocuments(payload);
      return res.status(200).json({ success: true, message: result });
    } catch (error) {
      next(error);
    }
  };

  verificationKyc = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<any> => {
    try {
      const customer_id = req.user?.sub;

      //When we get this customer_id from request then we have to once verify the id once before we proceed because we will not be knowing that this customer _id is belongs to use or not?? So, let's have a service that will be respible for that or a middleware we have it but it just desturct the token and give js the customer_id. or will it be checking the decryption while a token is arraived. Like if it is checking that token is used or expired then no need for checking into db. if not then we need to because without that we will be abel toe just get in the customer's who dont have an access to system.

      if (!customer_id) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthrozied User" });
      }

      const { PanCardNumber, AadharCardNumber } = req.body;
      const verificationPayload = {
        customer_id,
        PanCardNumber,
        AadharCardNumber,
      };
      const result =
        await this.kycService.VerificationDocuments(verificationPayload);

      console.log(result);
      return res.status(202).json({
        status: "success",
        message: "Verification under going processing",
      });
    } catch (error) {
      next(error);
    }
  };
}
