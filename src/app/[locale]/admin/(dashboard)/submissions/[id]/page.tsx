import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { SubmissionDetail } from "@/components/admin/SubmissionDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SubmissionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const submission = await prisma.submission.findUnique({
    where: { id },
  });

  if (!submission) {
    notFound();
  }

  return <SubmissionDetail submission={submission} />;
}
