import { fetchModuleData } from "../../services/moduleService";
import ActionCard from "../Card/ActionCard";
import DataCarousel from "./DataCarousel";

const renderModuleCard = (item) => (
  <ActionCard
    title={item["title"]}
    text={item["description"]}
    imageSrc={item["image_url"]}
    to={item["redirect_url"]}
    isDisabled={!item["is_active"]}
  />
);

export default function ModuleCarousel() {
  return (
    <DataCarousel
      fetchDataFn={fetchModuleData}
      itemRenderer={renderModuleCard}
      errorKey="modules"
    />
  );
}
