export const dynamic = "force-dynamic";

export default async function SubmissionPage({ params }: any) {
  return (
    <div>
      ID IS: {params.id}
    </div>
  );
}