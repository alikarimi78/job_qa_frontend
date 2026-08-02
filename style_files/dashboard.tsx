import Card from "@components/ui/Card";
import Loader from "@components/ui/Loader";
import { useGetDashboardDataQuery } from "@services/dashboardSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  LineController,
  BarController,
} from "chart.js";
import TypeRoleShow from "./components/TypeRoleShow";
import { useAppSelector } from "@store/hooks";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  LineController,
  BarController
);

export default function Dashboard() {
  document.title = "پیشخوان";
  const role = useAppSelector((state) => state.auth.role);
  const { data, isLoading } = useGetDashboardDataQuery();
  if (isLoading) {
    return (
      <Card size="small">
        <Loader />
      </Card>
    );
  }
  return (
    <div className="overflow-y-auto">
      {data?.data && <TypeRoleShow data={data.data} showType={role} />}
    </div>
  );
}
