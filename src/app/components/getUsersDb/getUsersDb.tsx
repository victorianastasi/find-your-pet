import { useEffect, useState } from "react";
import { getUsersDb, db } from "../../firebase";
import { User } from "../models";
interface GetUsersProps {
  usersDB: User[];
  loadedUsers: boolean;
}

const GetUsersDB: () => GetUsersProps = () => {
  const [usersDB, setUsersDB] = useState<User[]>([]);
  const [loadedUsers, setLoadedUsers] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsersDb(db);
        setUsersDB(data as User[]);
        setLoadedUsers(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return { usersDB, loadedUsers };
};
export default GetUsersDB;
