import sinon from "sinon";

import { ToastContainer as ActualToastContainer } from "react-toastify";

export const toastSpiesObject = {
  success: sinon.spy(),
  error: sinon.spy(),
  info: sinon.spy(),
  warn: sinon.spy(),
};

export const toast = toastSpiesObject;

export const ToastContainer = ActualToastContainer;
