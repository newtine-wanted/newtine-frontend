import { notFound } from "next/navigation";
import { ComponentPreview } from "@/components/preview/component-preview";

export default function ComponentsPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <ComponentPreview />;
}
