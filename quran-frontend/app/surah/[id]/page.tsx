import SurahReader from "../../../Components/SurahReader/SurahReader";

export default async function SurahPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const surahId = parseInt(id, 10);

  if (isNaN(surahId) || surahId < 1 || surahId > 114) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Invalid Surah</h1>
          <p className="text-gray-500">Please select a valid surah (1-114).</p>
        </div>
      </div>
    );
  }

  return <SurahReader surahId={surahId} />;
}
