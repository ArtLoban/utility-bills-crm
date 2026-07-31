import { getPropertyList } from "../_data/queries";
import { PropertiesClient } from "./properties-client";

export const PropertiesContent = async () => {
  const properties = await getPropertyList();

  return <PropertiesClient properties={properties} />;
};
