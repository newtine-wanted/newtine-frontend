"use client";

import { Modal, type ModalProps } from "./modal";

export type BottomSheetProps = ModalProps;

export function BottomSheet(props: BottomSheetProps) {
  return <Modal {...props} variant="sheet" />;
}
