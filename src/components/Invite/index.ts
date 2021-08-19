import InvitationService from "./service";
import { HttpError } from "../../config/error";
import { NextFunction, Request, Response } from "express";
import { IUserInvite } from "./model";
import JWTTokenService from "../Session/service";
import OrganizationService from "../Organization/service";
import UserService from "../User/service";

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise <void>}
 */
export async function sendInvite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.body) {
      const invitedUser: IUserInvite = await InvitationService.insert(req.body);
      const inviteLink: string = await InvitationService.sendMail(
        req.body.userEmail,
        invitedUser.id,
        req.body.orgName,
        req.body.invitingUser
      );

      if (inviteLink) {
        const user = await InvitationService.findOneAndUpdateLink(
          invitedUser.id,
          inviteLink
        );
        console.log(user)
        res.status(200).json({ message: "Invitation send" });
      }
    } else {
      res.status(400).json({ message: "Invitaion failed" });
    }
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise <void>}
 */
export async function updateInvite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.body) {
      const argoDecodedHeaderToken: any = await JWTTokenService.DecodeToken(
        req
      );
      const deserializedToken: any = await JWTTokenService.VerifyToken(
        argoDecodedHeaderToken
      );

      const user: any = await InvitationService.findOneAndUpdate(
        req.body.id,
        req.body.status
      );

      await OrganizationService.findOneAndUpdate(
        user.organization._id,
        deserializedToken.session_id
      );
      await UserService.updateUserOrganization(
        user.organization._id,
        deserializedToken.session_id
      );
      res.status(200).json(true);
    } else {
      res.status(400);
    }
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise <void>}
 */
 export async function getInvites(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.body) {
      const invitedUser: Array<IUserInvite> = await InvitationService.findFromOrganization(req.body.organizationId);
      if (invitedUser) {
        res.status(200).json(invitedUser);
      }
    } else {
      res.status(400).json({ message: "No users" });
    }
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
}

/**
 * @export
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise <void>}
 */
 export async function deleteInvite(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.body) {
      const invitedUser: IUserInvite = await InvitationService.deleteInvite(req.body.inviteId);
      if (invitedUser) {
        res.status(200).json(invitedUser);
      }
    } else {
      res.status(400).json({ message: "No users" });
    }
  } catch (error) {
    next(new HttpError(error.message.status, error.message));
  }
}