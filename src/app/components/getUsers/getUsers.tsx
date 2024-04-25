import React, { useEffect, useState } from "react";
import { getUsers, db } from "../../firebase";
import { User } from "../models";
interface GetUsersProps {
    usersList: User[];
    loaded: boolean;
  }
  

const GetUsers: () => GetUsersProps = () => {
    const [usersList, setUsersList] = useState<User[]>([]);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
        try {
            const data = await getUsers(db);
            setUsersList(data as User[]);
            setLoaded(true);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        };

        fetchData();
    }, []);

    return { usersList, loaded };

};
export default GetUsers;