"use client";

import { Modal, type ModalProps } from "./modal";

export type DialogProps = ModalProps;

export function Dialog(props: DialogProps) {
  return <Modal {...props} variant="dialog" />;
}
