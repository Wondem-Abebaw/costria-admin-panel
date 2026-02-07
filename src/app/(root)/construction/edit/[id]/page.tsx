import EditConstructionEquipmentPage from "@/feature/construction-equipment/details/page";

type Props = {
  params: Promise<{ id: string }>;
};

async function page({ params }: Props) {
  const { id } = await params;
  return <EditConstructionEquipmentPage params={{ id: id }} />;
}

export default page;
