import EditCommercialPage from "@/feature/commercial-house/details/page";
import EditConstructionEquipmentPage from "@/feature/construction-equipment/details/page";
import EditVehiclePage from "@/feature/vehicle/details/page";


type Props = {
  params: Promise<{ id: string }>;
};

async function page({ params }: Props) {
  const { id } = await params;
  return <EditCommercialPage params={{id:id}} />;
}

export default page;
