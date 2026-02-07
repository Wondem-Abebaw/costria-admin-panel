import EditEventsPage from "@/feature/events/details/page";
import EditVehiclePage from "@/feature/vehicle/details/page";

type Props = {
  params: Promise<{ id: string }>;
};

async function page({ params }: Props) {
  const { id } = await params;
  return <EditEventsPage params={{ id: id }} />;
}

export default page;
