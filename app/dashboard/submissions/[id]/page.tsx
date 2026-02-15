export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function SubmissionPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div>
      ID IS: {id}
    </div>
  );
}