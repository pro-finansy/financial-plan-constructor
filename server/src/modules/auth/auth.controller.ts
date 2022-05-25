import jwt from "jsonwebtoken";
import { dynamicsObject } from "../../interfaces";

import userModel from "../user/user.model";

import errorHandler from "../../utils/handler";
import sendEmail from '../email/index';
import { response } from "../../utils/response";
import { create } from "../../utils/password";
import { STATUSES } from "../../utils/enums";
import { check } from "../../utils/password";
import { Socket } from "../../utils/socket";
import { Request, Response } from "express";
import constants from './auth.constants';

const errorLogin = (res: Response) => response(res, STATUSES.CONFLICT, false, constants.WRONG_LOGIN);
const createToken = (user: dynamicsObject, duration: string) => jwt.sign({ _id: user._id, email: user.email, role: user.role, accesses: user.accesses }, process.env.JWT_KEY || '', { expiresIn: duration });

export const login = async function (req: Request, res: Response) {
  try {
    if (!req.body.email) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_EMAIL);
    const user = await userModel.findOne({ email: req.body.email.toLowerCase().trim() })
      .populate('course')
      .populate('avatar');
    if (!user) return errorLogin(res);
    if (!user.password) return response(res, STATUSES.FORBIDDEN, false, constants.PASSWORD_NULL);
    const passwordResult = check(req.body.password, user.password);
    if (!passwordResult) return errorLogin(res);
    if (!user.active) return response(res, STATUSES.FORBIDDEN, false, constants.DEACTIVE);

    user.token = createToken(user, '7d');
    await user.save();
    response(res, STATUSES.OK, true, null, user);
  } catch (err: any) {
    console.log(err);
    
    errorHandler(res, err);
  }
};

export const loginPassword = async function (req: Request, res: Response) {
  try {
    if (!req.body.email) return response(res, STATUSES.CONFLICT, false, constants.ERR_INPUT_EMAIL);
    const user = await userModel.findOne({ email: req.body.email.toLowerCase().trim() });
    if (!user) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_EXIST_USER);
    if (!user.active) return response(res, STATUSES.FORBIDDEN, false, constants.DEACTIVE);
    if (user.password) return response(res, STATUSES.CONFLICT, false, constants.PASSWORD_IS)

    user.reset = createToken(user, '30m');
    await user.save();

    sendEmail(constants.SRC_LOGIN_PASSWORD, { link: process.env.LIVE_URL + `/new/${user.reset}` }, user.email, constants.TITLE_LOGIN_PASSWORD);

    response(res, STATUSES.OK, true, constants.SENDED_EMAIL_REGISTER);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

const authentification = async function (req: Request, res: Response) {
  const user = await userModel.findById(res.locals.user._id)
    .populate('avatar')
    .populate('course')
    .select('name _id token email role phone course courses accesses avatar comments');
  if (!user) return response(res, STATUSES.CONFLICT, false, null);
  response(res, STATUSES.OK, true, null, user);
};

export const logout = async function (_req: Request, res: Response) {
  try {
    res.redirect('/auth');
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const reset = async function (req: Request, res: Response) {
  try {
    if (!req.body.email) return response(res, STATUSES.CONFLICT, false, constants.NOT_EMAIL);
    const user = await userModel.findOne({ email: req.body.email.toLowerCase().trim() });
    if (!user) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    if (!user.active) return response(res, STATUSES.FORBIDDEN, false, constants.DEACTIVE);

    user.reset = createToken(user, '30m');
    await user.save();

    sendEmail(constants.SRC_RESET, { link: process.env.LIVE_URL + `/reset/${user.reset}` }, user.email, constants.TITLE_RESET);

    response(res, STATUSES.OK, true, constants.SENDED_EMAIL_RESET)
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const change = async function (req: Request, res: Response) {
  try {
    if (req.body.password !== req.body.resetPassword)
      return response(res, STATUSES.CONFLICT, false, constants.PASSWORD_CONFLICT);

    const user = await userModel.findById(res.locals.user._id);
    if (!user) return response(res, STATUSES.NOT_FOUND, false, constants.NOT_FOUND);
    user.password = create(req.body.password);

    Socket.userAction('logout', user._id);

    await user.save();
    response(res, STATUSES.OK, true, constants.PASSWORD_EDITED);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export const reload = async function (_req: Request, res: Response) {
  try {
    Socket.reload();
    response(res, STATUSES.OK, true, null);
  } catch (err: any) {
    errorHandler(res, err);
  }
};

export default { authentification, login, loginPassword, logout, reset, change, reload };