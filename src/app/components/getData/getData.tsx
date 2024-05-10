import React, { useEffect, useState } from "react";
import { getItems, db } from "../../firebase";
import { Item } from "../models";
interface GetDataProps {
  itemsList: Item[];
  loaded: boolean;
}

const GetData: () => GetDataProps = () => {
  const [itemsList, setItemsList] = useState<Item[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getItems(db);
        setItemsList(data as Item[]);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return { itemsList, loaded };
};
export default GetData;
