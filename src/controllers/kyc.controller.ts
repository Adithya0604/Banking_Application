import { Request, Response, NextFunction } from "express";
import { kycDocumentsService } from "../services/kycDocuments.service";

export class KycDocumentsController {
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
}
